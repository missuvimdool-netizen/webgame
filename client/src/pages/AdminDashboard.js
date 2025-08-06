import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ setCurrentPage }) => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderStatus, setOrderStatus] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const ordersData = await ordersResponse.json();
      setOrders(ordersData);

      // Fetch products
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh orders
        fetchDashboardData();
        alert('อัปเดตสถานะคำสั่งซื้อสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'paid': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'รอชำระเงิน';
      case 'paid': return 'ชำระเงินแล้ว';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
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
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '15px', 
        padding: '30px',
        backdropFilter: 'blur(10px)',
        marginTop: '40px'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '2.5rem' }}>
            <i className="fas fa-tachometer-alt" style={{ marginRight: '15px', color: '#667eea' }}></i>
            แดชบอร์ดแอดมิน
          </h1>
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentPage('home')}
          >
            <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
            กลับหน้าหลัก
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '10px'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              background: activeTab === 'dashboard' ? '#667eea' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>
            สถิติ
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              background: activeTab === 'orders' ? '#667eea' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>
            คำสั่งซื้อ
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              background: activeTab === 'products' ? '#667eea' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <i className="fas fa-box" style={{ marginRight: '8px' }}></i>
            สินค้า
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center',
                color: 'white'
              }}>
                <i className="fas fa-shopping-cart" style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }}></i>
                <h3>คำสั่งซื้อทั้งหมด</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total_orders}</p>
              </div>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center',
                color: 'white'
              }}>
                <i className="fas fa-money-bill-wave" style={{ fontSize: '2rem', color: '#4CAF50', marginBottom: '10px' }}></i>
                <h3>รายได้รวม</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>฿{stats.total_revenue}</p>
              </div>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center',
                color: 'white'
              }}>
                <i className="fas fa-calendar-day" style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '10px' }}></i>
                <h3>คำสั่งซื้อวันนี้</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.today_orders}</p>
              </div>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center',
                color: 'white'
              }}>
                <i className="fas fa-chart-line" style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '10px' }}></i>
                <h3>รายได้วันนี้</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>฿{stats.today_revenue}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  marginRight: '10px'
                }}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="pending">รอชำระเงิน</option>
                <option value="paid">ชำระเงินแล้ว</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', color: 'white', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '15px', textAlign: 'left' }}>รหัสคำสั่งซื้อ</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>ลูกค้า</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>สินค้า</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>จำนวน</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>ราคารวม</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>สถานะ</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>วันที่</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter(order => orderStatus === 'all' || order.status === orderStatus)
                    .map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <td style={{ padding: '15px' }}>{order.order_id}</td>
                      <td style={{ padding: '15px' }}>
                        <div>
                          <div>{order.customer_name}</div>
                          <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>{order.customer_email}</div>
                          <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>{order.customer_phone}</div>
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>{order.product_name}</td>
                      <td style={{ padding: '15px' }}>{order.quantity}</td>
                      <td style={{ padding: '15px' }}>฿{order.total_amount}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          background: getStatusColor(order.status),
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        {new Date(order.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                          style={{
                            padding: '5px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '14px'
                          }}
                        >
                          <option value="pending">รอชำระเงิน</option>
                          <option value="paid">ชำระเงินแล้ว</option>
                          <option value="completed">เสร็จสิ้น</option>
                          <option value="cancelled">ยกเลิก</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '20px'
            }}>
              {products.map((product) => (
                <div key={product.id} style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '10px',
                  padding: '20px',
                  color: 'white'
                }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ 
                      width: '100%', 
                      height: '150px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}
                  />
                  <h3 style={{ marginBottom: '10px' }}>{product.name}</h3>
                  <p style={{ marginBottom: '10px', opacity: '0.8' }}>{product.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>ราคา: ฿{product.price}</span>
                    <span>คงเหลือ: {product.stock_quantity}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;