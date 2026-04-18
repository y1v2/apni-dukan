import React from 'react';

export default function Terms() {
  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'60px 36px', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:42, fontWeight:800, color:'#fff' }}>Terms & Conditions 📋</h1>
      </div>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'48px 36px' }}>
        <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #e8f2ea', padding:'36px' }}>
          {[
            ['1. Acceptance','By using Apni Dukan website or app, you agree to these terms and conditions. If you do not agree, please do not use our services.'],
            ['2. Products & Prices','All prices are in Indian Rupees (₹). We reserve the right to change prices without prior notice. Product availability may vary.'],
            ['3. Orders','Orders are confirmed only after you receive a confirmation message. We reserve the right to cancel orders due to stock unavailability.'],
            ['4. Payment','We accept Cash on Delivery, UPI, and cards. All payments must be made at the time of delivery for COD orders.'],
            ['5. Delivery','We strive to deliver within the promised time. However, delays may occur due to weather, traffic, or other unforeseen circumstances.'],
            ['6. Returns','Damaged or wrong items can be returned at the time of delivery. No returns accepted after the delivery person has left.'],
            ['7. Privacy','Your personal information is safe with us. We do not share your data with third parties. See our Privacy Policy for details.'],
            ['8. Contact','For any issues, contact us at yvishwakarma315@gmail.com or call +91 9670944301.'],
          ].map(([title,content])=>(
            <div key={title} style={{ marginBottom:24, paddingBottom:24, borderBottom:'1px solid #f0f7f2' }}>
              <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:8 }}>{title}</h3>
              <p style={{ fontSize:14, color:'#4a6b50', lineHeight:1.8 }}>{content}</p>
            </div>
          ))}
          <p style={{ fontSize:12, color:'#6b8f71', textAlign:'center' }}>Last updated: January 2025</p>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}