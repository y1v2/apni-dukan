import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { count } = useCart();
  return (
    <nav style={{ background: '#fff', borderBottom: '1.5px solid #e2ede5', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#1a6b3a', textDecoration: 'none' }}>
        apni<span style={{ color: '#f07c2a' }}>dukan</span>
      </Link>
      <div style={{ display: 'flex', gap: 28 }}>
        {['/', '/products', '/orders'].map((path, i) => (
          <Link key={i} to={path} style={{ fontSize: 13, color: '#6b8f71', textDecoration: 'none', fontWeight: 500 }}>
            {['Home', 'Shop', 'My Orders'][i]}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/login" style={{ color: '#1a6b3a', fontSize: 20 }}><FiUser /></Link>
        <Link to="/cart" style={{ position: 'relative', color: '#1a6b3a', fontSize: 20 }}>
          <FiShoppingCart />
          {count > 0 && (
            <span style={{ position: 'absolute', top: -8, right: -8, background: '#f07c2a', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{count}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}