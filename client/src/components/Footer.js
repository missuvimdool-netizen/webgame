import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Film Gaming Seller</h3>
          <p>แพลตฟอร์มขายสินค้าเกมและเติมเงินมือถือที่เชื่อถือได้</p>
          <p>บริการ 24/7 ตลอด 24 ชั่วโมง</p>
        </div>
        
        <div className="footer-section">
          <h3>บริการของเรา</h3>
          <p>• สินค้าเกม (ROV, Free Fire, PUBG)</p>
          <p>• เติมเงินมือถือ (AIS, True, DTAC)</p>
          <p>• Steam Wallet</p>
          <p>• E-Wallet (TrueMoney, Rabbit LINE Pay)</p>
        </div>
        
        <div className="footer-section">
          <h3>ติดต่อเรา</h3>
          <p><i className="fas fa-phone"></i> 081-234-5678</p>
          <p><i className="fas fa-envelope"></i> contact@filmgamingseller.com</p>
          <p><i className="fab fa-line"></i> @filmgamingseller</p>
        </div>
        
        <div className="footer-section">
          <h3>ช่องทางการชำระเงิน</h3>
          <p>• โอนเงินผ่านธนาคาร</p>
          <p>• PromptPay</p>
          <p>• LINE Pay</p>
          <p>• TrueMoney Wallet</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Film Gaming Seller. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;