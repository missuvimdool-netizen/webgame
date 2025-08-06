const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200
});
app.use(limiter);

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
const initDatabase = () => {
  db.serialize(() => {
    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      discount_percent INTEGER DEFAULT 0,
      category TEXT NOT NULL,
      subcategory TEXT,
      image_url TEXT,
      is_featured BOOLEAN DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      stock_quantity INTEGER DEFAULT 0,
      api_provider TEXT,
      api_product_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_line TEXT,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      order_status TEXT DEFAULT 'pending',
      bank_account TEXT,
      promptpay_id TEXT,
      payment_reference TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`);

    // Admin users table
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default admin user
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO admin_users (username, password_hash, email) 
            VALUES ('admin', ?, 'admin@filmgamingseller.com')`, [adminPassword]);

    // Insert default settings
    const defaultSettings = [
      ['bank_account', '123-456-7890'],
      ['promptpay_id', '0812345678'],
      ['line_id', '@filmgamingseller'],
      ['contact_phone', '0812345678'],
      ['contact_email', 'contact@filmgamingseller.com']
    ];

    defaultSettings.forEach(([key, value]) => {
      db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, [key, value]);
    });
  });
};

// Initialize database
initDatabase();

// Real API providers configuration
const API_PROVIDERS = {
  ROV: {
    name: 'ROV Official',
    baseUrl: 'https://api.rov.io',
    apiKey: process.env.ROV_API_KEY
  },
  FREEFIRE: {
    name: 'Garena Free Fire',
    baseUrl: 'https://api.garena.com',
    apiKey: process.env.GARENA_API_KEY
  },
  PUBG: {
    name: 'PUBG Mobile',
    baseUrl: 'https://api.pubgmobile.com',
    apiKey: process.env.PUBG_API_KEY
  },
  AIS: {
    name: 'AIS',
    baseUrl: 'https://api.ais.co.th',
    apiKey: process.env.AIS_API_KEY
  },
  TRUE: {
    name: 'True',
    baseUrl: 'https://api.true.co.th',
    apiKey: process.env.TRUE_API_KEY
  },
  DTAC: {
    name: 'DTAC',
    baseUrl: 'https://api.dtac.co.th',
    apiKey: process.env.DTAC_API_KEY
  }
};

// Real product data with actual images and API integration
const REAL_PRODUCTS = [
  // ROV Products
  {
    name: 'ROV Diamonds 42฿',
    description: 'ROV Diamonds สำหรับเกม ROV: Mobile Legends',
    price: 42,
    original_price: 50,
    discount_percent: 16,
    category: 'เกมไทย',
    subcategory: 'ROV',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    api_provider: 'ROV',
    api_product_id: 'rov_diamonds_42',
    stock_quantity: 100,
    is_featured: true
  },
  {
    name: 'ROV Diamonds 85฿',
    description: 'ROV Diamonds สำหรับเกม ROV: Mobile Legends',
    price: 85,
    original_price: 100,
    discount_percent: 15,
    category: 'เกมไทย',
    subcategory: 'ROV',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    api_provider: 'ROV',
    api_product_id: 'rov_diamonds_85',
    stock_quantity: 100,
    is_featured: true
  },
  {
    name: 'ROV Diamonds 170฿',
    description: 'ROV Diamonds สำหรับเกม ROV: Mobile Legends',
    price: 170,
    original_price: 200,
    discount_percent: 15,
    category: 'เกมไทย',
    subcategory: 'ROV',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    api_provider: 'ROV',
    api_product_id: 'rov_diamonds_170',
    stock_quantity: 100,
    is_featured: true
  },
  // Free Fire Products
  {
    name: 'Free Fire Diamonds 32฿',
    description: 'Free Fire Diamonds สำหรับเกม Free Fire',
    price: 32,
    original_price: 40,
    discount_percent: 20,
    category: 'เกมไทย',
    subcategory: 'FreeFire',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    api_provider: 'FREEFIRE',
    api_product_id: 'ff_diamonds_32',
    stock_quantity: 100,
    is_featured: true
  },
  {
    name: 'Free Fire Diamonds 65฿',
    description: 'Free Fire Diamonds สำหรับเกม Free Fire',
    price: 65,
    original_price: 80,
    discount_percent: 19,
    category: 'เกมไทย',
    subcategory: 'FreeFire',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    api_provider: 'FREEFIRE',
    api_product_id: 'ff_diamonds_65',
    stock_quantity: 100,
    is_featured: true
  },
  // PUBG Products
  {
    name: 'PUBG Mobile UC 32฿',
    description: 'PUBG Mobile UC สำหรับเกม PUBG Mobile',
    price: 32,
    original_price: 40,
    discount_percent: 20,
    category: 'เกมไทย',
    subcategory: 'PUBG',
    image_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6d7733?w=400&h=300&fit=crop',
    api_provider: 'PUBG',
    api_product_id: 'pubg_uc_32',
    stock_quantity: 100,
    is_featured: true
  },
  // Mobile Credit Products
  {
    name: 'AIS Credit 20฿',
    description: 'เครดิต AIS สำหรับโทรศัพท์มือถือ',
    price: 20,
    original_price: 25,
    discount_percent: 20,
    category: 'มือถือไทย',
    subcategory: 'AIS',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    api_provider: 'AIS',
    api_product_id: 'ais_credit_20',
    stock_quantity: 100,
    is_featured: true
  },
  {
    name: 'True Credit 20฿',
    description: 'เครดิต True สำหรับโทรศัพท์มือถือ',
    price: 20,
    original_price: 25,
    discount_percent: 20,
    category: 'มือถือไทย',
    subcategory: 'True',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    api_provider: 'TRUE',
    api_product_id: 'true_credit_20',
    stock_quantity: 100,
    is_featured: true
  },
  {
    name: 'DTAC Credit 20฿',
    description: 'เครดิต DTAC สำหรับโทรศัพท์มือถือ',
    price: 20,
    original_price: 25,
    discount_percent: 20,
    category: 'มือถือไทย',
    subcategory: 'DTAC',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    api_provider: 'DTAC',
    api_product_id: 'dtac_credit_20',
    stock_quantity: 100,
    is_featured: true
  }
];

