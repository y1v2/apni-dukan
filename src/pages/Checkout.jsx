import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// ⚠️ REPLACE THIS WITH YOUR ACTUAL RAZORPAY KEY ID
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
    if (!address.name || !address.phone || !address.street) { toast.error('Please fill all address fields'); return; }
    if (!token) { toast.error('Please login first'); navigate('/login'); return; }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cartItems, total: grandTotal, address, paymentMethod: 'COD', paymentStatus: 'Pending'
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Order placed! 🎉 We will deliver soon.');
      clearCart();
      navigate('/orders');
    } catch { toast.error('Failed to place order. Try again.'); }
    setLoading(false);
  };

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const payWithRazorpay = async () => {
    if (!address.name || !address.phone || !address.street) { toast.error('Please fill all address fields'); return; }
    if (!token) { toast.error('Please login first'); navigate('/login'); return; }
    setLoading(true);
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Payment gateway failed to load. Try again.'); setLoading(false); return; }

    const options = {
      key: RAZORPAY_KEY,
      amount: grandTotal * 100,
      currency: 'INR',
      name: 'Apni Dukan',
      description: `Order of ${cartItems.length} items`,
      image: '',
      handler: async (response) => {
        try {
          await axios.post('http://localhost:5000/api/orders', {
            items: cartItems, total: grandTotal, address,
            paymentMethod: 'Online', paymentStatus: 'Paid',
            razorpayPaymentId: response.razorpay_payment_id
          }, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('Payment successful! Order placed 🎉');
          clearCart();
          navigate('/orders');
        } catch { toast.error('Order saving failed. Contact support.'); }
      },
      prefill: { name: address.name, contact: address.phone, email: user?.email || '' },
      theme: { color: '#145530' },
      modal: { ondismiss: () => { toast.error('Payment cancelled'); setLoading(false); } }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  if (cartItems.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f9f6' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>Your cart is empty!</h2>
      <button onClick={() => navigate('/')} style={{ background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Shop Now →</button>
    </div>
  );

  return (
    <div style={{ background: '#f5f9f6', minHeight: '80vh', padding: '36px', fontFamily: "'Poppins',sans-serif" }}>
      <h1 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 32, fontWeight: 800, color: '#0a2e1a', marginBottom: 28 }}>Checkout 🛒</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

        {/* Left: Address + Payment */}
        <div>
          {/* Delivery Address */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e8f2ea', padding: '28px', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>📍 Delivery Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <input style={inp} placeholder="Full Name *" value={address.name} onChange={e => setAddress({...address,name:e.target.value})} />
              <input style={inp} placeholder="Phone Number *" value={address.phone} onChange={e => setAddress({...address,phone:e.target.value})} />
            </div>
            <input style={inp} placeholder="Street / Mohalla / House No. *" value={address.street} onChange={e => setAddress({...address,street:e.target.value})} />
            <input style={inp} placeholder="Landmark (optional)" value={address.landmark} onChange={e => setAddress({...address,landmark:e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <input style={inp} placeholder="City / Town" value={address.city} onChange={e => setAddress({...address,city:e.target.value})} />
              <input style={inp} placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address,pincode:e.target.value})} />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e8f2ea', padding: '28px' }}>
            <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>💳 Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['cod','💵','Cash on Delivery','Pay when delivered'],
                ['online','📱','UPI / Card / Net Banking','Pay online via Razorpay'],
              ].map(([val,icon,title,desc]) => (
                <div key={val} onClick={() => setPayMethod(val)}
                  style={{ border: `2px solid ${payMethod===val?'#145530':'#e8f2ea'}`, borderRadius: 18, padding: '20px 16px', cursor: 'pointer', background: payMethod===val?'#e6f4ec':'#fff', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#6b8f71', fontWeight: 500 }}>{desc}</div>
                  {payMethod===val && <div style={{ marginTop: 8, fontSize: 11, color: '#145530', fontWeight: 700 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
            {payMethod === 'online' && (
              <div style={{ background: '#e6f4ec', borderRadius: 14, padding: '14px 18px', marginTop: 16, fontSize: 13, color: '#145530', fontWeight: 500 }}>
                ✅ Secure payment via <b>Razorpay</b>. Supports UPI, Cards, Net Banking & Wallets.
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e8f2ea', padding: '24px', height: 'fit-content', position: 'sticky', top: 80 }}>
          <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>Order Summary</h3>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {cartItems.map(i => (
              <div key={i._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f7f2' }}>
                <img src={i.img} alt={i.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0a2e1a' }}>{i.name}</div>
                  <div style={{ fontSize: 11, color: '#6b8f71' }}>x{i.qty}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#145530' }}>₹{i.price*i.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b8f71', marginBottom: 8 }}>
              <span>Subtotal</span><span>₹{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b8f71', marginBottom: 8 }}>
              <span>Delivery</span>
              <span style={{ color: deliveryCharge === 0 ? '#145530' : '#0a2e1a', fontWeight: deliveryCharge===0?700:400 }}>
                {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
              </span>
            </div>
            {deliveryCharge > 0 && <p style={{ fontSize: 11, color: '#f07c2a', fontWeight: 600, marginBottom: 8 }}>Add ₹{199-total} more for free delivery!</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 19, fontWeight: 800, paddingTop: 12, borderTop: '2px solid #e8f2ea', fontFamily: "'Baloo 2',cursive", color: '#0a2e1a' }}>
              <span>Total</span><span style={{ color: '#145530' }}>₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={payMethod === 'cod' ? placeOrderCOD : payWithRazorpay}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#a8bfac' : payMethod==='online'?'linear-gradient(135deg,#145530,#1a6b3a)':'linear-gradient(135deg,#145530,#1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '16px', fontSize: 15, fontWeight: 700, cursor: loading?'not-allowed':'pointer', fontFamily: "'Poppins',sans-serif", marginTop: 20, boxShadow: '0 8px 24px rgba(20,85,48,0.3)', transition: 'all 0.2s' }}>
            {loading ? '⏳ Processing...' : payMethod === 'cod' ? '✅ Place Order (COD)' : '💳 Pay ₹'+grandTotal+' Online'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            <span style={{ fontSize: 11, color: '#6b8f71' }}>🔒 Secure & Safe Checkout</span>
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}