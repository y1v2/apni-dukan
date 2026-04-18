import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f9f6' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>👤</div>
      <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:28, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>Please login first</h2>
      <Link to="/login" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none' }}>Login Now →</Link>
    </div>
  );

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const card = { background:'#fff', borderRadius:20, border:'1.5px solid #e8f2ea', padding:'24px 28px', marginBottom:16 };

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', padding:'36px' }}>
      <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:32, fontWeight:800, color:'#0a2e1a', marginBottom:28 }}>👤 My Profile</h1>
      <div style={{ maxWidth:600, margin:'0 auto' }}>
        <div style={{ ...card, textAlign:'center', padding:'36px' }}>
          <div style={{ width:80, height:80, background:'linear-gradient(135deg,#145530,#1a6b3a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, color:'#fff', fontWeight:800, margin:'0 auto 16px', fontFamily:"'Baloo 2',cursive" }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800, color:'#0a2e1a' }}>{user.name}</div>
          <div style={{ fontSize:14, color:'#6b8f71', marginTop:6 }}>{user.email}</div>
        </div>
        <div style={card}>
          <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>Account Details</h3>
          {[['Name', user.name],['Email', user.email],['Role', user.role === 'admin' ? '👑 Admin' : '🛒 Customer']].map(([label,value])=>(
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f0f7f2', fontSize:14 }}>
              <span style={{ color:'#6b8f71', fontWeight:600 }}>{label}</span>
              <span style={{ color:'#0a2e1a', fontWeight:700 }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Link to="/orders" style={{ ...card, textDecoration:'none', textAlign:'center', display:'block' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>📦</div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:800, color:'#0a2e1a' }}>My Orders</div>
          </Link>
          <Link to="/support" style={{ ...card, textDecoration:'none', textAlign:'center', display:'block' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🤝</div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:800, color:'#0a2e1a' }}>Support</div>
          </Link>
        </div>
        <button onClick={logout} style={{ width:'100%', background:'#fee2e2', color:'#e24b4a', border:'2px solid #fca5a5', borderRadius:50, padding:'14px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", marginTop:8 }}>
          Logout 👋
        </button>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}