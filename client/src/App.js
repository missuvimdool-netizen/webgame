import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (adminToken) {
      setIsAdmin(true);
    }
  }, [adminToken]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'shop':
        return <Shop setCurrentPage={setCurrentPage} />;
      case 'product-detail':
        return <ProductDetail setCurrentPage={setCurrentPage} />;
      case 'cart':
        return <Cart setCurrentPage={setCurrentPage} />;
      case 'checkout':
        return <Checkout setCurrentPage={setCurrentPage} />;
      case 'admin-login':
        return <AdminLogin setCurrentPage={setCurrentPage} setAdminToken={setAdminToken} />;
      case 'admin-dashboard':
        return <AdminDashboard setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAdmin(false);
    setCurrentPage('home');
  };

  return (
    <CartProvider>
      <div className="App">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
        <main className="main-content">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;