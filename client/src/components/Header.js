import React from 'react';

const Header = ({ currentPage, setCurrentPage, isAdmin, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <a href="#" className="logo" onClick={() => setCurrentPage('home')}>
          <i className="fas fa-gamepad"></i>
          Film Gaming Seller
        </a>
        
        <nav>
          <ul className="nav-menu">
            <li>
              <a 
                href="#" 
                className={currentPage === 'home' ? 'active' : ''}
                onClick={() => setCurrentPage('home')}
              >
                หน้าแรก
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={currentPage === 'shop' ? 'active' : ''}
                onClick={() => setCurrentPage('shop')}
              >
                ร้านค้า
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={currentPage === 'cart' ? 'active' : ''}
                onClick={() => setCurrentPage('cart')}
              >
                ตะกร้า <i className="fas fa-shopping-cart"></i>
              </a>
            </li>
            {isAdmin ? (
              <>
                <li>
                  <a 
                    href="#" 
                    className={currentPage === 'admin-dashboard' ? 'active' : ''}
                    onClick={() => setCurrentPage('admin-dashboard')}
                  >
                    แอดมิน
                  </a>
                </li>
                <li>
                  <a href="#" onClick={onLogout} className="admin-btn">
                    ออกจากระบบ
                  </a>
                </li>
              </>
            ) : (
              <li>
                <a 
                  href="#" 
                  className={currentPage === 'admin-login' ? 'active' : ''}
                  onClick={() => setCurrentPage('admin-login')}
                  className="admin-btn"
                >
                  เข้าสู่ระบบแอดมิน
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;