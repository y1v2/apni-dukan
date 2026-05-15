import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_HERE'; // ← Replace with your key
const RAZORPAY_LINK = 'https://razorpay.me/@yashvishwakarma7606';

const DEFAULT_COUPONS = [
  { code: 'APNI50', type: 'flat', value: 50, minOrder: 199 },
  { code: 'SAVE10', type: 'percent', value: 10, minOrder: 299 },
  { code: 'WELCOME', type: 'flat', value: 30, minOrder: 149 },
];

export default function Checkout() {
  const { cartItems, total, clearCart, wallet, deductFromWallet, getSavedAddresses, saveAddress } = useCart();
  const { isBlocked, rewardReferral } = useProducts();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const savedAddresses = getSavedAddresses();

  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '', street: '', city: 'Kalpi',
    pincode: '285204', landmark: '', location: null
  });
  const [selectedSavedAddr, setSelectedSavedAddr] = useState(null);
  const [payMethod, setPayMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCode, setAppliedCode] = useState('');
  const [useWallet, setUseWallet] = useState(false);

  const walletDiscount = useWallet ? Math.min(wallet, total) : 0;
  const deliveryCharge = total >= 199 ? 0 : 30;
  const grandTotal = Math.max(0, total - couponDiscount - walletDiscount + deliveryCharge);

  const inp = {
    width: '100%', padding: '11px 14px', border: '2px solid #d0e8d8', borderRadius: 12,
    fontSize: 13, outline: 'none', marginBottom: 12, fontFamily: 'Poppins, sans-serif',
    color: '#0a2e1a', background: '#f5f9f6', boxSizing: 'border-box',
  };

  const selectSavedAddress = (addr) => {
    setAddress({ ...addr, location: addr.location || null });
    setSelectedSavedAddr(addr);
    setLocationCaptured(!!addr.location);
    toast.success('Address selected! ✅');
  };

  const captureLocation = () => {
    if (!navigator.geolocation) { toast.error('Location support nahi hai'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setAddress(prev => ({ ...prev, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
        setLocationCaptured(true);
        toast.success('Location captured! 📍');
      },
      () => toast.error('Location access deny hua')
    );
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) { toast.error('Coupon code daalo'); return; }
    const saved = localStorage.getItem('apnidukan_coupons');
    const all = saved ? [...JSON.parse(saved), ...DEFAULT_COUPONS] : DEFAULT_COUPONS;
    const found = all.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active !== false);
    if (!found) { toast.error('Galat coupon code!'); return; }
    if (total < found.minOrder) { toast.error('Min order Rs.' + found.minOrder + ' chahiye'); return; }
    const disc = found.type === 'flat' ? found.value : Math.round(total * found.value / 100);
    setCouponDiscount(disc); setCouponApplied(true); setAppliedCode(found.code);
    toast.success('🎉 Rs.' + disc + ' ki discount mili!');
  };

  const validate = () => {
    if (!token) { toast.error('Pehle login karo'); navigate('/login'); return false; }
    if (user && isBlocked(user.email, user.phone)) {
      toast.error('Aapka account block hai. Admin se contact karo: +91 9670944301');
      return false;
    }
    if (!address.name.trim()) { toast.error('Naam bharo'); return false; }
    if (address.phone.replace(/\D/g, '').length < 10) { toast.error('10 digit phone bharo'); return false; }
    if (!address.street.trim()) { toast.error('Address bharo'); return false; }
    return true;
  };

  const buildWAMsg = (receipt) => {
    let msg = `🛒 NEW ORDER — Apni Dukan!\nReceipt: #${receipt}\nCustomer: ${address.name}\nPhone: ${address.phone}\nAddress: ${address.street}${address.landmark ? ', ' + address.landmark : ''}, ${address.city} - ${address.pincode}`;
    if (address.location) msg += `\nGPS: https://maps.google.com/?q=${address.location.lat},${address.location.lng}`;
    msg += `\n\nItems:\n${cartItems.map(i => `• ${i.name} x${i.qty} = Rs.${i.price * i.qty}`).join('\n')}`;
    if (couponDiscount > 0) msg += `\nCoupon (${appliedCode}): -Rs.${couponDiscount}`;
    if (walletDiscount > 0) msg += `\nWallet: -Rs.${walletDiscount}`;
    msg += `\nDelivery: ${deliveryCharge === 0 ? 'FREE' : 'Rs.' + deliveryCharge}`;
    msg += `\nTOTAL: Rs.${grandTotal}\nPayment: ${payMethod === 'cod' ? 'Cash on Delivery' : 'Online'}`;
    return msg;
  };

  const placeOrder = async (payStatus, payMethod_, razorpayId) => {
    const receipt = 'AD' + Date.now().toString().slice(-6);
    saveAddress(address); // Save address for next time
    if (useWallet && walletDiscount > 0) deductFromWallet(walletDiscount);

    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cartItems.map(i => ({ name: i.name, price: i.price, mrp: i.mrp || i.price, qty: i.qty, category: i.category || '', img: i.img || '' })),
        total, grandTotal, deliveryCharge, couponDiscount, walletDiscount, couponCode: appliedCode,
        address, paymentMethod: payMethod_, paymentStatus: payStatus, razorpayPaymentId: razorpayId
      }, { headers: { Authorization: 'Bearer ' + token } });
    } catch (e) { console.log('Backend not available, continuing...'); }

    toast.success('Order placed! Receipt: #' + receipt + ' 🎉');
    window.open('https://wa.me/919670944301?text=' + encodeURIComponent(buildWAMsg(receipt)), '_blank');
    clearCart();
    navigate('/orders');
  };

  const handleCOD = async () => {
    if (!validate()) return;
    setLoading(true);
    await placeOrder('Pending', 'COD', null);
    setLoading(false);
  };

  const loadRazorpay = () => new Promise(res => {
    if (window.Razorpay) return res(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => res(true); s.onerror = () => res(false);
    document.body.appendChild(s);
  });

  const handleOnline = async () => {
    if (!validate()) return;
    if (RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE') {
      window.open(RAZORPAY_LINK + '?amount=' + grandTotal, '_blank');
      toast.success('Razorpay link khul raha hai! Payment ke baad order confirm ho jayega.');
      return;
    }
    setLoading(true);
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Payment gateway load nahi hua'); setLoading(false); return; }
    new window.Razorpay({
      key: RAZORPAY_KEY, amount: grandTotal * 100, currency: 'INR', name: 'Apni Dukan',
      description: cartItems.length + ' items',
      handler: async r => { await placeOrder('Paid', 'Online', r.razorpay_payment_id); },
      prefill: { name: address.name, contact: address.phone, email: user?.email || '' },
      theme: { color: '#145530' },
      modal: { ondismiss: () => { toast.error('Payment cancel hua'); setLoading(false); } }
    }).open();
    setLoading(false);
  };

  if (cartItems.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f9f6', padding: 20 }}>
      <div style={{ fontSize: 60, marginBottom: 14 }}>🛒</div>
      <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#0a2e1a', marginBottom: 18 }}>Cart khali hai!</h2>
      <button onClick={() => navigate('/')} style={{ background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '13px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Shopping Karo →</button>
    </div>
  );

  const card = { background: '#fff', borderRadius: 20, border: '1.5px solid #e8f2ea', padding: '20px', marginBottom: 14 };

  return (
    <div style={{ background: '#f5f9f6', minHeight: '80vh', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a2e1a, #145530)', padding: '24px 20px' }}>
        <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Checkout 🛒</h1>
        <p style={{ color: '#86efac', fontSize: 13 }}>Delivery details bharo aur order karo!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, padding: '18px 20px', maxWidth: 1050, margin: '0 auto' }}>

        {/* LEFT */}
        <div>

          {/* Saved Addresses */}
          {savedAddresses.length > 0 && (
            <div style={card}>
              <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>📍 Saved Addresses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {savedAddresses.map((addr, i) => (
                  <div key={i} onClick={() => selectSavedAddress(addr)}
                    style={{ border: '2px solid ' + (selectedSavedAddr === addr ? '#145530' : '#e8f2ea'), borderRadius: 14, padding: '12px 14px', cursor: 'pointer', background: selectedSavedAddr === addr ? '#e6f4ec' : '#fff', transition: 'all 0.2s' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0a2e1a' }}>{addr.name} — 📞 {addr.phone}</div>
                    <div style={{ fontSize: 12, color: '#4a6b50', marginTop: 3 }}>{addr.street}{addr.landmark ? ', ' + addr.landmark : ''}, {addr.city} - {addr.pincode}</div>
                    {selectedSavedAddr === addr && <div style={{ fontSize: 11, color: '#145530', fontWeight: 700, marginTop: 4 }}>✓ Selected</div>}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#6b8f71', marginTop: 10, fontWeight: 500 }}>
                Ya neeche naya address bharo 👇
              </div>
            </div>
          )}

          {/* Address Form */}
          <div style={card}>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>
              {savedAddresses.length > 0 ? '📍 Naya Address Daalo' : '📍 Delivery Address'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Naam *</label><input style={inp} placeholder="Poora naam" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Phone *</label><input style={inp} placeholder="10 digit mobile" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} maxLength={10} /></div>
            </div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Address *</label>
            <input style={inp} placeholder="Ghar no., gali, mohalla..." value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
            <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Landmark (optional)</label>
            <input style={inp} placeholder="Paas mein mandir, school..." value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Shahar</label><input style={inp} value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Pincode</label><input style={inp} value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} maxLength={6} /></div>
            </div>
            <button type="button" onClick={captureLocation}
              style={{ width: '100%', background: locationCaptured ? '#e6f4ec' : '#f5f9f6', color: locationCaptured ? '#145530' : '#4a6b50', border: '2px solid ' + (locationCaptured ? '#b8dfc6' : '#d0e8d8'), borderRadius: 12, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {locationCaptured ? '✅ Location Captured!' : '📍 Live Location Share Karo'}
            </button>
          </div>

          {/* Wallet */}
          {wallet > 0 && (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a' }}>💰 Wallet: Rs.{wallet}</div>
                  <div style={{ fontSize: 11, color: '#6b8f71', marginTop: 2 }}>Referral earnings</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={useWallet} onChange={e => setUseWallet(e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#145530' }}>Use (-Rs.{walletDiscount})</span>
                </label>
              </div>
            </div>
          )}

          {/* Coupon */}
          <div style={card}>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 12 }}>🎟️ Coupon Code</h3>
            <div style={{ display: 'flex', gap: 9 }}>
              <input placeholder="Code — jaise APNI50" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} disabled={couponApplied}
                style={{ flex: 1, padding: '11px 14px', border: '2px solid ' + (couponApplied ? '#b8dfc6' : '#d0e8d8'), borderRadius: 12, fontSize: 13, outline: 'none', fontFamily: 'Poppins, sans-serif', background: couponApplied ? '#e6f4ec' : '#f5f9f6' }} />
              <button onClick={couponApplied ? () => { setCouponCode(''); setCouponDiscount(0); setCouponApplied(false); setAppliedCode(''); toast.success('Coupon hataya'); } : applyCoupon}
                style={{ background: couponApplied ? '#fee2e2' : '#145530', color: couponApplied ? '#e24b4a' : '#fff', border: 'none', borderRadius: 12, padding: '11px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {couponApplied ? '✕' : 'Apply'}
              </button>
            </div>
            {couponApplied && <div style={{ background: '#e6f4ec', borderRadius: 9, padding: '8px 12px', marginTop: 9, fontSize: 12, color: '#145530', fontWeight: 700 }}>✅ Rs.{couponDiscount} discount! 🎉</div>}
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
              {['APNI50', 'SAVE10', 'WELCOME'].map(c => (
                <button key={c} onClick={() => { if (!couponApplied) setCouponCode(c); }}
                  style={{ background: '#f5f9f6', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div style={card}>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 12 }}>💳 Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['cod', '💵', 'Cash on Delivery', 'Delivery par cash'], ['online', '📱', 'UPI / Card Online', 'Razorpay secure']].map(([val, icon, title, desc]) => (
                <div key={val} onClick={() => setPayMethod(val)}
                  style={{ border: '2px solid ' + (payMethod === val ? '#145530' : '#e8f2ea'), borderRadius: 14, padding: '16px 12px', cursor: 'pointer', background: payMethod === val ? '#e6f4ec' : '#fff', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 28, marginBottom: 5 }}>{icon}</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 14, fontWeight: 800, color: '#0a2e1a', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 11, color: '#6b8f71' }}>{desc}</div>
                  {payMethod === val && <div style={{ fontSize: 10, color: '#145530', fontWeight: 700, marginTop: 4 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT Summary */}
        <div style={{ ...card, height: 'fit-content', position: 'sticky', top: 80, marginBottom: 0 }}>
          <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>📦 Order Summary</h3>
          <div style={{ maxHeight: 230, overflowY: 'auto', marginBottom: 12 }}>
            {cartItems.map(i => (
              <div key={i._id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #f0f7f2' }}>
                {i.img && <img src={i.img} alt={i.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 9, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2e1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</div>
                  <div style={{ fontSize: 10, color: '#6b8f71' }}>{i.quantity} x{i.qty}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#145530', fontFamily: 'Baloo 2, cursive', flexShrink: 0 }}>Rs.{i.price * i.qty}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b8f71', marginBottom: 7 }}><span>Subtotal</span><span>Rs.{total}</span></div>
            {couponDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#22c55e', fontWeight: 700, marginBottom: 7 }}><span>🎟️ Coupon</span><span>-Rs.{couponDiscount}</span></div>}
            {walletDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#145530', fontWeight: 700, marginBottom: 7 }}><span>💰 Wallet</span><span>-Rs.{walletDiscount}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 7 }}>
              <span style={{ color: '#6b8f71' }}>Delivery</span>
              <span style={{ color: deliveryCharge === 0 ? '#145530' : '#0a2e1a', fontWeight: deliveryCharge === 0 ? 700 : 500 }}>{deliveryCharge === 0 ? 'FREE 🎉' : 'Rs.' + deliveryCharge}</span>
            </div>
            {deliveryCharge > 0 && <div style={{ background: '#fff7ed', borderRadius: 7, padding: '6px 10px', fontSize: 11, color: '#f07c2a', fontWeight: 600, marginBottom: 7 }}>Rs.{199 - total} aur add karo FREE delivery!</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, padding: '10px 0', borderTop: '2px solid #e8f2ea', fontFamily: 'Baloo 2, cursive', color: '#0a2e1a' }}>
              <span>Grand Total</span><span style={{ color: '#145530' }}>Rs.{grandTotal}</span>
            </div>
          </div>

          <button onClick={payMethod === 'cod' ? handleCOD : handleOnline} disabled={loading}
            style={{ width: '100%', background: loading ? '#a8bfac' : 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', marginTop: 6, boxShadow: loading ? 'none' : '0 8px 20px rgba(20,85,48,0.28)', transition: 'all 0.2s' }}>
            {loading ? '⏳ Processing...' : payMethod === 'cod' ? '✅ Order Place Karo (COD)' : '💳 Rs.' + grandTotal + ' Online Pay'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 12 }}>
            {[['🔒', 'Secure'], ['⚡', 'Fast'], ['🤝', 'Trusted']].map(([icon, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15 }}>{icon}</div>
                <div style={{ fontSize: 9, color: '#6b8f71', fontWeight: 600, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1.5px solid #e8f2ea', marginTop: 13, paddingTop: 12 }}>
            <a href={'https://wa.me/917355691229?text=' + encodeURIComponent('Namaste! Mujhe order karna hai:\n' + cartItems.map(i => '• ' + i.name + ' x' + i.qty + ' = Rs.' + i.price * i.qty).join('\n') + '\nTotal: Rs.' + grandTotal)}
              target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', background: '#25D366', color: '#fff', borderRadius: 50, padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              💬 WhatsApp par Order Karo
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 340px"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: relative !important; top: 0 !important; }
          div[style*="padding: 18px 20px"] { padding: 12px !important; }
        }
      `}</style>
    </div>
  );
}