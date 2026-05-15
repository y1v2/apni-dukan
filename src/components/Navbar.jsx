import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { FiShoppingCart, FiMenu, FiX, FiBell } from 'react-icons/fi';

let LogoImg = null;
try { LogoImg = require('../assets/logo.png'); } catch {}

export default function Navbar() {
  const { count } = useCart();
  const { notifications } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [mobileOpen, setMobileOpen] = useState(false);

  const unread = user ? notifications.filter(n => !(n.readBy || []).includes(user.email)).length : 0;
  const isActive = p => location.pathname === p;
  const links = [['/', 'Home'], ['/products', 'Shop'], ['/orders', 'Orders'], ['/support', 'Help'], ['/about', 'About']];

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); window.location.reload(); };

  return (
    <>
      {/* Attractive Top Bar */}
      <div style={{ background: 'linear-gradient(90deg, #0a2e1a, #145530, #0a2e1a)', padding: '0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 11, color: '#86efac', fontWeight: 500, whiteSpace: 'nowrap' }}>⚡ 30-min delivery</span>
            <span style={{ fontSize: 11, color: '#86efac', fontWeight: 500, whiteSpace: 'nowrap' }}>🌿 100% Fresh</span>
          </div>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', flexShrink: 0 }}>
            {LogoImg ? (
              <img src={LogoImg} alt="Apni Dukan" style={{ height: 36, width: 'auto', verticalAlign: 'middle' }} />
            ) : (
              <span>apni<span style={{ color: '#f07c2a' }}>dukan</span></span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 11, color: '#86efac', fontWeight: 500, whiteSpace: 'nowrap' }}>💳 COD Available</span>
            <span style={{ fontSize: 11, color: '#86efac', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'livepulse 1.5s infinite' }} />
              Open
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{ background: '#fff', borderBottom: '2px solid #e8f2ea', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(20,85,48,0.06)' }}>

        {/* Desktop logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} className="nav-desktop">
          {LogoImg ? (
            <img src={LogoImg} alt="Apni Dukan" style={{ height: 42, width: 'auto' }} />
          ) : (
            <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 22, color: '#145530', letterSpacing: '-0.5px' }}>
              apni<span style={{ color: '#f07c2a' }}>dukan</span>
            </div>
          )}
        </Link>

        {/* Mobile logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'none' }} className="nav-mobile-logo">
          {LogoImg ? (
            <img src={LogoImg} alt="Apni Dukan" style={{ height: 38, width: 'auto' }} />
          ) : (
            <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 20, color: '#145530' }}>
              apni<span style={{ color: '#f07c2a' }}>dukan</span>
            </div>
          )}
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 22 }} className="nav-desktop">
          {links.map(([path, label]) => (
            <Link key={path} to={path} style={{ fontSize: 13, color: isActive(path) ? '#145530' : '#4a6b50', textDecoration: 'none', fontWeight: isActive(path) ? 700 : 600, borderBottom: isActive(path) ? '2px solid #145530' : '2px solid transparent', paddingBottom: 2 }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user && (
            <Link to="/profile" style={{ position: 'relative', color: '#145530', fontSize: 20, display: 'flex', alignItems: 'center' }}>
              <FiBell />
              {unread > 0 && <span style={{ position: 'absolute', top: -7, right: -7, background: '#e24b4a', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{unread}</span>}
            </Link>
          )}

          {user ? (
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }} className="nav-desktop">
              <div style={{ width: 28, height: 28, background: '#145530', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 12, color: '#145530', fontWeight: 700 }}>{(user.name || '').split(' ')[0]}</span>
            </Link>
          ) : (
            <Link to="/login" style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '7px 16px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }} className="nav-desktop">Login</Link>
          )}

          <Link to="/cart" style={{ position: 'relative', color: '#145530', fontSize: 22, display: 'flex', alignItems: 'center' }}>
            <FiShoppingCart />
            {count > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: '#f07c2a', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{count > 9 ? '9+' : count}</span>}
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="nav-mobile-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#145530', display: 'none', alignItems: 'center' }}>
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu" style={{ background: '#fff', borderBottom: '2px solid #e8f2ea', padding: '12px 20px', display: 'none', flexDirection: 'column', zIndex: 99 }}>
          {links.map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)}
              style={{ fontSize: 15, color: isActive(path) ? '#145530' : '#0a2e1a', textDecoration: 'none', fontWeight: isActive(path) ? 700 : 600, padding: '11px 0', borderBottom: '1px solid #f0f7f2' }}>
              {label}
            </Link>
          ))}
          {user ? (
            <div style={{ paddingTop: 10 }}>
              <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid #f0f7f2' }}>
                <div style={{ width: 36, height: 36, background: '#145530', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800 }}>
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2e1a' }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: '#6b8f71' }}>{user.email}</div>
                </div>
              </Link>
              <button onClick={logout} style={{ width: '100%', background: '#fee2e2', color: '#e24b4a', border: 'none', borderRadius: 50, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>Logout 👋</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', background: '#145530', color: '#fff', borderRadius: 50, padding: '12px', fontWeight: 700, textDecoration: 'none', fontSize: 14, marginTop: 10 }}>Login / Sign Up</Link>
          )}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .nav-mobile-menu { display: flex !important; }
          .nav-mobile-logo { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-logo { display: none !important; }
        }
      `}</style>
    </>
  );
}