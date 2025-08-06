import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ProductDetail = ({ setCurrentPage }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const productId = localStorage.getItem('selectedProductId');
    if (productId) {
      fetchProduct(productId);
    } else {
      setCurrentPage('shop');
    }
  }, []);

  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('ไม่พบสินค้านี้');
      setCurrentPage('shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('เพิ่มสินค้าลงตะกร้าแล้ว!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      setCurrentPage('checkout');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          padding: '60px 20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          marginTop: '40px'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', marginBottom: '20px', color: '#ff4757' }}></i>
          <h2>ไม่พบสินค้า</h2>
          <p>สินค้านี้อาจถูกลบออกไปแล้ว</p>
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentPage('shop')}
            style={{ marginTop: '20px' }}
          >
            กลับไปร้านค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '15px', 
        padding: '40px',
        backdropFilter: 'blur(10px)',
        marginTop: '40px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Product Image */}
          <div>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ 
                width: '100%', 
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>

          {/* Product Info */}
          <div style={{ color: 'white' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                {product.discount > 0 && (
                  <span className="product-original-price" style={{ fontSize: '1.2rem' }}>
                    ฿{product.original_price}
                  </span>
                )}
                <span style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                  ฿{product.price}
                </span>
                {product.discount > 0 && (
                  <span className="product-discount" style={{ fontSize: '1rem' }}>
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.6', 
              marginBottom: '30px',
              opacity: '0.9'
            }}>
              {product.description}
            </p>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span style={{ 
                  background: '#667eea', 
                  color: 'white', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  fontSize: '0.9rem' 
                }}>
                  {product.category}
                </span>
                {product.subcategory && (
                  <span style={{ 
                    background: '#764ba2', 
                    color: 'white', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    fontSize: '0.9rem' 
                  }}>
                    {product.subcategory}
                  </span>
                )}
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                marginBottom: '10px'
              }}>
                <i className="fas fa-box" style={{ color: '#667eea' }}></i>
                <span>สินค้าคงเหลือ: {product.stock_quantity} ชิ้น</span>
              </div>

              {product.is_featured && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  color: '#FFD700'
                }}>
                  <i className="fas fa-star"></i>
                  <span>สินค้าแนะนำ</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                จำนวน:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: quantity <= 1 ? '#666' : '#667eea',
                    color: 'white',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '18px'
                  }}
                >
                  -
                </button>
                
                <span style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600',
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: quantity >= product.stock_quantity ? '#666' : '#667eea',
                    color: 'white',
                    cursor: quantity >= product.stock_quantity ? 'not-allowed' : 'pointer',
                    fontSize: '18px'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
              <button 
                className="btn btn-primary"
                onClick={handleAddToCart}
                style={{ flex: 1, fontSize: '16px', padding: '15px' }}
                disabled={product.stock_quantity === 0}
              >
                <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>
                เพิ่มลงตะกร้า
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={handleBuyNow}
                style={{ flex: 1, fontSize: '16px', padding: '15px' }}
                disabled={product.stock_quantity === 0}
              >
                <i className="fas fa-bolt" style={{ marginRight: '8px' }}></i>
                ซื้อเลย
              </button>
            </div>

            {product.stock_quantity === 0 && (
              <div style={{ 
                background: '#ff4757', 
                color: 'white', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                สินค้าหมด
              </div>
            )}

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '20px', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <p><i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
                สินค้าแท้ รับประกันคุณภาพ 100%
              </p>
              <p><i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                ส่งสินค้าภายใน 5-10 นาทีหลังชำระเงิน
              </p>
              <p><i className="fas fa-headset" style={{ marginRight: '8px' }}></i>
                บริการลูกค้า 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentPage('shop')}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
            กลับไปร้านค้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;