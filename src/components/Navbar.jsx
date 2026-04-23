import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiMenu, FiX, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMobileOpen(false);
    navigate('/');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const links = [['/', 'Home'], ['/products', 'Shop'], ['/orders', 'My Orders'], ['/support', 'Help'], ['/about', 'About']];

  const linkStyle = (path) => ({
    fontSize: 13, color: isActive(path) ? '#145530' : '#4a6b50', textDecoration: 'none',
    fontWeight: isActive(path) ? 700 : 600, borderBottom: isActive(path) ? '2px solid #145530' : '2px solid transparent',
    paddingBottom: 2, transition: 'all 0.2s',
  });

  return (
    <>
      <nav style={{ background: '#fff', borderBottom: '2px solid #e8f2ea', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(20,85,48,0.06)' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 22, color: '#145530', letterSpacing: '-0.5px' }}>
            apni<span style={{ color: '#f07c2a' }}>dukan</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 24 }} className="nav-desktop">
          {links.map(([path, label]) => (
            <Link key={path} to={path} style={linkStyle(path)}>{label}</Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }} className="nav-desktop">
              <div style={{ width: 30, height: 30, background: '#145530', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800 }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: 12, color: '#145530', fontWeight: 700 }}>{user.name ? user.name.split(' ')[0] : 'Profile'}</span>
            </Link>
          ) : (
            <Link to="/login" style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '7px 16px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }} className="nav-desktop">
              Login
            </Link>
          )}

          <Link to="/cart" style={{ position: 'relative', color: '#145530', fontSize: 22, display: 'flex', alignItems: 'center' }}>
            <FiShoppingCart />
            {count > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -8, background: '#f07c2a', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#145530', display: 'none', alignItems: 'center' }} className="nav-mobile-btn">
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderBottom: '2px solid #e8f2ea', padding: '12px 20px', display: 'none', flexDirection: 'column', zIndex: 99 }} className="nav-mobile-menu">
          {links.map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)}
              style={{ fontSize: 15, color: isActive(path) ? '#145530' : '#0a2e1a', textDecoration: 'none', fontWeight: isActive(path) ? 700 : 600, padding: '11px 0', borderBottom: '1px solid #f0f7f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {label}
              {isActive(path) && <span style={{ color: '#145530', fontSize: 12 }}>●</span>}
            </Link>
          ))}
          {user ? (
            <div style={{ paddingTop: 10 }}>
              <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid #f0f7f2' }}>
                <div style={{ width: 36, height: 36, background: '#145530', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2e1a' }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: '#6b8f71' }}>{user.email}</div>
                </div>
              </Link>
              <button onClick={logout} style={{ width: '100%', background: '#fee2e2', color: '#e24b4a', border: 'none', borderRadius: 50, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 10, fontFamily: 'Poppins, sans-serif' }}>
                Logout 👋
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}
              style={{ display: 'block', textAlign: 'center', background: '#145530', color: '#fff', borderRadius: 50, padding: '12px', fontWeight: 700, textDecoration: 'none', fontSize: 14, marginTop: 10 }}>
              Login / Sign Up
            </Link>
          )}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .nav-mobile-menu { display: flex !important; }
        }
      `}</style>
    </>
  );
}