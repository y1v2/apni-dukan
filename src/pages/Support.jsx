import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FAQS = [
  { q: 'How do I place an order?', a: 'Browse products, add items to cart, proceed to checkout, enter your address and place the order. It\'s that simple!' },
  { q: 'What are the delivery timings?', a: 'We deliver from 8 AM to 8 PM, 7 days a week. Most orders are delivered within 30-60 minutes.' },
  { q: 'Is Cash on Delivery available?', a: 'Yes! We accept Cash on Delivery, UPI, and all major cards.' },
  { q: 'What is the minimum order amount?', a: 'There is no minimum order! However, free delivery is available on orders above ₹199.' },
  { q: 'How do I track my order?', a: 'Go to "My Orders" page after logging in. You can see live status of your order there.' },
  { q: 'What if I receive a wrong or damaged item?', a: 'Contact us immediately on WhatsApp or call. We will replace or refund within 24 hours, no questions asked!' },
  { q: 'Do you deliver outside Dadri?', a: 'Currently we deliver in Dadri and nearby areas. We are expanding soon!' },
  { q: 'How do I cancel my order?', a: 'Orders can be cancelled within 5 minutes of placing. Contact us on WhatsApp for quick cancellation.' },
];

export default function Support() {
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ name:'', phone:'', message:'' });

  const send = () => {
    if (!form.name || !form.message) { toast.error('Please fill all fields'); return; }
    const msg = `Hello Apni Dukan! My name is ${form.name}, phone: ${form.phone}. Message: ${form.message}`;
    window.open(`https://wa.me/917355691229?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const card = { background:'#fff', borderRadius:20, border:'1.5px solid #e8f2ea', padding:'24px 28px', marginBottom:16, boxShadow:'0 2px 12px rgba(20,85,48,0.05)' };

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh' }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'60px 36px', textAlign:'center' }}>
        <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:42, fontWeight:800, color:'#fff', marginBottom:12 }}>Help & Support 🤝</h1>
        <p style={{ color:'#86efac', fontSize:16, maxWidth:500, margin:'0 auto' }}>We're here to help! Reach out anytime and we'll get back to you quickly.</p>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'48px 36px' }}>

        {/* Contact Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:48 }}>
          <a href="mailto:yvishwakarma315@gmail.com" style={{ ...card, textDecoration:'none', textAlign:'center', transition:'transform 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ fontSize:48, marginBottom:12 }}>📧</div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>Email Us</div>
            <div style={{ fontSize:13, color:'#145530', fontWeight:600 }}>yvishwakarma315@gmail.com</div>
            <div style={{ fontSize:12, color:'#6b8f71', marginTop:6 }}>Reply within 24 hours</div>
          </a>
          <a href="tel:+919670944301" style={{ ...card, textDecoration:'none', textAlign:'center', transition:'transform 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ fontSize:48, marginBottom:12 }}>📞</div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>Call Us</div>
            <div style={{ fontSize:13, color:'#145530', fontWeight:600 }}>+91 9670944301</div>
            <div style={{ fontSize:12, color:'#6b8f71', marginTop:6 }}>Mon–Sun, 8 AM – 8 PM</div>
          </a>
          <a href="https://wa.me/917355691229" target="_blank" rel="noreferrer" style={{ ...card, textDecoration:'none', textAlign:'center', background:'#f0fdf4', transition:'transform 0.2s', border:'1.5px solid #86efac' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>WhatsApp</div>
            <div style={{ fontSize:13, color:'#145530', fontWeight:600 }}>+91 7355691229</div>
            <div style={{ fontSize:12, color:'#6b8f71', marginTop:6 }}>Fastest response!</div>
          </a>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:32 }}>
          {/* FAQs */}
          <div>
            <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:800, color:'#0a2e1a', marginBottom:20 }}>Frequently Asked Questions</h2>
            {FAQS.map((faq,i) => (
              <div key={i} style={{ ...card, cursor:'pointer', padding:'18px 22px' }} onClick={() => setOpen(open===i?null:i)}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:14, fontWeight:700, color:'#0a2e1a', fontFamily:"'Poppins',sans-serif" }}>{faq.q}</span>
                  <span style={{ fontSize:20, color:'#145530', fontWeight:700, transition:'transform 0.2s', transform:open===i?'rotate(45deg)':'rotate(0)' }}>+</span>
                </div>
                {open===i && <p style={{ fontSize:13.5, color:'#4a6b50', lineHeight:1.7, marginTop:12, paddingTop:12, borderTop:'1px solid #e8f2ea', fontWeight:400 }}>{faq.a}</p>}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div>
            <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:800, color:'#0a2e1a', marginBottom:20 }}>Send a Message</h2>
            <div style={{ ...card }}>
              {[['name','Your Name','text'],['phone','Phone Number','tel'],['message','Your message...','textarea']].map(([key,ph,type]) => (
                type==='textarea' ? (
                  <textarea key={key} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} rows={5}
                    style={{ width:'100%', padding:'13px 16px', border:'2px solid #d0e8d8', borderRadius:14, fontSize:14, outline:'none', marginBottom:14, fontFamily:"'Poppins',sans-serif", background:'#f5f9f6', resize:'none', color:'#0a2e1a' }} />
                ) : (
                  <input key={key} type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                    style={{ width:'100%', padding:'13px 16px', border:'2px solid #d0e8d8', borderRadius:14, fontSize:14, outline:'none', marginBottom:14, fontFamily:"'Poppins',sans-serif", background:'#f5f9f6', color:'#0a2e1a' }} />
                )
              ))}
              <button onClick={send} style={{ width:'100%', background:'#25D366', color:'#fff', border:'none', borderRadius:50, padding:'14px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif" }}>
                💬 Send via WhatsApp
              </button>
              <button onClick={() => { if(!form.name||!form.message){toast.error('Fill all fields');return;} window.open(`mailto:yvishwakarma315@gmail.com?subject=Support Request from ${form.name}&body=${form.message}`,'_blank'); }} 
                style={{ width:'100%', background:'#145530', color:'#fff', border:'none', borderRadius:50, padding:'14px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", marginTop:10 }}>
                📧 Send via Email
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}