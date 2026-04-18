import React from 'react';

export default function DeliveryInfo() {
  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'60px 36px', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:42, fontWeight:800, color:'#fff', marginBottom:12 }}>Delivery Information 🚚</h1>
        <p style={{ color:'#86efac', fontSize:16 }}>Everything you need to know about our delivery service</p>
      </div>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'48px 36px' }}>
        {[
          ['🕐','Delivery Timings','We deliver 7 days a week from 8:00 AM to 8:00 PM. Orders placed after 8 PM will be delivered the next morning.'],
          ['⚡','Delivery Speed','Most orders are delivered within 30–60 minutes of placing. During peak hours it may take up to 90 minutes.'],
          ['💰','Delivery Charges','Free delivery on orders above ₹199. A delivery fee of ₹30 applies for orders below ₹199.'],
          ['📍','Delivery Areas','Currently delivering in Dadri and nearby areas. We are expanding to more areas soon!'],
          ['📦','Order Tracking','Track your order in real-time from the "My Orders" page after logging in.'],
          ['❌','Cancellation','Orders can be cancelled within 5 minutes of placing. Contact us on WhatsApp immediately.'],
        ].map(([icon,title,desc])=>(
          <div key={title} style={{ background:'#fff', borderRadius:20, border:'1.5px solid #e8f2ea', padding:'24px 28px', marginBottom:16, display:'flex', gap:20, alignItems:'flex-start' }}>
            <div style={{ fontSize:36, flexShrink:0 }}>{icon}</div>
            <div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>{title}</div>
              <div style={{ fontSize:14, color:'#4a6b50', lineHeight:1.7 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}