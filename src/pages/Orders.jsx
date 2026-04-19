import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const STEPS = ['Placed','Packed','Out for Delivery','Delivered'];
const STATUS_COLORS = { Placed:'#378ADD', Packed:'#BA7517', 'Out for Delivery':'#f07c2a', Delivered:'#145530', Cancelled:'#e24b4a' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get('http://localhost:5000/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f9f6', padding:20 }}>
      <div style={{ fontSize:80, marginBottom:20 }}>📦</div>
      <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:28, fontWeight:800, color:'#0a2e1a', marginBottom:16, textAlign:'center' }}>Pehle login karo</h2>
      <Link to="/login" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none', fontSize:15 }}>Login Karo →</Link>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f9f6' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16, animation:'spin 1s linear infinite' }}>⏳</div>
        <p style={{ color:'#6b8f71', fontSize:15 }}>Orders load ho rahe hain...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', fontFamily:"'Poppins',sans-serif" }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'36px' }}>
        <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:32, fontWeight:800, color:'#fff', marginBottom:6 }}>📦 Mere Orders</h1>
        <p style={{ color:'#86efac', fontSize:14 }}>Apne saare orders track karo yahan</p>
      </div>

      <div style={{ maxWidth:780, margin:'0 auto', padding:'32px 20px' }}>

        {orders.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', background:'#fff', borderRadius:24 }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
            <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800, color:'#0a2e1a', marginBottom:12 }}>Abhi koi order nahi hai</h2>
            <p style={{ color:'#6b8f71', marginBottom:24, fontSize:14 }}>Shopping shuru karo aur apna pehla order dalo!</p>
            <Link to="/" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none', fontSize:15 }}>Shop Now →</Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} style={{ background:'#fff', borderRadius:24, border:'1.5px solid #e8f2ea', padding:'24px', marginBottom:20, boxShadow:'0 4px 16px rgba(20,85,48,0.06)', animation:'fadeUp 0.4s ease both' }}>

              {/* Order Header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:10 }}>
                <div>
                  <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a' }}>
                    Order #{order.receiptNumber || order._id.slice(-6).toUpperCase()}
                  </div>
                  <div style={{ fontSize:12, color:'#6b8f71', marginTop:4 }}>
                    📅 {new Date(order.createdAt).toLocaleString('en-IN',{ day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </div>
                  <div style={{ fontSize:12, color:'#4a6b50', marginTop:3, fontWeight:600 }}>
                    💵 {order.paymentMethod} — {order.paymentStatus}
                  </div>
                </div>
                <span style={{ fontSize:13, fontWeight:700, padding:'6px 18px', borderRadius:50, background:STATUS_COLORS[order.status]+'20', color:STATUS_COLORS[order.status], border:`1.5px solid ${STATUS_COLORS[order.status]}40` }}>
                  {order.status}
                </span>
              </div>

              {/* Live Tracking */}
              {order.status !== 'Cancelled' && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:12, color:'#6b8f71', fontWeight:700, marginBottom:12, letterSpacing:0.5 }}>LIVE TRACKING</div>
                  <div style={{ display:'flex', alignItems:'center' }}>
                    {STEPS.map((s, i) => {
                      const currentIdx = STEPS.indexOf(order.status);
                      const active = i <= currentIdx;
                      const current = i === currentIdx;
                      return (
                        <React.Fragment key={s}>
                          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, minWidth:0 }}>
                            <div style={{ width:34, height:34, borderRadius:'50%', background:active?'#145530':'#e8f2ea', border:`2px solid ${active?'#145530':'#c8e0d0'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:active?'#fff':'#6b8f71', fontWeight:700, transition:'all 0.3s', boxShadow:current?'0 0 0 4px rgba(20,85,48,0.2)':'' }}>
                              {active ? '✓' : i+1}
                            </div>
                            <span style={{ fontSize:9, color:active?'#145530':'#6b8f71', fontWeight:active?700:500, textAlign:'center', maxWidth:65 }}>{s}</span>
                          </div>
                          {i < STEPS.length-1 && (
                            <div style={{ flex:1, height:3, background:i<currentIdx?'#145530':'#e8f2ea', margin:'0 4px 20px', borderRadius:4, transition:'background 0.4s' }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {order.address && (
                <div style={{ background:'#f5f9f6', borderRadius:14, padding:'12px 16px', marginBottom:14 }}>
                  <div style={{ fontSize:11, color:'#6b8f71', fontWeight:700, marginBottom:6, letterSpacing:0.5 }}>📍 DELIVERY ADDRESS</div>
                  <div style={{ fontSize:13, color:'#0a2e1a', fontWeight:600 }}>{order.address.name}</div>
                  <div style={{ fontSize:12, color:'#4a6b50', marginTop:3, lineHeight:1.6 }}>
                    {order.address.street}{order.address.landmark?`, ${order.address.landmark}`:''}, {order.address.city} — {order.address.pincode}
                  </div>
                  <div style={{ fontSize:12, color:'#145530', fontWeight:700, marginTop:3 }}>📞 {order.address.phone}</div>
                </div>
              )}

              {/* Items */}
              <div style={{ marginBottom:14 }}>
                {order.items?.map((item,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #f0f7f2' }}>
                    <div style={{ flex:1, fontSize:13, color:'#0a2e1a', fontWeight:500 }}>
                      {item.name} <span style={{ color:'#6b8f71' }}>× {item.qty}</span>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:14, fontWeight:800, color:'#145530' }}>₹{item.price*item.qty}</div>
                      {item.mrp && item.mrp > item.price && (
                        <div style={{ fontSize:10, color:'#9ca3af', textDecoration:'line-through' }}>₹{item.mrp*item.qty}</div>
                      )}
                    </div>
                  </div>
                ))}

                <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:18, marginTop:12, fontFamily:"'Baloo 2',cursive", color:'#0a2e1a', paddingTop:10, borderTop:'2px solid #e8f2ea' }}>
                  <span>Grand Total</span>
                  <span style={{ color:'#145530' }}>₹{order.grandTotal || order.total}</span>
                </div>
              </div>

              {/* Receipt + Help */}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center', paddingTop:12, borderTop:'1px solid #f0f7f2' }}>
                <div style={{ fontSize:12, color:'#6b8f71' }}>
                  Receipt: <span style={{ color:'#145530', fontWeight:700 }}>#{order.receiptNumber || order._id.slice(-6).toUpperCase()}</span>
                </div>
                <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                  <a href={`https://wa.me/917355691229?text=${encodeURIComponent(`Namaste Apni Dukan! Mera order #${order.receiptNumber||order._id.slice(-6).toUpperCase()} ke baare mein poochna tha.`)}`}
                    target="_blank" rel="noreferrer"
                    style={{ background:'#25D366', color:'#fff', borderRadius:50, padding:'6px 16px', textDecoration:'none', fontSize:12, fontWeight:700 }}>
                    💬 Help
                  </a>
                  {order.status === 'Placed' && (
                    <a href={`https://wa.me/917355691229?text=${encodeURIComponent(`Mera order #${order.receiptNumber||order._id.slice(-6).toUpperCase()} cancel karna hai.`)}`}
                      target="_blank" rel="noreferrer"
                      style={{ background:'#fee2e2', color:'#e24b4a', borderRadius:50, padding:'6px 16px', textDecoration:'none', fontSize:12, fontWeight:700 }}>
                      Cancel
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}