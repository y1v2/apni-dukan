import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0a2e1a', color: '#86efac', fontFamily: 'Poppins, sans-serif' }}>

      {/* Main footer content */}
      <div style={{ padding: '36px 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 28, marginBottom: 32 }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
              apni<span style={{ color: '#f07c2a' }}>dukan</span>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.8, color: '#86efac', maxWidth: 260, marginBottom: 14 }}>
              "Agar chahiye ho fresh samaan, to best option hai Apni Dukan!" — Kalpi ka apna online grocery store.
            </p>
            <div style={{ fontSize: 12, color: '#6b9e7a', lineHeight: 1.9 }}>
              <div>📍 135, Raj Ghat, Kalpi, Jalaun — 285204</div>
              <div>📧 yvishwakarma315@gmail.com</div>
              <div>📞 +91 9670944301</div>
              <div>💬 WhatsApp: +91 7355691229</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Quick Links</h3>
            {[['/', 'Home'], ['/products', 'Shop'], ['/cart', 'Cart'], ['/orders', 'My Orders'], ['/profile', 'Profile']].map(([p, l]) => (
              <Link key={p} to={p} style={{ display: 'block', fontSize: 13, color: '#86efac', textDecoration: 'none', marginBottom: 9, fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#86efac'}>{l}</Link>
            ))}
          </div>

          {/* Help */}
          <div>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Help & Info</h3>
            {[['/support', 'Help & Support'], ['/delivery-info', 'Delivery Info'], ['/refund', 'Refund Policy'], ['/terms', 'Terms & Conditions'], ['/privacy', 'Privacy Policy'], ['/about', 'About Us']].map(([p, l]) => (
              <Link key={p} to={p} style={{ display: 'block', fontSize: 13, color: '#86efac', textDecoration: 'none', marginBottom: 9, fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#86efac'}>{l}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Contact</h3>
            <a href="mailto:yvishwakarma315@gmail.com"
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', marginBottom: 9, textDecoration: 'none', color: '#86efac', fontSize: 12.5 }}>
              📧 Email Us
            </a>
            <a href="tel:+919670944301"
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', marginBottom: 9, textDecoration: 'none', color: '#86efac', fontSize: 12.5 }}>
              📞 Call Us
            </a>
            <a href="https://wa.me/917355691229" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#25D366', borderRadius: 10, padding: '10px 12px', textDecoration: 'none', color: '#fff', fontSize: 12.5, fontWeight: 700 }}>
              💬 WhatsApp
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 12, color: '#6b9e7a' }}>
          <span>© 2025 Apni Dukan. All rights reserved.</span>
          <span>Made with ❤️ for Kalpi & nearby areas</span>
        </div>
      </div>

      {/* Mobile bottom quick links — ALWAYS VISIBLE on mobile */}
      <div className="mobile-footer-bar" style={{ display: 'none', background: '#fff', borderTop: '2px solid #e8f2ea', padding: '10px 10px', position: 'sticky', bottom: 0, zIndex: 50 }}>
        {[['/','🏠','Home'],['/products','🛒','Shop'],['/cart','🛍️','Cart'],['/orders','📦','Orders'],['/support','🤝','Help'],['/profile','👤','Profile']].map(([path, icon, label]) => (
          <Link key={path} to={path}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', flex: 1, padding: '4px 2px' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 9, color: '#4a6b50', fontWeight: 600 }}>{label}</span>
          </Link>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          footer div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .mobile-footer-bar { display: flex !important; }
          footer { padding-bottom: 70px; }
        }
        @media (min-width: 769px) {
          .mobile-footer-bar { display: none !important; }
        }
      `}</style>
    </footer>
  );
}