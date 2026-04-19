import React from 'react';

const PARTNERS = [
  { name: 'Delivery Partner 1', phone: '+91 8888888881', area: 'Kalpi Main Area', time: '8 AM - 8 PM' },
  { name: 'Delivery Partner 2', phone: '+91 8888888882', area: 'Nearby Villages', time: '9 AM - 7 PM' },
  { name: 'Delivery Partner 3', phone: '+91 8888888883', area: 'Outer Areas', time: '10 AM - 6 PM' },
];

export default function DeliveryInfo() {
  return (
    <div style={{ background: '#f5f9f6', minHeight: '80vh', fontFamily: "'Poppins',sans-serif" }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0a2e1a,#145530)', padding: '60px 36px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Delivery Information 🚚</h1>
        <p style={{ color: '#86efac', fontSize: 16 }}>Sab kuch jaano hamari delivery service ke baare mein</p>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 36px' }}>

        {/* Delivery Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 40 }}>
          {[
            ['🕐','Delivery Timing','Subah 8 baje se raat 8 baje tak, 7 din hafte'],
            ['⚡','Delivery Speed','30-60 minute mein delivery aapke darwaze tak'],
            ['💰','Delivery Charge','₹199 se upar free! Neeche ₹30 delivery charge'],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8f2ea', padding: '28px 20px', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#6b8f71', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Delivery Partners */}
        <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e8f2ea', padding: '32px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 24 }}>🛵 Hamare Delivery Partners</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {PARTNERS.map((p, i) => (
              <div key={i} style={{ background: '#f5f9f6', borderRadius: 20, border: '1.5px solid #e8f2ea', padding: '24px 20px', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#145530,#1a6b3a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>🛵</div>
                <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#6b8f71', marginBottom: 4 }}>📍 {p.area}</div>
                <div style={{ fontSize: 12, color: '#6b8f71', marginBottom: 12 }}>🕐 {p.time}</div>
                <a href={`tel:${p.phone}`} style={{ display: 'block', background: '#145530', color: '#fff', borderRadius: 50, padding: '9px 16px', textAlign: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                  📞 {p.phone}
                </a>
                <a href={`https://wa.me/91${p.phone.replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noreferrer"
                  style={{ display: 'block', background: '#25D366', color: '#fff', borderRadius: 50, padding: '9px 16px', textAlign: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 700, marginTop: 8 }}>
                  💬 WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e8f2ea', padding: '32px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 8 }}>📍 Hamara Location</h2>
          <p style={{ fontSize: 14, color: '#6b8f71', marginBottom: 20 }}>135, Raj Ghat, Kalpi, Jalaun — 285204, Uttar Pradesh</p>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '2px solid #e8f2ea' }}>
            <iframe
              title="Apni Dukan Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.0!2d79.7!3d26.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKalpi%2C%20Jalaun%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="350"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <a href="https://maps.google.com/?q=Kalpi,Jalaun,UttarPradesh" target="_blank" rel="noreferrer"
              style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '10px 24px', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              🗺️ Google Maps par Dekho
            </a>
            <a href="https://wa.me/917355691229?text=Mujhe delivery area check karni hai" target="_blank" rel="noreferrer"
              style={{ background: '#25D366', color: '#fff', borderRadius: 50, padding: '10px 24px', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              💬 Delivery Area Poochho
            </a>
          </div>
        </div>

        {/* Delivery Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['📦','Order Tracking','Login ke baad "My Orders" page par jao. Real-time status dekho.'],
            ['❌','Order Cancel','Order place hone ke 5 minute mein WhatsApp par contact karo.'],
            ['💵','Payment','Delivery par cash, ya UPI/Card online (Razorpay se).'],
            ['🔄','Return Policy','Galat ya kharab item mile to turant batao - replace karenge!'],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8f2ea', padding: '22px', display: 'flex', gap: 16 }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#4a6b50', lineHeight: 1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}