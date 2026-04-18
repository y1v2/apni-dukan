import React from 'react';
import { Link } from 'react-router-dom';

export default function Refund() {
  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'60px 36px', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:42, fontWeight:800, color:'#fff' }}>Refund & Return Policy 🔄</h1>
      </div>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'48px 36px' }}>
        <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #e8f2ea', padding:'36px', marginBottom:20 }}>
          {[
            ['✅ When We Accept Returns','Wrong item delivered, Damaged or spoiled product, Missing items from order, Expired product delivered'],
            ['❌ When We Cannot Refund','Order cancelled after delivery, Change of mind after delivery, Items consumed or used, Returns after 24 hours of delivery'],
            ['💰 Refund Process','Refunds are processed within 24–48 hours. Cash refunds are given at next delivery. UPI refunds go back to original account.'],
            ['📞 How to Request','Contact us on WhatsApp (+91 7355691229) or call (+91 9670944301) immediately when you receive a wrong or damaged item. Send a photo of the item.'],
          ].map(([title,content])=>(
            <div key={title} style={{ marginBottom:24, paddingBottom:24, borderBottom:'1px solid #f0f7f2' }}>
              <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:10 }}>{title}</h3>
              <p style={{ fontSize:14, color:'#4a6b50', lineHeight:1.8 }}>{content}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center' }}>
          <p style={{ color:'#6b8f71', fontSize:14, marginBottom:20 }}>Have an issue with your order?</p>
          <a href="https://wa.me/917355691229" target="_blank" rel="noreferrer"
            style={{ background:'#25D366', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none', fontSize:15, marginRight:12 }}>
            💬 WhatsApp Us
          </a>
          <Link to="/support" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none', fontSize:15 }}>
            Contact Support
          </Link>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}