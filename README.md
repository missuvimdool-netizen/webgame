# Film Gaming Seller - E-commerce Platform

## 🎮 ระบบขายสินค้าเกมและเติมเงินมือถือ

Film Gaming Seller เป็นแพลตฟอร์ม e-commerce ที่ครบครันสำหรับการขายสินค้าเกมและเติมเงินมือถือในประเทศไทย

## ✨ คุณสมบัติหลัก

### 🛍️ สำหรับลูกค้า
- **หน้าหลัก** - แสดงสินค้าแนะนำและข้อมูลบริษัท
- **ร้านค้า** - ดูสินค้าทั้งหมดพร้อมระบบค้นหาและกรอง
- **รายละเอียดสินค้า** - ดูข้อมูลสินค้าแบบละเอียด
- **ตะกร้าสินค้า** - จัดการสินค้าในตะกร้า
- **สั่งซื้อ** - ระบบสั่งซื้อและชำระเงิน
- **การชำระเงิน** - รองรับหลายช่องทาง (โอนเงิน, PromptPay, LINE Pay, TrueMoney)

### 🔧 สำหรับแอดมิน
- **แดชบอร์ด** - ดูสถิติการขายและรายได้
- **จัดการคำสั่งซื้อ** - อัปเดตสถานะคำสั่งซื้อ
- **จัดการสินค้า** - ดูข้อมูลสินค้าทั้งหมด
- **ระบบความปลอดภัย** - JWT Authentication

## 🛠️ เทคโนโลยีที่ใช้

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet.js** - Security headers
- **Rate Limiting** - API protection
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **CSS3** - Styling with modern design
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Kanit font)

## 📦 สินค้าที่รองรับ

### 🎮 เกมไทย
- **ROV: Mobile Legends** - Diamonds 42฿, 85฿, 170฿
- **Free Fire** - Diamonds 32฿, 65฿
- **PUBG Mobile** - UC 32฿

### 📱 เติมเงินมือถือ
- **AIS** - Credit 20฿
- **True** - Credit 20฿
- **DTAC** - Credit 20฿

### 🌐 เกมสากล
- **Steam Wallet** - Various amounts

### 💳 E-Wallet
- **TrueMoney Wallet** - Various amounts
- **Rabbit LINE Pay** - Various amounts

## 🚀 การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies
```bash
# ติดตั้ง Backend dependencies
npm install

# ติดตั้ง Frontend dependencies
cd client
npm install
cd ..
```

### 2. สร้าง Frontend Build
```bash
cd client
npm run build
cd ..
```

### 3. เริ่มต้นเซิร์ฟเวอร์
```bash
npm start
```

### 4. เข้าถึงระบบ
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api

## 🔐 ข้อมูลเข้าสู่ระบบแอดมิน

- **Username**: admin
- **Password**: admin123

## 📊 API Endpoints

### Public APIs
- `GET /api/products` - ดึงข้อมูลสินค้าทั้งหมด
- `GET /api/products/:id` - ดึงข้อมูลสินค้าตาม ID
- `POST /api/orders` - สร้างคำสั่งซื้อใหม่

### Admin APIs (ต้องมี JWT Token)
- `POST /api/admin/login` - เข้าสู่ระบบแอดมิน
- `GET /api/admin/stats` - ดึงสถิติแดชบอร์ด
- `GET /api/admin/orders` - ดึงข้อมูลคำสั่งซื้อทั้งหมด
- `PUT /api/admin/orders/:id` - อัปเดตสถานะคำสั่งซื้อ
- `GET /api/admin/settings` - ดึงการตั้งค่าระบบ
- `PUT /api/admin/settings` - อัปเดตการตั้งค่าระบบ

## 🗄️ โครงสร้างฐานข้อมูล

### ตาราง products
- id, name, description, price, original_price, discount_percent
- category, subcategory, image_url, is_featured, is_active
- stock_quantity, api_provider, api_product_id, created_at

### ตาราง orders
- id, order_id, customer_name, customer_email, customer_phone
- customer_line, product_id, product_name, quantity, total_amount
- payment_method, status, payment_status, notes, created_at

### ตาราง admin_users
- id, username, password_hash, created_at

### ตาราง settings
- id, bank_account, promptpay_id, line_id, contact_email, contact_phone

## 🔒 ความปลอดภัย

- **JWT Authentication** - สำหรับแอดมิน
- **Password Hashing** - ใช้ bcryptjs
- **Rate Limiting** - ป้องกัน API abuse
- **CORS Protection** - ควบคุมการเข้าถึง
- **Helmet.js** - Security headers
- **SQL Injection Protection** - Parameterized queries

## 🎨 การออกแบบ UI/UX

- **Modern Design** - ใช้ gradient และ glassmorphism
- **Responsive** - รองรับทุกขนาดหน้าจอ
- **Thai Language** - ภาษาไทยเต็มรูปแบบ
- **Loading States** - แสดงสถานะการโหลด
- **Error Handling** - จัดการข้อผิดพลาดอย่างเหมาะสม

## 📱 คุณสมบัติพิเศษ

### 🛒 ระบบตะกร้าสินค้า
- เพิ่ม/ลบสินค้า
- ปรับจำนวนสินค้า
- คำนวณราคารวมอัตโนมัติ
- เก็บข้อมูลใน localStorage

### 🔍 ระบบค้นหาและกรอง
- ค้นหาตามชื่อสินค้า
- กรองตามหมวดหมู่
- กรองตามประเภท
- แสดงเฉพาะสินค้าแนะนำ

### 💳 ระบบชำระเงิน
- รองรับหลายช่องทาง
- แสดงข้อมูลการโอนเงิน
- ระบบยืนยันการชำระเงิน

### 📊 แดชบอร์ดแอดมิน
- สถิติการขาย
- จัดการคำสั่งซื้อ
- ดูข้อมูลสินค้า
- อัปเดตสถานะออนไลน์

## 🌟 คุณสมบัติเด่น

1. **ระบบจริง** - ไม่ใช่การจำลอง ทุกฟังก์ชันใช้งานได้จริง
2. **API Integration** - เตรียมพร้อมสำหรับการเชื่อมต่อ API จริง
3. **Database** - ใช้ SQLite สำหรับเก็บข้อมูล
4. **Authentication** - ระบบเข้าสู่ระบบที่ปลอดภัย
5. **Order Management** - จัดการคำสั่งซื้อแบบครบวงจร
6. **Product Management** - จัดการสินค้าและสต็อก
7. **Payment Integration** - รองรับการชำระเงินหลายรูปแบบ
8. **Responsive Design** - ใช้งานได้ทุกอุปกรณ์

## 🚀 การ Deploy

ระบบพร้อมสำหรับการ deploy บน:
- **Heroku**
- **Vercel**
- **Netlify**
- **DigitalOcean**
- **AWS**

## 📞 ติดต่อ

- **Email**: contact@filmgamingseller.com
- **Phone**: 081-234-5678
- **LINE**: @filmgamingseller

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

**Film Gaming Seller** - แพลตฟอร์ม e-commerce ที่ครบครันสำหรับการขายสินค้าเกมและเติมเงินมือถือในประเทศไทย 🎮📱