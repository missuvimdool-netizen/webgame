import React, { useState } from 'react';

const AdminLogin = ({ setCurrentPage, setAdminToken }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        setCurrentPage('admin-dashboard');
      } else {
        setError(data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '400px', 
        margin: '60px auto',
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '15px', 
        padding: '40px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <i className="fas fa-user-shield" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '20px' }}></i>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '10px' }}>
            เข้าสู่ระบบแอดมิน
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            กรุณาเข้าสู่ระบบเพื่อจัดการระบบ
          </p>
        </div>

        {error && (
          <div style={{ 
            background: '#ff4757', 
            color: 'white', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px'
              }}
              placeholder="กรอกชื่อผู้ใช้"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px'
              }}
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ 
              width: '100%', 
              fontSize: '16px',
              padding: '15px'
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>
                เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>ข้อมูลเข้าสู่ระบบ:</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '5px' }}>
            <strong>ชื่อผู้ใช้:</strong> admin
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <strong>รหัสผ่าน:</strong> admin123
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentPage('home')}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;