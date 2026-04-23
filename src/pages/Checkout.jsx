import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const RAZORPAY_KEY = 'https://razorpay.me/@yashvishwakarma7606';

const COUPONS = [
  { code: 'APNI50', type: 'flat', value: 50, minOrder: 199 },
  { code: 'SAVE10', type: 'percent', value: 10, minOrder: 299 },
  { code: 'WELCOME', type: 'flat', value: 30, minOrder: 149 },
];

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const [address, setAddress] = useState({
    name: user ? user.name || '' : '',
    phone: '',
    street: '',
    city: 'Kalpi',
    pincode: '285204',
    landmark: '',
    location: null,
  });
  const [payMethod, setPayMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');

  const deliveryCharge = total >= 199 ? 0 : 30;
  const grandTotal = total - couponDiscount + deliveryCharge;

  const inp = {
    width: '100%', padding: '12px 16px', border: '2px solid #d0e8d8', borderRadius: 14,
    fontSize: 14, outline: 'none', marginBottom: 14, fontFamily: 'Poppins, sans-serif',
    color: '#0a2e1a', background: '#f5f9f6', boxSizing: 'border-box',
  };

  const captureLocation = () => {
    if (!navigator.geolocation) { toast.error('Location support nahi hai'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress((prev) => ({ ...prev, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
        setLocationCaptured(true);
        toast.success('Location capture ho gayi! 📍');
      },
      () => toast.error('Location access deny hua')
    );
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) { toast.error('Coupon code daalo'); return; }
    const saved = localStorage.getItem('apnidukan_coupons');
    const allCoupons = saved ? [...JSON.parse(saved), ...COUPONS] : COUPONS;
    const found = allCoupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.active !== false);
    if (!found) { toast.error('Galat coupon code!'); return; }
    if (total < found.minOrder) { toast.error('Min order Rs.' + found.minOrder + ' chahiye'); return; }
    const disc = found.type === 'flat' ? found.value : Math.round(total * found.value / 100);
    setCouponDiscount(disc);
    setCouponApplied(true);
    setAppliedCouponCode(found.code);
    toast.success('🎉 Rs.' + disc + ' ki discount mili!');
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(false);
    setAppliedCouponCode('');
    toast.success('Coupon hataya');
  };

  const validate = () => {
    if (!token) { toast.error('Pehle login karo'); navigate('/login'); return false; }
    if (!address.name.trim()) { toast.error('Apna naam bharo'); return false; }
    if (!address.phone.trim() || address.phone.replace(/\D/g, '').length < 10) { toast.error('Sahi phone number bharo (10 digits)'); return false; }
    if (!address.street.trim()) { toast.error('Ghar ka address bharo'); return false; }
    if (cartItems.length === 0) { toast.error('Cart khali hai'); return false; }
    return true;
  };

  const buildWhatsAppMsg = (receiptNum) => {
    let msg = '🛒 NEW ORDER!\n';
    msg += 'Receipt: #' + receiptNum + '\n';
    msg += 'Customer: ' + address.name + '\n';
    msg += 'Phone: ' + address.phone + '\n';
    msg += 'Address: ' + address.street;
    if (address.landmark) msg += ', ' + address.landmark;
    msg += ', ' + address.city + ' - ' + address.pincode + '\n';
    if (address.location) msg += 'Location: https://maps.google.com/?q=' + address.location.lat + ',' + address.location.lng + '\n';
    msg += '\nItems:\n';
    cartItems.forEach((i) => { msg += '• ' + i.name + ' x' + i.qty + ' = Rs.' + (i.price * i.qty) + '\n'; });
    if (couponDiscount > 0) msg += 'Coupon (' + appliedCouponCode + '): -Rs.' + couponDiscount + '\n';
    msg += 'Delivery: ' + (deliveryCharge === 0 ? 'FREE' : 'Rs.' + deliveryCharge) + '\n';
    msg += 'TOTAL: Rs.' + grandTotal + '\n';
    msg += 'Payment: ' + payMethod.toUpperCase();
    return msg;
  };

  const placeOrderCOD = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const receiptNum = 'AD' + Date.now().toString().slice(-6);
      let orderData = {};
      try {
        const { data } = await axios.post('http://localhost:5000/api/orders', {
          items: cartItems.map((i) => ({ name: i.name, price: i.price, mrp: i.mrp || i.price, qty: i.qty, category: i.category || '', img: i.img || '' })),
          total, grandTotal, deliveryCharge, couponDiscount, couponCode: appliedCouponCode,
          address, paymentMethod: 'COD', paymentStatus: 'Pending',
        }, { headers: { Authorization: 'Bearer ' + token } });
        orderData = data;
      } catch (backendErr) {
        console.log('Backend not available, saving locally');
      }
      const finalReceipt = (orderData.receiptNumber) || receiptNum;
      toast.success('Order place ho gaya! Receipt: #' + finalReceipt + ' 🎉');
      const waMsg = buildWhatsAppMsg(finalReceipt);
      window.open('https://wa.me/919670944301?text=' + encodeURIComponent(waMsg), '_blank');
      clearCart();
      navigate('/orders');
    } catch (e) {
      toast.error('Order place karne mein error aaya');
    }
    setLoading(false);
  };

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const payOnline = async () => {
    if (!validate()) return;
    if (RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE') { toast.error('Razorpay key set nahi hai. COD use karo.'); return; }
    setLoading(true);
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Payment gateway load nahi hua'); setLoading(false); return; }
    const options = {
      key: RAZORPAY_KEY,
      amount: grandTotal * 100,
      currency: 'INR',
      name: 'Apni Dukan',
      description: cartItems.length + ' items',
      handler: async (response) => {
        try {
          const { data } = await axios.post('http://localhost:5000/api/orders', {
            items: cartItems.map((i) => ({ name: i.name, price: i.price, mrp: i.mrp || i.price, qty: i.qty, category: i.category || '', img: i.img || '' })),
            total, grandTotal, deliveryCharge, address,
            paymentMethod: 'Online', paymentStatus: 'Paid',
            razorpayPaymentId: response.razorpay_payment_id,
          }, { headers: { Authorization: 'Bearer ' + token } });
          toast.success('Payment successful! 🎉');
          clearCart();
          navigate('/orders');
        } catch (err) {
          toast.error('Order save nahi hua. Support se contact karo.');
        }
      },
      prefill: { name: address.name, contact: address.phone, email: user ? user.email || '' : '' },
      theme: { color: '#145530' },
      modal: { ondismiss: () => { toast.error('Payment cancel hua'); setLoading(false); } },
    };
    new window.Razorpay(options).open();
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f9f6', padding: 20 }}>
        <div style={{ fontSize: 60, marginBottom: 14 }}>🛒</div>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#0a2e1a', marginBottom: 18 }}>Cart khali hai!</h2>
        <button onClick={() => navigate('/')} style={{ background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '13px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Shopping Karo →</button>
      </div>
    );
  }

  const card = { background: '#fff', borderRadius: 22, border: '1.5px solid #e8f2ea', padding: '24px', marginBottom: 18 };

  return (
    <div style={{ background: '#f5f9f6', minHeight: '80vh', fontFamily: 'Poppins, sans-serif' }}>

      <div style={{ background: 'linear-gradient(135deg, #0a2e1a, #145530)', padding: '28px 32px' }}>
        <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Checkout 🛒</h1>
        <p style={{ color: '#86efac', fontSize: 13 }}>Delivery details bharo aur order karo!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, padding: '24px 32px', maxWidth: 1100, margin: '0 auto' }}>

        {/* LEFT */}
        <div>

          {/* Address */}
          <div style={card}>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 19, fontWeight: 800, color: '#0a2e1a', marginBottom: 18 }}>📍 Delivery Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Poora Naam *</label>
                <input style={inp} placeholder="Apna poora naam" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Phone Number *</label>
                <input style={inp} placeholder="10 digit mobile" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} maxLength={10} />
              </div>
            </div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Ghar ka Address *</label>
            <input style={inp} placeholder="Ghar no., gali, mohalla..." value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Landmark (optional)</label>
            <input style={inp} placeholder="Paas mein mandir, school..." value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Shahar</label>
                <input style={inp} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Pincode</label>
                <input style={inp} value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} maxLength={6} />
              </div>
            </div>
            <button
              type="button"
              onClick={captureLocation}
              style={{ width: '100%', background: locationCaptured ? '#e6f4ec' : '#f5f9f6', color: locationCaptured ? '#145530' : '#4a6b50', border: '2px solid ' + (locationCaptured ? '#b8dfc6' : '#d0e8d8'), borderRadius: 12, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {locationCaptured ? '✅ Location Capture Ho Gayi!' : '📍 Live Location Share Karo (Recommended)'}
            </button>
          </div>

          {/* Coupon */}
          <div style={card}>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 19, fontWeight: 800, color: '#0a2e1a', marginBottom: 16 }}>🎟️ Coupon Code</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                placeholder="Coupon code - jaise APNI50"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={couponApplied}
                style={{ flex: 1, padding: '12px 16px', border: '2px solid ' + (couponApplied ? '#b8dfc6' : '#d0e8d8'), borderRadius: 14, fontSize: 14, outline: 'none', fontFamily: 'Poppins, sans-serif', color: '#0a2e1a', background: couponApplied ? '#e6f4ec' : '#f5f9f6' }}
              />
              <button
                onClick={couponApplied ? removeCoupon : applyCoupon}
                style={{ background: couponApplied ? '#fee2e2' : '#145530', color: couponApplied ? '#e24b4a' : '#fff', border: 'none', borderRadius: 14, padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}
              >
                {couponApplied ? '✕ Hata Do' : 'Apply'}
              </button>
            </div>
            {couponApplied && (
              <div style={{ background: '#e6f4ec', borderRadius: 10, padding: '10px 14px', marginTop: 10, fontSize: 13, color: '#145530', fontWeight: 700 }}>
                ✅ Coupon applied! Rs.{couponDiscount} ki discount mili 🎉
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {['APNI50', 'SAVE10', 'WELCOME'].map((c) => (
                <button key={c} onClick={() => { if (!couponApplied) { setCouponCode(c); } }}
                  style={{ background: '#f5f9f6', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div style={card}>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 19, fontWeight: 800, color: '#0a2e1a', marginBottom: 16 }}>💳 Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['cod', '💵', 'Cash on Delivery', 'Delivery par cash dena'], ['online', '📱', 'UPI / Card / Net Banking', 'Razorpay se secure payment']].map(([val, icon, title, desc]) => (
                <div
                  key={val}
                  onClick={() => setPayMethod(val)}
                  style={{ border: '2px solid ' + (payMethod === val ? '#145530' : '#e8f2ea'), borderRadius: 16, padding: '18px 14px', cursor: 'pointer', background: payMethod === val ? '#e6f4ec' : '#fff', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#0a2e1a', marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 11, color: '#6b8f71' }}>{desc}</div>
                  {payMethod === val && <div style={{ marginTop: 6, fontSize: 10, color: '#145530', fontWeight: 700 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
            {payMethod === 'online' && RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE' && (
              <div style={{ background: '#fff7ed', borderRadius: 12, padding: '12px 14px', marginTop: 12, fontSize: 12, color: '#f07c2a', fontWeight: 600 }}>
                ⚠️ Razorpay key set nahi hai. Checkout.jsx mein RAZORPAY_KEY update karo.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Summary */}
        <div style={{ ...card, height: 'fit-content', position: 'sticky', top: 80, marginBottom: 0 }}>
          <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 19, fontWeight: 800, color: '#0a2e1a', marginBottom: 18 }}>📦 Order Summary</h3>

          <div style={{ maxHeight: 250, overflowY: 'auto', marginBottom: 14 }}>
            {cartItems.map((i) => (
              <div key={i._id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 0', borderBottom: '1px solid #f0f7f2' }}>
                {i.img && <img src={i.img} alt={i.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2e1a' }}>{i.name}</div>
                  <div style={{ fontSize: 10, color: '#6b8f71' }}>{i.quantity} x {i.qty}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#145530', fontFamily: 'Baloo 2, cursive' }}>Rs.{i.price * i.qty}</div>
                  {i.mrp && i.mrp > i.price && <div style={{ fontSize: 9, color: '#9ca3af', textDecoration: 'line-through' }}>Rs.{i.mrp * i.qty}</div>}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b8f71', marginBottom: 7, padding: '5px 0' }}>
              <span>Subtotal ({cartItems.length} items)</span><span>Rs.{total}</span>
            </div>
            {couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#22c55e', fontWeight: 700, marginBottom: 7, padding: '5px 0' }}>
                <span>🎟️ Coupon ({appliedCouponCode})</span><span>-Rs.{couponDiscount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 7, padding: '5px 0' }}>
              <span style={{ color: '#6b8f71' }}>Delivery</span>
              <span style={{ color: deliveryCharge === 0 ? '#145530' : '#0a2e1a', fontWeight: deliveryCharge === 0 ? 700 : 500 }}>
                {deliveryCharge === 0 ? 'FREE 🎉' : 'Rs.' + deliveryCharge}
              </span>
            </div>
            {deliveryCharge > 0 && (
              <div style={{ background: '#fff7ed', borderRadius: 8, padding: '7px 10px', fontSize: 11, color: '#f07c2a', fontWeight: 600, marginBottom: 8 }}>
                Rs.{199 - total} aur add karo FREE delivery ke liye!
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 19, fontWeight: 800, padding: '12px 0', borderTop: '2px solid #e8f2ea', fontFamily: 'Baloo 2, cursive', color: '#0a2e1a' }}>
              <span>Grand Total</span><span style={{ color: '#145530' }}>Rs.{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={payMethod === 'cod' ? placeOrderCOD : payOnline}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#a8bfac' : 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '15px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', marginTop: 6, boxShadow: loading ? 'none' : '0 8px 20px rgba(20,85,48,0.28)', transition: 'all 0.2s' }}
          >
            {loading ? '⏳ Processing...' : payMethod === 'cod' ? '✅ Order Place Karo (COD)' : '💳 Rs.' + grandTotal + ' Online Pay Karo'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14 }}>
            {[['🔒', 'Secure'], ['⚡', 'Fast'], ['🤝', 'Trusted']].map(([icon, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16 }}>{icon}</div>
                <div style={{ fontSize: 10, color: '#6b8f71', fontWeight: 600, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1.5px solid #e8f2ea', marginTop: 14, paddingTop: 13 }}>
            <p style={{ fontSize: 11, color: '#6b8f71', textAlign: 'center', marginBottom: 9 }}>Ya WhatsApp par order karo</p>
            <a
              href={'https://wa.me/917355691229?text=' + encodeURIComponent('Namaste Apni Dukan! Mujhe order karna hai.\n' + cartItems.map((i) => '• ' + i.name + ' x' + i.qty + ' = Rs.' + i.price * i.qty).join('\n') + '\nTotal: Rs.' + grandTotal + '\nAddress: ' + address.street + ', ' + address.city)}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', background: '#25D366', color: '#fff', borderRadius: 50, padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
            >
              💬 WhatsApp par Order Karo
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width:768px) {
          div[style*="grid-template-columns: 1fr 360px"] { grid-template-columns:1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns:1fr !important; }
          div[style*="padding: 24px 32px"] { padding:14px !important; }
          div[style*="position: sticky"] { position:relative !important; top:0 !important; }
        }
      `}</style>
    </div>
  );
}