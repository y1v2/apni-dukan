import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const STEPS = ['Placed','Packed','Out for Delivery','Delivered'];
const COLORS = { Placed:'#378ADD', Packed:'#BA7517', 'Out for Delivery':'#f07c2a', Delivered:'#145530' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    axios.get('http://localhost:5000/api/orders/my', { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => setOrders(r.data)).catch(()=>{});
  }, [token]);

  if (!token) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f9f6' }}>
      <div style={{ fontSize:80, marginBottom:20 }}>📦</div>
      <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:28, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>Please login to view orders</h2>
      <Link to="/login" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none', fontSize:15 }}>Login Now →</Link>
    </div>
  );

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', padding:'36px' }}>
      <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:32, fontWeight:800, color:'#0a2e1a', marginBottom:28 }}>📦 My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0' }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
          <p style={{ color:'#6b8f71', fontSize:16, marginBottom:24 }}>No orders yet. Start shopping!</p>
          <Link to="/" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none' }}>Shop Now →</Link>
        </div>
      ) : orders.map(order => (
        <div key={order._id} style={{ background:'#fff', borderRadius:24, border:'1.5px solid #e8f2ea', padding:'24px 28px', marginBottom:20, boxShadow:'0 4px 16px rgba(20,85,48,0.06)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a' }}>Order #{order._id.slice(-6).toUpperCase()}</div>
              <div style={{ fontSize:12, color:'#6b8f71', marginTop:3 }}>{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
            </div>
            <span style={{ fontSize:13, fontWeight:700, padding:'6px 18px', borderRadius:50, background:COLORS[order.status]+'20', color:COLORS[order.status], border:`1.5px solid ${COLORS[order.status]}40` }}>{order.status}</span>
          </div>
          {/* Tracking */}
          <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:24 }}>
            {STEPS.map((s,i) => {
              const currentIdx = STEPS.indexOf(order.status);
              const active = i <= currentIdx;
              return (
                <React.Fragment key={s}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:active?'#145530':'#e8f2ea', border:`2px solid ${active?'#145530':'#c8e0d0'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:active?'#fff':'#6b8f71', fontWeight:700, transition:'all 0.3s' }}>{active?'✓':i+1}</div>
                    <span style={{ fontSize:10, color:active?'#145530':'#6b8f71', fontWeight:active?700:500, textAlign:'center', maxWidth:70 }}>{s}</span>
                  </div>
                  {i < STEPS.length-1 && <div style={{ flex:1, height:3, background:i<currentIdx?'#145530':'#e8f2ea', margin:'0 4px 20px', borderRadius:4, transition:'background 0.3s' }} />}
                </React.Fragment>
              );
            })}
          </div>
          {order.items.map((item,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:14, padding:'8px 0', borderTop:'1px solid #f0f7f2', color:'#4a6b50' }}>
              <span style={{ fontWeight:500 }}>{item.name} <span style={{ color:'#6b8f71' }}>x{item.qty}</span></span>
              <span style={{ fontWeight:700, color:'#145530' }}>₹{item.price*item.qty}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, padding:'14px 0', borderTop:'2px solid #e8f2ea', fontFamily:"'Baloo 2',cursive", fontSize:20, fontWeight:800, color:'#0a2e1a' }}>
            <span>Total</span><span style={{ color:'#145530' }}>₹{order.total}</span>
          </div>
        </div>
      ))}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}