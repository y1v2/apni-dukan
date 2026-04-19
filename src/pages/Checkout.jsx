import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// ⚠️ YAHAN APNA RAZORPAY KEY ID DAALO
const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_HERE';

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const [payMethod, setPayMethod] = useState('cod');
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: 'Kalpi', pincode: '285204', landmark: '' });
  const [loading, setLoading] = useState(false);

  const deliveryCharge = total >= 199 ? 0 : 30;
  const grandTotal = total + deliveryCharge;

  const inp = { width: '100%', padding: '12px 16px', border: '2px solid #d0e8d8', borderRadius: 14, fontSize: 14, outline: 'none', marginBottom: 14, fontFamily: "'Poppins',sans-serif", color: '#0a2e1a', background: '#f5f9f6', boxSizing: 'border-box' };

  const placeOrderCOD = async () => {
    if (!address.name || !address.phone || !address.street) { toast.error('Naam, phone aur address bharo'); return; }
    if (!token) { toast.error('Pehle login karo'); navigate('/login'); return; }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cartItems, total: grandTotal, address, paymentMethod: 'COD', paymentStatus: 'Pending'
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Order place ho gaya! 🎉 Jaldi deliver karenge.');
      clearCart(); navigate('/orders');
    } catch { toast.error('Order fail hua. Dobara try karo.'); }
    setLoading(false);
  };

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const payOnline = async () => {
    if (!address.name || !address.phone || !address.street) { toast.error('Pehle address bharo'); return; }
    if (!token) { toast.error('Pehle login karo'); navigate('/login'); return; }
    setLoading(true);
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Payment gateway load nahi hua'); setLoading(false); return; }
    const options = {
      key: RAZORPAY_KEY,
      amount: grandTotal * 100,
      currency: 'INR',
      name: 'Apni Dukan',
      description: `${cartItems.length} items ka order`,
      handler: async (response) => {
        try {
          await axios.post('http://localhost:5000/api/orders', {
            items: cartItems, total: grandTotal, address,
            paymentMethod: 'Online', paymentStatus: 'Paid',
            razorpayPaymentId: response.razorpay_payment_id
          }, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('Payment successful! Order placed 🎉');
          clearCart(); navigate('/orders');
        } catch { toast.error('Order save nahi hua. Support se contact karo.'); }
      },
      prefill: { name: address.name, contact: address.phone, email: user?.email || '' },
      theme: { color: '#145530' },
      modal: { ondismiss: () => { toast.error('Payment cancel hua'); setLoading(false); } }
    };
    new window.Razorpay(options).open();
    setLoading(false);
  };

  if (cartItems.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f9f6' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>Cart khali hai!</h2>
      <button onClick={() => navigate('/')} style={{ background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Shopping Shuru Karo →</button>
    </div>
  );

  return (
    <div style={{ background: '#f5f9f6', minHeight: '80vh', fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg,#0a2e1a,#145530)', padding: '36px' }}>
        <h1 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 34, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Checkout 🛒</h1>
        <p style={{ color: '#86efac', fontSize: 14 }}>Bas thoda aur — delivery details bharo!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, padding: '28px 36px' }}>
        <div>
          {/* Address */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e8f2ea', padding: '28px', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>📍 Delivery Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Poora Naam *</label>
                <input style={inp} placeholder="Apna poora naam" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Phone Number *</label>
                <input style={inp} placeholder="+91 XXXXXXXXXX" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} /></div>
            </div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Ghar ka Address *</label>
            <input style={inp} placeholder="Ghar no., gali, mohalla..." value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Landmark (optional)</label>
            <input style={inp} placeholder="Paas mein mandir, school etc." value={address.landmark} onChange={e => setAddress({...address, landmark: e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Shahar</label>
                <input style={inp} value={address.city} onChange={e => setAddress({...address, city: e.target.value})} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Pincode</label>
                <input style={inp} value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} /></div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e8f2ea', padding: '28px' }}>
            <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>💳 Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['cod','💵','Cash on Delivery','Delivery par cash dena hai'],['online','📱','UPI / Card / Net Banking','Razorpay se secure payment']].map(([val,icon,title,desc]) => (
                <div key={val} onClick={() => setPayMethod(val)}
                  style={{ border: `2px solid ${payMethod===val?'#145530':'#e8f2ea'}`, borderRadius: 18, padding: '20px 16px', cursor: 'pointer', background: payMethod===val?'#e6f4ec':'#fff', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#6b8f71' }}>{desc}</div>
                  {payMethod===val && <div style={{ marginTop: 8, fontSize: 11, color: '#145530', fontWeight: 700 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
            {payMethod === 'online' && RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE' && (
              <div style={{ background: '#fff7ed', borderRadius: 14, padding: '14px', marginTop: 14, fontSize: 13, color: '#f07c2a', fontWeight: 600 }}>
                ⚠️ Razorpay Key ID abhi set nahi hai. Checkout.jsx mein RAZORPAY_KEY update karo.
              </div>
            )}
            {payMethod === 'online' && RAZORPAY_KEY !== 'rzp_test_YOUR_KEY_HERE' && (
              <div style={{ background: '#e6f4ec', borderRadius: 14, padding: '14px', marginTop: 14, fontSize: 13, color: '#145530', fontWeight: 500 }}>
                ✅ Razorpay se secure payment. UPI, Cards, Net Banking sab support hota hai.
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e8f2ea', padding: '24px', height: 'fit-content', position: 'sticky', top: 80 }}>
          <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>📦 Order Summary</h3>
          <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 16 }}>
            {cartItems.map(i => (
              <div key={i._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f0f7f2' }}>
                <img src={i.img} alt={i.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2e1a' }}>{i.name}</div>
                  <div style={{ fontSize: 11, color: '#6b8f71' }}>{i.quantity} × {i.qty}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#145530', fontFamily: "'Baloo 2',cursive" }}>₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b8f71', marginBottom: 8, padding: '6px 0' }}>
              <span>Subtotal ({cartItems.length} items)</span><span>₹{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, padding: '6px 0' }}>
              <span style={{ color: '#6b8f71' }}>Delivery</span>
              <span style={{ color: deliveryCharge === 0 ? '#145530' : '#0a2e1a', fontWeight: deliveryCharge === 0 ? 700 : 500 }}>
                {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
              </span>
            </div>
            {deliveryCharge > 0 && <div style={{ background: '#fff7ed', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: '#f07c2a', fontWeight: 600, marginBottom: 8 }}>💡 ₹{199 - total} aur add karo FREE delivery ke liye!</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, padding: '14px 0', borderTop: '2px solid #e8f2ea', fontFamily: "'Baloo 2',cursive", color: '#0a2e1a' }}>
              <span>Grand Total</span><span style={{ color: '#145530' }}>₹{grandTotal}</span>
            </div>
          </div>

          <button onClick={payMethod === 'cod' ? placeOrderCOD : payOnline} disabled={loading}
            style={{ width: '100%', background: loading ? '#a8bfac' : 'linear-gradient(135deg,#145530,#1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '16px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Poppins',sans-serif", marginTop: 8, boxShadow: loading ? 'none' : '0 8px 24px rgba(20,85,48,0.3)', transition: 'all 0.2s' }}>
            {loading ? '⏳ Processing...' : payMethod === 'cod' ? '✅ Order Place Karo (COD)' : `💳 ₹${grandTotal} Online Pay Karo`}
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
            {[['🔒','Secure'],['⚡','Fast'],['🤝','Trusted']].map(([icon, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18 }}>{icon}</div>
                <div style={{ fontSize: 11, color: '#6b8f71', fontWeight: 600, marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1.5px solid #e8f2ea', marginTop: 16, paddingTop: 14 }}>
            <p style={{ fontSize: 12, color: '#6b8f71', textAlign: 'center', marginBottom: 10 }}>Ya seedha WhatsApp par order karo</p>
            <a href={`https://wa.me/917355691229?text=${encodeURIComponent(`Namaste Apni Dukan!\nMujhe order karna hai:\n${cartItems.map(i=>`• ${i.name} x${i.qty} = ₹${i.price*i.qty}`).join('\n')}\nTotal: ₹${grandTotal}\nAddress: ${address.street}, ${address.city} - ${address.pincode}`)}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', background: '#25D366', color: '#fff', borderRadius: 50, padding: '12px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              💬 WhatsApp par Order Karo
            </a>
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}