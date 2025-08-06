import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Shop = ({ setCurrentPage }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    search: '',
    featured: false
  });
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.search) params.append('search', filters.search);
      if (filters.featured) params.append('featured', 'true');

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert('เพิ่มสินค้าลงตะกร้าแล้ว!');
  };

  const handleViewProduct = (productId) => {
    localStorage.setItem('selectedProductId', productId);
    setCurrentPage('product-detail');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      search: '',
      featured: false
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: 'white', fontSize: '2.5rem' }}>
        ร้านค้า
      </h1>

      {/* Filters */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        padding: '30px', 
        borderRadius: '15px', 
        marginBottom: '40px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
              ค้นหาสินค้า:
            </label>
            <input
              type="text"
              placeholder="ชื่อสินค้า..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
              หมวดหมู่:
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px'
              }}
            >
              <option value="">ทุกหมวดหมู่</option>
              <option value="Gaming">เกม</option>
              <option value="Mobile Top-up">เติมเงินมือถือ</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>

          <div>
            <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
              ประเภท:
            </label>
            <select
              value={filters.subcategory}
              onChange={(e) => handleFilterChange('subcategory', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px'
              }}
            >
              <option value="">ทุกประเภท</option>
              <option value="ROV">ROV</option>
              <option value="Free Fire">Free Fire</option>
              <option value="PUBG Mobile">PUBG Mobile</option>
              <option value="Steam">Steam</option>
              <option value="AIS">AIS</option>
              <option value="True">True</option>
              <option value="DTAC">DTAC</option>
              <option value="TrueMoney">TrueMoney</option>
              <option value="Rabbit LINE Pay">Rabbit LINE Pay</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'end' }}>
            <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              สินค้าแนะนำ
            </label>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            className="btn btn-secondary"
            onClick={clearFilters}
            style={{ marginRight: '10px' }}
          >
            ล้างตัวกรอง
          </button>
          <span style={{ color: 'white' }}>
            พบสินค้า {products.length} รายการ
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          padding: '60px 20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px'
        }}>
          <i className="fas fa-search" style={{ fontSize: '4rem', marginBottom: '20px', opacity: '0.5' }}></i>
          <h3>ไม่พบสินค้า</h3>
          <p>ลองเปลี่ยนตัวกรองหรือค้นหาด้วยคำอื่น</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image"
                onClick={() => handleViewProduct(product.id)}
                style={{ cursor: 'pointer' }}
              />
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">
                  {product.discount > 0 && (
                    <span className="product-original-price">
                      ฿{product.original_price}
                    </span>
                  )}
                  ฿{product.price}
                  {product.discount > 0 && (
                    <span className="product-discount">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <p className="product-description">{product.description}</p>
                <div style={{ 
                  display: 'flex', 
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <span style={{ 
                    background: '#667eea', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem' 
                  }}>
                    {product.category}
                  </span>
                  {product.subcategory && (
                    <span style={{ 
                      background: '#764ba2', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem' 
                    }}>
                      {product.subcategory}
                    </span>
                  )}
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;