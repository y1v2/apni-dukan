import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const STEPS = ['Placed','Packed','Out for Delivery','Delivered'];
const STATUS_COLORS = { Placed:'#378ADD', Packed:'#BA7517', 'Out for Delivery':'#f07c2a', Delivered:'#145530', Cancelled:'#e24b4a' };

function StarRating({ onRate }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === 0) { toast.error('Stars select karo'); return; }
    onRate(selected, comment);
    setSubmitted(true);
    toast.success('Rating submit ho gayi! 🙏 Admin review karega.');
  };

  if (submitted) return (
    <div style={{ background:'#e6f4ec', borderRadius:12, padding:'12px 16px', marginTop:12, fontSize:13, color:'#145530', fontWeight:600 }}>
      ✅ Aapki rating submit ho gayi! Admin review ke baad show hogi.
    </div>
  );

  return (
    <div style={{ background:'#f5f9f6', borderRadius:14, padding:'14px', marginTop:12, border:'1.5px solid #e8f2ea' }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#0a2e1a', marginBottom:10 }}>⭐ Is order ko rate karo</div>
      <div style={{ display:'flex', gap:4, marginBottom:10 }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} onClick={()=>setSelected(s)} onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
            style={{ fontSize:28, cursor:'pointer', color:s<=(hover||selected)?'#f59e0b':'#d1d5db', transition:'color 0.1s' }}>★</span>
        ))}
        {selected > 0 && <span style={{ fontSize:13, color:'#6b8f71', alignSelf:'center', marginLeft:6 }}>({selected}/5)</span>}
      </div>
      <textarea placeholder="Apna experience share karo... (optional)" value={comment} onChange={e=>setComment(e.target.value)} rows={2}
        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #d0e8d8', borderRadius:10, fontSize:13, outline:'none', fontFamily:'Poppins, sans-serif', resize:'none', marginBottom:10, boxSizing:'border-box', background:'#fff' }} />
      <button onClick={handleSubmit} style={{ background:'#145530', color:'#fff', border:'none', borderRadius:50, padding:'9px 22px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
        Submit Rating
      </button>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratedOrders, setRatedOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('apnidukan_rated_orders') || '[]'); } catch { return []; }
  });
  const { addRating } = useProducts();
  const { wallet } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get('http://localhost:5000/api/orders/my', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  const handleRate = (orderId, stars, comment) => {
    addRating({ orderId, stars, comment, customerName: user ? user.name : 'Customer', customerEmail: user ? user.email : '' });
    const updated = [...ratedOrders, orderId];
    setRatedOrders(updated);
    localStorage.setItem('apnidukan_rated_orders', JSON.stringify(updated));
  };

  if (!token) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f9f6', padding:20 }}>
      <div style={{ fontSize:72, marginBottom:16 }}>📦</div>
      <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:26, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>Pehle login karo</h2>
      <Link to="/login" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'13px 32px', fontWeight:700, textDecoration:'none', fontSize:14 }}>Login Karo →</Link>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
        <p style={{ color:'#6b8f71' }}>Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', fontFamily:'Poppins, sans-serif' }}>
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'28px 24px' }}>
        <h1 style={{ fontFamily:'Baloo 2, cursive', fontSize:28, fontWeight:800, color:'#fff', marginBottom:4 }}>📦 Mere Orders</h1>
        <p style={{ color:'#86efac', fontSize:13 }}>Apne saare orders track karo</p>
      </div>

      {wallet > 0 && (
        <div style={{ margin:'16px 20px 0', background:'linear-gradient(135deg,#145530,#1a6b3a)', borderRadius:16, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#fff' }}>💰 Aapka Wallet Balance</div>
            <div style={{ color:'#86efac', fontSize:13 }}>Yeh balance checkout mein use kar sakte ho</div>
          </div>
          <div style={{ fontFamily:'Baloo 2, cursive', fontSize:28, fontWeight:800, color:'#fff' }}>Rs.{wallet}</div>
        </div>
      )}

      <div style={{ maxWidth:750, margin:'0 auto', padding:'20px 16px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', background:'#fff', borderRadius:22 }}>
            <div style={{ fontSize:60, marginBottom:14 }}>🛒</div>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:22, fontWeight:800, color:'#0a2e1a', marginBottom:12 }}>Koi order nahi hai!</h2>
            <Link to="/" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'13px 32px', fontWeight:700, textDecoration:'none', fontSize:14 }}>Shop Now →</Link>
          </div>
        ) : orders.map(order => (
          <div key={order._id} style={{ background:'#fff', borderRadius:22, border:'1.5px solid #e8f2ea', padding:'22px', marginBottom:18, boxShadow:'0 3px 14px rgba(20,85,48,0.05)' }}>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:8 }}>
              <div>
                <div style={{ fontFamily:'Baloo 2, cursive', fontSize:17, fontWeight:800, color:'#0a2e1a' }}>
                  Order #{order.receiptNumber || order._id.slice(-6).toUpperCase()}
                </div>
                <div style={{ fontSize:11, color:'#6b8f71', marginTop:3 }}>
                  {new Date(order.createdAt).toLocaleString('en-IN',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                </div>
                <div style={{ fontSize:11, color:'#4a6b50', marginTop:2, fontWeight:600 }}>{order.paymentMethod} — {order.paymentStatus}</div>
              </div>
              <span style={{ fontSize:12, fontWeight:700, padding:'5px 16px', borderRadius:50, background:(STATUS_COLORS[order.status]||'#888')+'20', color:STATUS_COLORS[order.status]||'#888', border:'1.5px solid '+(STATUS_COLORS[order.status]||'#888')+'40' }}>
                {order.status}
              </span>
            </div>

            {/* Tracking */}
            {order.status !== 'Cancelled' && (
              <div style={{ marginBottom:18 }}>
                <div style={{ display:'flex', alignItems:'center' }}>
                  {STEPS.map((s,i) => {
                    const ci = STEPS.indexOf(order.status);
                    const active = i <= ci;
                    const current = i === ci;
                    return (
                      <React.Fragment key={s}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, minWidth:0 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:active?'#145530':'#e8f2ea', border:'2px solid '+(active?'#145530':'#c8e0d0'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:active?'#fff':'#6b8f71', fontWeight:700, boxShadow:current?'0 0 0 4px rgba(20,85,48,0.2)':'' }}>
                            {active?'✓':i+1}
                          </div>
                          <span style={{ fontSize:8, color:active?'#145530':'#6b8f71', fontWeight:active?700:500, textAlign:'center', maxWidth:60, lineHeight:1.2 }}>{s}</span>
                        </div>
                        {i<STEPS.length-1 && <div style={{ flex:1, height:3, background:i<ci?'#145530':'#e8f2ea', margin:'0 3px 18px', borderRadius:4 }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Address */}
            {order.address && (
              <div style={{ background:'#f5f9f6', borderRadius:12, padding:'11px 14px', marginBottom:12 }}>
                <div style={{ fontSize:10, color:'#6b8f71', fontWeight:700, marginBottom:4 }}>📍 DELIVERY ADDRESS</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#0a2e1a' }}>{order.address.name}</div>
                <div style={{ fontSize:11, color:'#4a6b50', marginTop:2 }}>
                  {order.address.street}{order.address.landmark?', '+order.address.landmark:''}, {order.address.city} — {order.address.pincode}
                </div>
                <div style={{ fontSize:11, color:'#145530', fontWeight:700, marginTop:2 }}>📞 {order.address.phone}</div>
              </div>
            )}

            {/* Items */}
            {order.items?.map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid #f0f7f2' }}>
                <div style={{ flex:1, fontSize:12, color:'#0a2e1a', fontWeight:500 }}>{item.name} <span style={{ color:'#6b8f71' }}>x{item.qty}</span></div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Baloo 2, cursive', fontSize:13, fontWeight:800, color:'#145530' }}>Rs.{item.price*item.qty}</div>
                </div>
              </div>
            ))}

            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:17, marginTop:10, fontFamily:'Baloo 2, cursive', color:'#0a2e1a', paddingTop:8, borderTop:'2px solid #e8f2ea' }}>
              <span>Grand Total</span><span style={{ color:'#145530' }}>Rs.{order.grandTotal||order.total}</span>
            </div>

            {/* Receipt + Help */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', paddingTop:10, marginTop:8, borderTop:'1px solid #f0f7f2' }}>
              <span style={{ fontSize:11, color:'#6b8f71' }}>Receipt: <b style={{ color:'#145530' }}>#{order.receiptNumber||order._id.slice(-6).toUpperCase()}</b></span>
              <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                <a href={'https://wa.me/917355691229?text='+encodeURIComponent('Order #'+(order.receiptNumber||order._id.slice(-6).toUpperCase())+' ke baare mein poochna tha.')}
                  target="_blank" rel="noreferrer"
                  style={{ background:'#25D366', color:'#fff', borderRadius:50, padding:'5px 14px', textDecoration:'none', fontSize:11, fontWeight:700 }}>💬 Help</a>
              </div>
            </div>

            {/* Rating (only for delivered orders) */}
            {order.status === 'Delivered' && !ratedOrders.includes(order._id) && (
              <StarRating onRate={(stars, comment) => handleRate(order._id, stars, comment)} />
            )}
            {order.status === 'Delivered' && ratedOrders.includes(order._id) && (
              <div style={{ background:'#e6f4ec', borderRadius:10, padding:'10px 14px', marginTop:10, fontSize:12, color:'#145530', fontWeight:600 }}>
                ✅ Aapne is order ko rate kar diya hai. Shukriya! 🙏
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}