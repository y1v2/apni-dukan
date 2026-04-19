import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
// Import logo - agar logo file hai to yeh use karo
// import logo from '../assets/logo.png';
// Navbar.jsx mein import add karo (top par):
import logo from '../assets/logo.png';

// Logo section replace karo:
<Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
  <img src={logo} alt="Apni Dukan" style={{ height: 52, width: 'auto' }} />
</Link>

export default function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [mobileMenu, setMobileMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const links = [['/', 'Home'], ['/products', 'Shop'], ['/orders', 'My Orders'], ['/support', 'Help'], ['/about', 'About']];

  return (
    <>
      <nav style={{ background: '#fff', borderBottom: '2px solid #e8f2ea', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(20,85,48,0.06)' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          {/* Agar logo image hai: */}
          {/* <img src={logo} alt="Apni Dukan" style={{ height: 48, width: 'auto' }} /> */}
          {/* Text logo (jab tak image nahi): */}
          <div style={{ fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 24, color: '#145530', letterSpacing: '-1px' }}>
            apni<span style={{ color: '#f07c2a' }}>dukan</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 24 }} className="desktop-nav">
          {links.map(([path, label]) => (
            <Link key={path} to={path} style={{ fontSize: 14, color: '#4a6b50', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#145530'}
              onMouseLeave={e => e.target.style.color = '#4a6b50'}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/profile" style={{ fontSize: 13, color: '#145530', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 32, background: '#145530', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 800 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hide-mobile">{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} style={{ background: '#fee2e2', border: 'none', color: '#e24b4a', cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 50, fontFamily: "'Poppins',sans-serif" }} className="hide-mobile">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '8px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Login
            </Link>
          )}

          <Link to="/cart" style={{ position: 'relative', color: '#145530', fontSize: 24, display: 'flex', alignItems: 'center' }}>
            <FiShoppingCart />
            {count > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -8, background: '#f07c2a', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#145530', display: 'none' }} className="mobile-menu-btn">
            {mobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div style={{ background: '#fff', borderBottom: '2px solid #e8f2ea', padding: '16px 24px', display: 'none', flexDirection: 'column', gap: 4, zIndex: 99 }} className="mobile-nav-menu">
          {links.map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMobileMenu(false)}
              style={{ fontSize: 15, color: '#0a2e1a', textDecoration: 'none', fontWeight: 600, padding: '10px 0', borderBottom: '1px solid #f0f7f2' }}>
              {label}
            </Link>
          ))}
          {user && <button onClick={logout} style={{ background: '#fee2e2', border: 'none', color: '#e24b4a', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '10px', borderRadius: 12, marginTop: 8, fontFamily: "'Poppins',sans-serif" }}>Logout</button>}
        </div>
      )}
    </>
  );
}