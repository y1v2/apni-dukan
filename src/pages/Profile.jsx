import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const { wallet } = useCart();
  const { generateReferralCode, referrals, saveReferrals } = useProducts();

  const [myCode, setMyCode] = useState(() => {
    return localStorage.getItem('apnidukan_my_referral_code') || '';
  });

  useEffect(() => {
    if (!user) return;
    if (!myCode) {
      const code = generateReferralCode(user.name);
      setMyCode(code);
      localStorage.setItem('apnidukan_my_referral_code', code);
      const exists = referrals.find(r => r.code === code);
      if (!exists) {
        saveReferrals([...referrals, { code, owner: user.email, used: false, createdAt: new Date().toISOString() }]);
      }
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout ho gaya!');
    navigate('/');
    window.location.reload();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(myCode).then(() => toast.success('Code copied! 📋'));
  };

  const shareCode = () => {
    const msg = `Apni Dukan se fresh grocery order karo! Pehli order par Rs.50 off pao. Mera referral code use karo: ${myCode}\nhttps://localhost:3000/login`;
    window.open('https://wa.me/?text='+encodeURIComponent(msg), '_blank');
  };

  if (!user) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f9f6', padding:20 }}>
      <div style={{ fontSize:60, marginBottom:14 }}>👤</div>
      <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:24, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>Pehle login karo</h2>
      <Link to="/login" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'13px 32px', fontWeight:700, textDecoration:'none', fontSize:14 }}>Login Karo →</Link>
    </div>
  );

  const card = { background:'#fff', borderRadius:20, border:'1.5px solid #e8f2ea', padding:'22px', marginBottom:14 };
  const myRefs = referrals.filter(r => r.owner === user.email && r.used);

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', fontFamily:'Poppins, sans-serif' }}>
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'28px 24px' }}>
        <h1 style={{ fontFamily:'Baloo 2, cursive', fontSize:26, fontWeight:800, color:'#fff', marginBottom:4 }}>👤 My Profile</h1>
      </div>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'20px 16px' }}>

        {/* User info */}
        <div style={{ ...card, textAlign:'center', padding:'28px' }}>
          <div style={{ width:72, height:72, background:'linear-gradient(135deg,#145530,#1a6b3a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, color:'#fff', fontWeight:800, margin:'0 auto 12px', fontFamily:'Baloo 2, cursive' }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ fontFamily:'Baloo 2, cursive', fontSize:22, fontWeight:800, color:'#0a2e1a' }}>{user.name}</div>
          <div style={{ fontSize:13, color:'#6b8f71', marginTop:4 }}>{user.email}</div>
          {user.phone && <div style={{ fontSize:13, color:'#6b8f71', marginTop:2 }}>📞 {user.phone}</div>}
        </div>

        {/* Wallet */}
        <div style={{ ...card, background:'linear-gradient(135deg,#0a2e1a,#145530)', color:'#fff' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, marginBottom:4 }}>💰 Wallet Balance</div>
              <div style={{ fontSize:12, color:'#86efac' }}>Referral earnings & bonuses</div>
            </div>
            <div style={{ fontFamily:'Baloo 2, cursive', fontSize:32, fontWeight:800 }}>Rs.{wallet}</div>
          </div>
        </div>

        {/* Referral */}
        <div style={card}>
          <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>🎁 Referral Code</h3>
          <p style={{ fontSize:12, color:'#6b8f71', marginBottom:14, lineHeight:1.6 }}>
            Apna referral code share karo. Jab koi friend aapka code use karke pehli order karega, aapko <strong style={{ color:'#145530' }}>Rs.50 wallet mein</strong> milenge!
          </p>
          <div style={{ background:'linear-gradient(135deg,#e6f4ec,#c8e6d4)', borderRadius:16, padding:'18px', textAlign:'center', marginBottom:14, border:'2px dashed #145530' }}>
            <div style={{ fontFamily:'Baloo 2, cursive', fontSize:28, fontWeight:800, color:'#145530', letterSpacing:4 }}>{myCode}</div>
            <div style={{ fontSize:11, color:'#6b8f71', marginTop:4 }}>Aapka unique referral code</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <button onClick={copyCode} style={{ background:'#e6f4ec', color:'#145530', border:'2px solid #b8dfc6', borderRadius:50, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Poppins, sans-serif' }}>
              📋 Copy Code
            </button>
            <button onClick={shareCode} style={{ background:'#25D366', color:'#fff', border:'none', borderRadius:50, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Poppins, sans-serif' }}>
              💬 WhatsApp Share
            </button>
          </div>
          {myRefs.length > 0 && (
            <div style={{ background:'#f5f9f6', borderRadius:12, padding:'12px', marginTop:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#0a2e1a', marginBottom:4 }}>✅ {myRefs.length} friends ne aapka code use kiya!</div>
              <div style={{ fontSize:11, color:'#6b8f71' }}>Aapko total Rs.{myRefs.length*50} ka bonus mila hai</div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          {[['/orders','📦','My Orders'],['/support','🤝','Support'],['/delivery-info','🚚','Delivery Info'],['/about','🏪','About Us']].map(([path,icon,label])=>(
            <Link key={path} to={path} style={{ ...card, textDecoration:'none', textAlign:'center', marginBottom:0, display:'block' }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
              <div style={{ fontFamily:'Baloo 2, cursive', fontSize:14, fontWeight:800, color:'#0a2e1a' }}>{label}</div>
            </Link>
          ))}
        </div>

        <button onClick={logout} style={{ width:'100%', background:'#fee2e2', color:'#e24b4a', border:'2px solid #fca5a5', borderRadius:50, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Poppins, sans-serif' }}>
          Logout 👋
        </button>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}