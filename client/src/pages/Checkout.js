import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Checkout = ({ setCurrentPage }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_line: '',
    payment_method: 'bank_transfer',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('ตะกร้าสินค้าว่าง กรุณาเลือกสินค้าก่อน');
      return;
    }

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);

    try {
      // Create orders for each item
      const orderPromises = items.map(item => 
        fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            customer_line: formData.customer_line,
            product_id: item.id,
            quantity: item.quantity,
            payment_method: formData.payment_method,
            notes: formData.notes
          })
        }).then(res => res.json())
      );

      const orderResults = await Promise.all(orderPromises);
      
      if (orderResults.every(result => result.success)) {
        setOrderData(orderResults[0]); // Use first order for display
        setOrderSuccess(true);
        clearCart();
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && orderData) {
    return (
      <div className="container">
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '15px', 
          padding: '40px',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          color: 'white',
          marginTop: '40px'
        }}>
          <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: '#4CAF50', marginBottom: '20px' }}></i>
          <h1>คำสั่งซื้อสำเร็จ!</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            ขอบคุณสำหรับการสั่งซื้อ เราจะดำเนินการส่งสินค้าให้คุณเร็วที่สุด
          </p>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '30px', 
            borderRadius: '10px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3>รายละเอียดคำสั่งซื้อ:</h3>
            <p><strong>รหัสคำสั่งซื้อ:</strong> {orderData.order.order_id}</p>
            <p><strong>รหัสสินค้า:</strong> {orderData.order.product_code}</p>
            <p><strong>ชื่อสินค้า:</strong> {orderData.order.product_name}</p>
            <p><strong>จำนวน:</strong> {orderData.order.quantity}</p>
            <p><strong>ราคารวม:</strong> ฿{orderData.order.total_amount}</p>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '30px', 
            borderRadius: '10px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3>ข้อมูลการชำระเงิน:</h3>
            <p><strong>บัญชีธนาคาร:</strong> {orderData.order.payment_info.bank_account}</p>
            <p><strong>PromptPay ID:</strong> {orderData.order.payment_info.promptpay_id}</p>
            <p><strong>LINE ID:</strong> {orderData.order.payment_info.line_id}</p>
            <p style={{ color: '#FFD700', fontWeight: 'bold' }}>
              กรุณาชำระเงินภายใน 30 นาที เพื่อให้เราสามารถส่งสินค้าให้คุณได้เร็วที่สุด
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentPage('home')}
            >
              กลับหน้าหลัก
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage('shop')}
            >
              เลือกสินค้าต่อ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: 'white', fontSize: '2.5rem' }}>
        ดำเนินการสั่งซื้อ
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 400px', 
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Order Form */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '15px', 
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '30px' }}>
            ข้อมูลการสั่งซื้อ
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
                  อีเมล *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
                  เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
                  LINE ID
                </label>
                <input
                  type="text"
                  name="customer_line"
                  value={formData.customer_line}
                  onChange={handleInputChange}
                  placeholder="@username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
                วิธีการชำระเงิน
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px'
                }}
              >
                <option value="bank_transfer">โอนเงินผ่านธนาคาร</option>
                <option value="promptpay">PromptPay</option>
                <option value="line_pay">LINE Pay</option>
                <option value="truemoney">TrueMoney Wallet</option>
              </select>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
                หมายเหตุ (ไม่บังคับ)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                placeholder="ระบุรายละเอียดเพิ่มเติม..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button 
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ 
                width: '100%', 
                fontSize: '18px',
                padding: '15px'
              }}
            >
              {loading ? 'กำลังดำเนินการ...' : 'ยืนยันคำสั่งซื้อ'}
            </button>
          </form>
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

          <div style={{ 
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px'
          }}>
            <p><i className="fas fa-info-circle"></i> หลังจากยืนยันคำสั่งซื้อ เราจะส่งข้อมูลการชำระเงินให้คุณ</p>
            <p><i className="fas fa-clock"></i> สินค้าจะถูกส่งภายใน 5-10 นาทีหลังชำระเงิน</p>
            <p><i className="fas fa-shield-alt"></i> ข้อมูลของคุณจะถูกเก็บเป็นความลับ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;