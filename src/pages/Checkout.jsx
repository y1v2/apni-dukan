import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_HERE';
const RAZORPAY_LINK = 'https://razorpay.me/@yashvishwakarma7606';

const DEFAULT_COUPONS = [
  { code:'APNI50', type:'flat', value:50, minOrder:199 },
  { code:'SAVE10', type:'percent', value:10, minOrder:299 },
  { code:'WELCOME', type:'flat', value:30, minOrder:149 },
];

export default function Checkout() {
  const { cartItems, total, savings, clearCart, wallet, deductFromWallet } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const [address, setAddress] = useState({ name:user?.name||'', phone:'', street:'', city:'Kalpi', pincode:'285204', landmark:'', location:null });
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

  const inp = { width:'100%', padding:'12px 15px', border:'2px solid #d0e8d8', borderRadius:13, fontSize:14, outline:'none', marginBottom:13, fontFamily:'Poppins, sans-serif', color:'#0a2e1a', background:'#f5f9f6', boxSizing:'border-box' };

  const captureLocation = () => {
    if (!navigator.geolocation) { toast.error('Location support nahi hai'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setAddress(prev=>({...prev, location:{lat:pos.coords.latitude,lng:pos.coords.longitude}})); setLocationCaptured(true); toast.success('Location captured! 📍'); },
      () => toast.error('Location access deny hua')
    );
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) { toast.error('Coupon code daalo'); return; }
    const saved = localStorage.getItem('apnidukan_coupons');
    const all = saved ? [...JSON.parse(saved), ...DEFAULT_COUPONS] : DEFAULT_COUPONS;
    const found = all.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active !== false);
    if (!found) { toast.error('Galat coupon code!'); return; }
    if (total < found.minOrder) { toast.error('Min order Rs.'+found.minOrder+' chahiye'); return; }
    const disc = found.type==='flat' ? found.value : Math.round(total*found.value/100);
    setCouponDiscount(disc); setCouponApplied(true); setAppliedCode(found.code);
    toast.success('🎉 Rs.'+disc+' ki discount mili!');
  };

  const validate = () => {
    if (!token) { toast.error('Pehle login karo'); navigate('/login'); return false; }
    if (!address.name.trim()) { toast.error('Naam bharo'); return false; }
    if (address.phone.replace(/\D/g,'').length < 10) { toast.error('10 digit phone number bharo'); return false; }
    if (!address.street.trim()) { toast.error('Address bharo'); return false; }
    return true;
  };

  const buildWhatsAppMsg = (receipt) => {
    let msg = '🛒 NEW ORDER from Apni Dukan!\n';
    msg += 'Receipt: #'+receipt+'\n';
    msg += 'Customer: '+address.name+'\n';
    msg += 'Phone: '+address.phone+'\n';
    msg += 'Address: '+address.street+(address.landmark?', '+address.landmark:'')+', '+address.city+' - '+address.pincode+'\n';
    if (address.location) msg += 'GPS: https://maps.google.com/?q='+address.location.lat+','+address.location.lng+'\n';
    msg += '\nItems:\n';
    cartItems.forEach(i => { msg += '• '+i.name+' x'+i.qty+' = Rs.'+(i.price*i.qty)+'\n'; });
    if (couponDiscount>0) msg += 'Coupon ('+appliedCode+'): -Rs.'+couponDiscount+'\n';
    if (walletDiscount>0) msg += 'Wallet: -Rs.'+walletDiscount+'\n';
    msg += 'Delivery: '+(deliveryCharge===0?'FREE':'Rs.'+deliveryCharge)+'\n';
    msg += 'TOTAL: Rs.'+grandTotal+'\n';
    msg += 'Payment: '+(payMethod==='cod'?'Cash on Delivery':'Online - '+payMethod);
    return msg;
  };

  const placeOrder = async (paymentStatus, paymentMethod, razorpayId) => {
    const receipt = 'AD'+Date.now().toString().slice(-6);
    if (useWallet && walletDiscount > 0) deductFromWallet(walletDiscount);
    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cartItems.map(i=>({name:i.name,price:i.price,mrp:i.mrp||i.price,qty:i.qty,category:i.category||'',img:i.img||''})),
        total, grandTotal, deliveryCharge, couponDiscount, walletDiscount,
        couponCode:appliedCode, address, paymentMethod, paymentStatus, razorpayPaymentId:razorpayId
      }, { headers: { Authorization: 'Bearer '+token } });
    } catch (e) { console.log('Backend not available, order saved locally'); }
    toast.success('Order placed! Receipt: #'+receipt+' 🎉');
    window.open('https://wa.me/919670944301?text='+encodeURIComponent(buildWhatsAppMsg(receipt)), '_blank');
    clearCart();
    navigate('/orders');
  };

  const handleCOD = async () => {
    if (!validate()) return;
    setLoading(true);
    await placeOrder('Pending', 'COD', null);
    setLoading(false);
  };

  const handleRazorpayLink = () => {
    if (!validate()) return;
    const msg = 'Apni Dukan order - Rs.'+grandTotal+' pay karo\n'+buildWhatsAppMsg('PENDING');
    window.open(RAZORPAY_LINK+'?amount='+grandTotal+'&description=Apni+Dukan+Order', '_blank');
    toast.success('Razorpay link khul raha hai! Payment ke baad order confirm ho jayega.');
  };

  const loadRazorpay = () => new Promise(res => {
    if (window.Razorpay) return res(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = ()=>res(true); s.onerror = ()=>res(false);
    document.body.appendChild(s);
  });

  const handleRazorpayDirect = async () => {
    if (!validate()) return;
    if (RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE') {
      handleRazorpayLink();
      return;
    }
    setLoading(true);
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Payment gateway load nahi hua'); setLoading(false); return; }
    const options = {
      key: RAZORPAY_KEY, amount: grandTotal*100, currency: 'INR', name: 'Apni Dukan',
      description: cartItems.length+' items',
      handler: async (response) => { await placeOrder('Paid','Online',response.razorpay_payment_id); },
      prefill: { name:address.name, contact:address.phone, email:user?.email||'' },
      theme: { color:'#145530' },
      modal: { ondismiss: ()=>{ toast.error('Payment cancel hua'); setLoading(false); } }
    };
    new window.Razorpay(options).open();
    setLoading(false);
  };

  if (cartItems.length === 0) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f9f6', padding:20 }}>
      <div style={{ fontSize:60, marginBottom:14 }}>🛒</div>
      <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:24, fontWeight:800, color:'#0a2e1a', marginBottom:18 }}>Cart khali hai!</h2>
      <button onClick={()=>navigate('/')} style={{ background:'#145530', color:'#fff', border:'none', borderRadius:50, padding:'13px 32px', fontSize:14, fontWeight:700, cursor:'pointer' }}>Shopping Karo →</button>
    </div>
  );

  const card = { background:'#fff', borderRadius:22, border:'1.5px solid #e8f2ea', padding:'22px', marginBottom:16 };

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', fontFamily:'Poppins, sans-serif' }}>
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'26px 24px' }}>
        <h1 style={{ fontFamily:'Baloo 2, cursive', fontSize:28, fontWeight:800, color:'#fff', marginBottom:4 }}>Checkout 🛒</h1>
        <p style={{ color:'#86efac', fontSize:13 }}>Delivery details bharo aur order karo!</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 350px', gap:18, padding:'20px 20px', maxWidth:1050, margin:'0 auto' }}>

        {/* LEFT */}
        <div>
          {/* Address */}
          <div style={card}>
            <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>📍 Delivery Address</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 13px' }}>
              <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Poora Naam *</label><input style={inp} placeholder="Apna naam" value={address.name} onChange={e=>setAddress({...address,name:e.target.value})} /></div>
              <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Phone *</label><input style={inp} placeholder="10 digit mobile" value={address.phone} onChange={e=>setAddress({...address,phone:e.target.value})} maxLength={10} /></div>
            </div>
            <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Address *</label>
            <input style={inp} placeholder="Ghar no., gali, mohalla..." value={address.street} onChange={e=>setAddress({...address,street:e.target.value})} />
            <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Landmark (optional)</label>
            <input style={inp} placeholder="Paas mein mandir, school..." value={address.landmark} onChange={e=>setAddress({...address,landmark:e.target.value})} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 13px' }}>
              <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Shahar</label><input style={inp} value={address.city} onChange={e=>setAddress({...address,city:e.target.value})} /></div>
              <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Pincode</label><input style={inp} value={address.pincode} onChange={e=>setAddress({...address,pincode:e.target.value})} maxLength={6} /></div>
            </div>
            <button type="button" onClick={captureLocation} style={{ width:'100%', background:locationCaptured?'#e6f4ec':'#f5f9f6', color:locationCaptured?'#145530':'#4a6b50', border:'2px solid '+(locationCaptured?'#b8dfc6':'#d0e8d8'), borderRadius:12, padding:'11px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {locationCaptured ? '✅ Location Captured!' : '📍 Live Location Share Karo (Recommended)'}
            </button>
          </div>

          {/* Wallet */}
          {wallet > 0 && (
            <div style={card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontFamily:'Baloo 2, cursive', fontSize:17, fontWeight:800, color:'#0a2e1a' }}>💰 Wallet Balance: Rs.{wallet}</div>
                  <div style={{ fontSize:12, color:'#6b8f71', marginTop:3 }}>Referral ya bonus amount</div>
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={useWallet} onChange={e=>setUseWallet(e.target.checked)} style={{ width:18, height:18, cursor:'pointer' }} />
                  <span style={{ fontSize:13, fontWeight:700, color:'#145530' }}>Use (Rs.{walletDiscount} deduct hoga)</span>
                </label>
              </div>
            </div>
          )}

          {/* Coupon */}
          <div style={card}>
            <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:17, fontWeight:800, color:'#0a2e1a', marginBottom:14 }}>🎟️ Coupon Code</h3>
            <div style={{ display:'flex', gap:9 }}>
              <input placeholder="Coupon - jaise APNI50" value={couponCode} onChange={e=>setCouponCode(e.target.value.toUpperCase())} disabled={couponApplied}
                style={{ flex:1, padding:'11px 15px', border:'2px solid '+(couponApplied?'#b8dfc6':'#d0e8d8'), borderRadius:13, fontSize:13, outline:'none', fontFamily:'Poppins, sans-serif', background:couponApplied?'#e6f4ec':'#f5f9f6' }} />
              <button onClick={couponApplied?()=>{setCouponCode('');setCouponDiscount(0);setCouponApplied(false);setAppliedCode('');toast.success('Coupon hataya');}:applyCoupon}
                style={{ background:couponApplied?'#fee2e2':'#145530', color:couponApplied?'#e24b4a':'#fff', border:'none', borderRadius:13, padding:'11px 18px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                {couponApplied?'✕ Hata':'Apply'}
              </button>
            </div>
            {couponApplied && <div style={{ background:'#e6f4ec', borderRadius:10, padding:'9px 13px', marginTop:9, fontSize:12, color:'#145530', fontWeight:700 }}>✅ Rs.{couponDiscount} ki discount! 🎉</div>}
            <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:10 }}>
              {['APNI50','SAVE10','WELCOME'].map(c=>(
                <button key={c} onClick={()=>{if(!couponApplied)setCouponCode(c);}}
                  style={{ background:'#f5f9f6', color:'#145530', border:'1.5px solid #b8dfc6', borderRadius:50, padding:'4px 13px', fontSize:11, fontWeight:600, cursor:'pointer' }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div style={card}>
            <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:17, fontWeight:800, color:'#0a2e1a', marginBottom:14 }}>💳 Payment Method</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[['cod','💵','Cash on Delivery'],['razorpay','💳','UPI/Card Online'],['whatsapp','💬','WhatsApp Order']].map(([val,icon,title])=>(
                <div key={val} onClick={()=>setPayMethod(val)}
                  style={{ border:'2px solid '+(payMethod===val?'#145530':'#e8f2ea'), borderRadius:14, padding:'14px 10px', cursor:'pointer', background:payMethod===val?'#e6f4ec':'#fff', textAlign:'center', transition:'all 0.2s' }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontFamily:'Baloo 2, cursive', fontSize:13, fontWeight:800, color:'#0a2e1a' }}>{title}</div>
                  {payMethod===val && <div style={{ fontSize:9, color:'#145530', fontWeight:700, marginTop:4 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
            {payMethod==='razorpay' && (
              <div style={{ background:'#e6f4ec', borderRadius:11, padding:'11px 14px', marginTop:11, fontSize:12, color:'#145530', fontWeight:500 }}>
                ✅ Secure payment via Razorpay. UPI, Cards, Net Banking sab support.
                <a href={RAZORPAY_LINK} target="_blank" rel="noreferrer" style={{ display:'block', color:'#145530', fontWeight:700, marginTop:4 }}>Direct link: {RAZORPAY_LINK}</a>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT Summary */}
        <div style={{ ...card, height:'fit-content', position:'sticky', top:80, marginBottom:0 }}>
          <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>📦 Order Summary</h3>
          <div style={{ maxHeight:240, overflowY:'auto', marginBottom:14 }}>
            {cartItems.map(i=>(
              <div key={i._id} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 0', borderBottom:'1px solid #f0f7f2' }}>
                {i.img && <img src={i.img} alt={i.name} style={{ width:38, height:38, objectFit:'cover', borderRadius:10, flexShrink:0 }} />}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#0a2e1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{i.name}</div>
                  <div style={{ fontSize:10, color:'#6b8f71' }}>{i.quantity} x{i.qty}</div>
                </div>
                <div style={{ fontSize:12, fontWeight:800, color:'#145530', fontFamily:'Baloo 2, cursive', flexShrink:0 }}>Rs.{i.price*i.qty}</div>
              </div>
            ))}
          </div>
          <div>
            {savings>0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#22c55e', fontWeight:700, marginBottom:7 }}><span>🎉 Bachat</span><span>-Rs.{savings}</span></div>}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#6b8f71', marginBottom:7 }}><span>Subtotal</span><span>Rs.{total}</span></div>
            {couponDiscount>0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#22c55e', fontWeight:700, marginBottom:7 }}><span>🎟️ Coupon</span><span>-Rs.{couponDiscount}</span></div>}
            {walletDiscount>0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#145530', fontWeight:700, marginBottom:7 }}><span>💰 Wallet</span><span>-Rs.{walletDiscount}</span></div>}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:7 }}>
              <span style={{ color:'#6b8f71' }}>Delivery</span>
              <span style={{ color:deliveryCharge===0?'#145530':'#0a2e1a', fontWeight:deliveryCharge===0?700:500 }}>{deliveryCharge===0?'FREE 🎉':'Rs.'+deliveryCharge}</span>
            </div>
            {deliveryCharge>0 && <div style={{ background:'#fff7ed', borderRadius:8, padding:'7px 10px', fontSize:11, color:'#f07c2a', fontWeight:600, marginBottom:8 }}>Rs.{199-total} aur add karo FREE delivery ke liye!</div>}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:18, fontWeight:800, padding:'11px 0', borderTop:'2px solid #e8f2ea', fontFamily:'Baloo 2, cursive', color:'#0a2e1a' }}>
              <span>Grand Total</span><span style={{ color:'#145530' }}>Rs.{grandTotal}</span>
            </div>
          </div>

          <button onClick={payMethod==='cod'?handleCOD:payMethod==='whatsapp'?()=>{if(validate())window.open('https://wa.me/917355691229?text='+encodeURIComponent(buildWhatsAppMsg('PENDING')),'_blank');}:handleRazorpayDirect}
            disabled={loading}
            style={{ width:'100%', background:loading?'#a8bfac':'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'14px', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'Poppins, sans-serif', marginTop:6, boxShadow:loading?'none':'0 8px 20px rgba(20,85,48,0.28)' }}>
            {loading?'⏳ Processing...' : payMethod==='cod'?'✅ Order Place Karo (COD)' : payMethod==='whatsapp'?'💬 WhatsApp pe Order Karo' : '💳 Rs.'+grandTotal+' Online Pay Karo'}
          </button>

          <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:12 }}>
            {[['🔒','Secure'],['⚡','Fast'],['🤝','Trusted']].map(([icon,label])=>(
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:15 }}>{icon}</div>
                <div style={{ fontSize:9, color:'#6b8f71', fontWeight:600, marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width:768px) {
          div[style*="grid-template-columns: 1fr 350px"] { grid-template-columns:1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns:1fr !important; }
          div[style*="grid-template-columns: repeat(3,1fr)"] { grid-template-columns:1fr !important; }
          div[style*="position: sticky"] { position:relative !important; top:0 !important; }
          div[style*="padding: 20px 20px"] { padding:14px !important; }
        }
      `}</style>
    </div>
  );
}