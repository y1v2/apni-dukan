import React from 'react';

export default function Privacy() {
  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'60px 36px', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:42, fontWeight:800, color:'#fff' }}>Privacy Policy 🔒</h1>
      </div>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'48px 36px' }}>
        <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #e8f2ea', padding:'36px' }}>
          {[
            ['What We Collect','We collect your name, email, phone number, and delivery address when you create an account or place an order.'],
            ['How We Use It','Your information is used only to process orders, deliver products, and provide customer support. Nothing else.'],
            ['Data Security','Your data is stored securely and encrypted. We never sell or share your personal information with third parties.'],
            ['Cookies','We use cookies to improve your browsing experience. You can disable cookies in your browser settings.'],
            ['Third Party Services','We use Razorpay for payments. Their privacy policy applies to payment transactions.'],
            ['Your Rights','You can request to view, update, or delete your personal data at any time by contacting us.'],
            ['Contact','For privacy concerns, email us at yvishwakarma315@gmail.com or call +91 9670944301.'],
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