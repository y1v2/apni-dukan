import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background:'#0a2e1a', color:'#86efac', padding:'48px 36px 24px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:40 }}>
        <div>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:28, fontWeight:800, color:'#fff', marginBottom:10 }}>
            apni<span style={{ color:'#f07c2a' }}>dukan</span>
          </div>
          <p style={{ fontSize:13.5, lineHeight:1.8, color:'#86efac', maxWidth:280, marginBottom:16 }}>
            "Agar chahiye ho fresh samaan, to best option hai Apni Dukan!" Your town's own online grocery store.
          </p>
          <div style={{ fontSize:13, color:'#6b9e7a' }}>
            <div style={{ marginBottom:6 }}>📍 135, Raj Ghat, Kalpi, Jalaun — 285204, UP</div>
            <div style={{ marginBottom:6 }}>📧 yvishwakarma315@gmail.com</div>
            <div style={{ marginBottom:6 }}>📞 +91 9670944301</div>
            <div>💬 WhatsApp: +91 7355691229</div>
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:17, fontWeight:800, color:'#fff', marginBottom:16 }}>Quick Links</h3>
          {[['/','Home'],['/products','Shop'],['/cart','Cart'],['/orders','My Orders'],['/profile','My Profile']].map(([p,l])=>(
            <Link key={p} to={p} style={{ display:'block', fontSize:13.5, color:'#86efac', textDecoration:'none', marginBottom:10, fontWeight:500 }}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#86efac'}>{l}</Link>
          ))}
        </div>
        <div>
          <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:17, fontWeight:800, color:'#fff', marginBottom:16 }}>Help</h3>
          {[['/support','Help & Support'],['/delivery-info','Delivery Info'],['/refund','Refund Policy'],['/terms','Terms & Conditions'],['/privacy','Privacy Policy']].map(([p,l])=>(
            <Link key={p} to={p} style={{ display:'block', fontSize:13.5, color:'#86efac', textDecoration:'none', marginBottom:10, fontWeight:500 }}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#86efac'}>{l}</Link>
          ))}
        </div>
        <div>
          <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:17, fontWeight:800, color:'#fff', marginBottom:16 }}>Contact Us</h3>
          <a href="mailto:yvishwakarma315@gmail.com" style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', marginBottom:10, textDecoration:'none', color:'#86efac', fontSize:13 }}>
            📧 Email Us
          </a>
          <a href="tel:+919670944301" style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', marginBottom:10, textDecoration:'none', color:'#86efac', fontSize:13 }}>
            📞 Call Us
          </a>
          <a href="https://wa.me/917355691229" target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, background:'#25D366', borderRadius:12, padding:'10px 14px', textDecoration:'none', color:'#fff', fontSize:13, fontWeight:700 }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12.5, color:'#6b9e7a' }}>
        <span>© 2025 Apni Dukan. All rights reserved.</span>
        <span>Made with ❤️ for Dadri & nearby areas</span>
      </div>
    </footer>
  );
}