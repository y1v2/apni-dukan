import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [menu, setMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const links = [['/', 'Home'],['/products','Shop'],['/orders','My Orders'],['/support','Support'],['/about','About']];

  return (
    <nav style={{ background:'#fff', borderBottom:'2px solid #e8f2ea', padding:'14px 36px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 16px rgba(20,85,48,0.06)' }}>
      <Link to="/" style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:26, color:'#145530', textDecoration:'none', letterSpacing:'-1px' }}>
        apni<span style={{ color:'#f07c2a' }}>dukan</span>
      </Link>
      <div style={{ display:'flex', gap:28 }}>
        {links.map(([path,label]) => (
          <Link key={path} to={path} style={{ fontSize:14, color:'#4a6b50', textDecoration:'none', fontWeight:600 }}
            onMouseEnter={e=>e.target.style.color='#145530'} onMouseLeave={e=>e.target.style.color='#4a6b50'}>
            {label}
          </Link>
        ))}
      </div>
      <div style={{ display:'flex', gap:14, alignItems:'center' }}>
        {user ? (
          <>
            <Link to="/profile" style={{ fontSize:13, color:'#145530', fontWeight:700, textDecoration:'none' }}>Hi, {user.name?.split(' ')[0]}! 👋</Link>
            <button onClick={logout} style={{ background:'#fee2e2', border:'none', color:'#e24b4a', cursor:'pointer', fontSize:13, fontWeight:600, padding:'7px 14px', borderRadius:50, fontFamily:"'Poppins',sans-serif" }}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'8px 20px', fontSize:13, fontWeight:700, textDecoration:'none' }}>Login / Signup</Link>
        )}
        <Link to="/cart" style={{ position:'relative', color:'#145530', fontSize:24, display:'flex' }}>
          <FiShoppingCart />
          {count > 0 && (
            <span style={{ position:'absolute', top:-8, right:-8, background:'#f07c2a', color:'#fff', borderRadius:'50%', width:20, height:20, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800 }}>{count}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}