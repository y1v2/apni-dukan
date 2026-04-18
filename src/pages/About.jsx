import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'60px 36px', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:42, fontWeight:800, color:'#fff', marginBottom:12 }}>About Apni Dukan 🛒</h1>
        <p style={{ color:'#86efac', fontSize:16, maxWidth:600, margin:'0 auto', fontStyle:'italic' }}>"Agar chahiye ho fresh samaan, to best option hai Apni Dukan!"</p>
      </div>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'48px 36px' }}>
        <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #e8f2ea', padding:'36px', marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>Our Story 📖</h2>
          <p style={{ fontSize:15, color:'#4a6b50', lineHeight:1.9 }}>
            Apni Dukan was started with a simple goal — to make fresh grocery shopping easy and convenient for everyone in our town. We saw that people had to travel far for groceries or wait long hours. So we decided to bring the grocery store to your doorstep!
          </p>
          <p style={{ fontSize:15, color:'#4a6b50', lineHeight:1.9, marginTop:16 }}>
            Based in Dadri and serving nearby areas, we source our products fresh every day. From vegetables to dairy, from spices to snacks — everything you need is just one click away.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:24 }}>
          {[['🌿','Always Fresh','We source products fresh every single day'],['⚡','Fast Delivery','30-60 minute delivery to your door'],['💰','Best Prices','Honest prices, no hidden charges']].map(([icon,title,desc])=>(
            <div key={title} style={{ background:'#fff', borderRadius:20, border:'1.5px solid #e8f2ea', padding:'28px 20px', textAlign:'center' }}>
              <div style={{ fontSize:44, marginBottom:12 }}>{icon}</div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:8 }}>{title}</div>
              <div style={{ fontSize:13, color:'#6b8f71', lineHeight:1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', borderRadius:24, padding:'36px', textAlign:'center' }}>
          <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:800, color:'#fff', marginBottom:12 }}>Visit Our Warehouse</h2>
          <p style={{ color:'#86efac', fontSize:14, marginBottom:8 }}>📍 135, Raj Ghat, Kalpi, Jalaun — 285204, Uttar Pradesh</p>
          <p style={{ color:'#86efac', fontSize:14, marginBottom:8 }}>📞 +91 9670944301</p>
          <p style={{ color:'#86efac', fontSize:14, marginBottom:24 }}>📧 yvishwakarma315@gmail.com</p>
          <Link to="/support" style={{ background:'#f07c2a', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none', fontSize:15 }}>Contact Us →</Link>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}