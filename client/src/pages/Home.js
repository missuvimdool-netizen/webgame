import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Home = ({ setCurrentPage }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=6');
      const data = await response.json();
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert('เพิ่มสินค้าลงตะกร้าแล้ว!');
  };

  const handleViewProduct = (productId) => {
    // Store product ID in localStorage for ProductDetail page
    localStorage.setItem('selectedProductId', productId);
    setCurrentPage('product-detail');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Film Gaming Seller</h1>
          <p>แพลตฟอร์มขายสินค้าเกมและเติมเงินมือถือที่เชื่อถือได้</p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentPage('shop')}
            >
              ดูสินค้าทั้งหมด
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage('cart')}
            >
              ตะกร้าสินค้า
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'white', fontSize: '2rem' }}>
          สินค้าแนะนำ
        </h2>
        
        <div className="products-grid">
          {featuredProducts.map((product) => (
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

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentPage('shop')}
          >
            ดูสินค้าทั้งหมด
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        marginTop: '60px', 
        padding: '60px 0',
        borderRadius: '20px',
        margin: '60px 20px 0'
      }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'white', fontSize: '2rem' }}>
            ทำไมต้องเลือกเรา?
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '30px' 
          }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <i className="fas fa-bolt" style={{ fontSize: '3rem', marginBottom: '20px', color: '#667eea' }}></i>
              <h3>ส่งสินค้าเร็ว</h3>
              <p>ได้รับสินค้าภายใน 5-10 นาที หลังชำระเงิน</p>
            </div>
            
            <div style={{ textAlign: 'center', color: 'white' }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '3rem', marginBottom: '20px', color: '#667eea' }}></i>
              <h3>ปลอดภัย 100%</h3>
              <p>การชำระเงินและข้อมูลส่วนตัวของคุณปลอดภัย</p>
            </div>
            
            <div style={{ textAlign: 'center', color: 'white' }}>
              <i className="fas fa-headset" style={{ fontSize: '3rem', marginBottom: '20px', color: '#667eea' }}></i>
              <h3>บริการ 24/7</h3>
              <p>ทีมงานพร้อมให้บริการตลอด 24 ชั่วโมง</p>
            </div>
            
            <div style={{ textAlign: 'center', color: 'white' }}>
              <i className="fas fa-medal" style={{ fontSize: '3rem', marginBottom: '20px', color: '#667eea' }}></i>
              <h3>สินค้าแท้</h3>
              <p>สินค้าทั้งหมดเป็นของแท้ รับประกันคุณภาพ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;