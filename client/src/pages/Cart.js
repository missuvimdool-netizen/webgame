import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = ({ setCurrentPage }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('ตะกร้าสินค้าว่าง กรุณาเลือกสินค้าก่อน');
      return;
    }
    setCurrentPage('checkout');
  };

  const handleContinueShopping = () => {
    setCurrentPage('shop');
  };

  if (items.length === 0) {
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
          <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', marginBottom: '20px', opacity: '0.5' }}></i>
          <h2>ตะกร้าสินค้าว่าง</h2>
          <p>คุณยังไม่มีสินค้าในตะกร้า</p>
          <button 
            className="btn btn-primary"
            onClick={handleContinueShopping}
            style={{ marginTop: '20px' }}
          >
            ไปเลือกสินค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: 'white', fontSize: '2.5rem' }}>
        ตะกร้าสินค้า
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 350px', 
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Cart Items */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '15px', 
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '30px' }}>
            สินค้าในตะกร้า ({items.length} รายการ)
          </h2>

          {items.map((item) => (
            <div key={item.id} style={{ 
              display: 'flex', 
              gap: '20px', 
              padding: '20px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              alignItems: 'center'
            }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', marginBottom: '5px' }}>{item.name}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', fontWeight: '600' }}>
                  ฿{item.price}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#667eea',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  -
                </button>
                
                <span style={{ 
                  color: 'white', 
                  minWidth: '40px', 
                  textAlign: 'center',
                  fontSize: '16px'
                }}>
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#667eea',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  +
                </button>
              </div>

              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>
                  ฿{item.price * item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4757',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '5px'
                }}
                title="ลบสินค้า"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              className="btn btn-secondary"
              onClick={clearCart}
              style={{ marginRight: '10px' }}
            >
              ล้างตะกร้า
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleContinueShopping}
            >
              เลือกสินค้าต่อ
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '15px', 
          padding: '30px',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: '20px'
        }}>
          <h2 style={{ color: 'white', marginBottom: '30px' }}>
            สรุปคำสั่งซื้อ
          </h2>

          <div style={{ marginBottom: '20px' }}>
            {items.map((item) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                color: 'white'
              }}>
                <span>{item.name} x {item.quantity}</span>
                <span>฿{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <hr style={{ border: '1px solid rgba(255, 255, 255, 0.2)', margin: '20px 0' }} />

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '30px',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            <span>รวมทั้งหมด:</span>
            <span>฿{getTotalPrice()}</span>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleCheckout}
            style={{ 
              width: '100%', 
              fontSize: '18px',
              padding: '15px'
            }}
          >
            ดำเนินการสั่งซื้อ
          </button>

          <div style={{ 
            marginTop: '20px', 
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px'
          }}>
            <p><i className="fas fa-info-circle"></i> การชำระเงินจะดำเนินการหลังจากยืนยันคำสั่งซื้อ</p>
            <p><i className="fas fa-clock"></i> สินค้าจะถูกส่งภายใน 5-10 นาที</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;