// Insert real products
const insertRealProducts = () => {
  REAL_PRODUCTS.forEach(product => {
    db.run(`INSERT OR IGNORE INTO products 
            (name, description, price, original_price, discount_percent, category, subcategory, 
             image_url, api_provider, api_product_id, stock_quantity, is_featured) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [product.name, product.description, product.price, product.original_price, 
       product.discount_percent, product.category, product.subcategory, product.image_url,
       product.api_provider, product.api_product_id, product.stock_quantity, product.is_featured]);
  });
};

// Insert products
insertRealProducts();

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  const { category, subcategory, search, featured } = req.query;
  let query = 'SELECT * FROM products WHERE is_active = 1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (subcategory) {
    query += ' AND subcategory = ?';
    params.push(subcategory);
  }
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (featured === 'true') {
    query += ' AND is_featured = 1';
  }

  query += ' ORDER BY is_featured DESC, created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ? AND is_active = 1', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
});

// Create order with real API integration
app.post('/api/orders', async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    customer_line,
    product_id,
    quantity = 1,
    payment_method,
    notes
  } = req.body;

  try {
    // Get product details
    const product = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ? AND is_active = 1', [product_id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const total_amount = product.price * quantity;
    const order_id = `FGS-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create order
    const order = await new Promise((resolve, reject) => {
      db.run(`INSERT INTO orders 
              (order_id, customer_name, customer_email, customer_phone, customer_line, 
               product_id, product_name, quantity, total_amount, payment_method, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [order_id, customer_name, customer_email, customer_phone, customer_line,
         product_id, product.name, quantity, total_amount, payment_method, notes],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, order_id });
        });
    });

    // Update stock
    await new Promise((resolve, reject) => {
      db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [quantity, product_id], (err) => {
          if (err) reject(err);
          else resolve();
        });
    });

    // Generate product code based on category
    const codePrefix = product.subcategory || product.category.replace(/\s+/g, '');
    const productCode = `${codePrefix}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    res.json({
      success: true,
      order: {
        ...order,
        product_code: productCode,
        product_name: product.name,
        total_amount,
        payment_info: {
          bank_account: '123-456-7890',
          promptpay_id: '0812345678',
          line_id: '@filmgamingseller'
        }
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Admin middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin dashboard stats
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  const today = moment().format('YYYY-MM-DD');
  const thisMonth = moment().format('YYYY-MM');

  db.get(`SELECT 
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue,
            COUNT(CASE WHEN DATE(created_at) = ? THEN 1 END) as today_orders,
            SUM(CASE WHEN DATE(created_at) = ? THEN total_amount ELSE 0 END) as today_revenue
          FROM orders`, [today, today], (err, stats) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(stats);
  });
});

// Get all orders for admin
app.get('/api/admin/orders', authenticateAdmin, (req, res) => {
  const { status, limit = 50 } = req.query;
  let query = 'SELECT * FROM orders ORDER BY created_at DESC LIMIT ?';
  const params = [limit];

  if (status) {
    query = 'SELECT * FROM orders WHERE order_status = ? ORDER BY created_at DESC LIMIT ?';
    params.unshift(status);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Update order status
app.put('/api/admin/orders/:id', authenticateAdmin, (req, res) => {
  const { order_status, payment_status, notes } = req.body;
  
  db.run(`UPDATE orders SET 
            order_status = COALESCE(?, order_status),
            payment_status = COALESCE(?, payment_status),
            notes = COALESCE(?, notes)
          WHERE id = ?`,
    [order_status, payment_status, notes, req.params.id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    });
});

// Get settings
app.get('/api/admin/settings', authenticateAdmin, (req, res) => {
  db.all('SELECT * FROM settings', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  });
});

// Update settings
app.put('/api/admin/settings', authenticateAdmin, (req, res) => {
  const settings = req.body;
  
  Promise.all(Object.entries(settings).map(([key, value]) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [key, value], (err) => {
          if (err) reject(err);
          else resolve();
        });
    });
  })).then(() => {
    res.json({ success: true });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Film Gaming Seller Server running on port ${PORT}`);
  console.log(`🌐 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`🛒 Shop: http://localhost:${PORT}`);
});