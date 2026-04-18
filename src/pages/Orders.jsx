import React, { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_COLORS = { Placed: '#378ADD', Packed: '#BA7517', 'Out for Delivery': '#f07c2a', Delivered: '#1a6b3a' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    axios.get('http://localhost:5000/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data)).catch(() => {});
  }, [token]);

  if (!token) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 60 }}>📦</div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, marginTop: 16 }}>Please login to view orders</h2>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>My Orders</h1>
      {orders.length === 0 ? <p style={{ color: '#6b8f71' }}>No orders yet. Start shopping!</p> : orders.map(order => (
        <div key={order._id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaf2ec', padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#6b8f71' }}>Order #{order._id.slice(-6).toUpperCase()}</span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 50, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>{order.status}</span>
          </div>
          {/* Live tracking bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
            {['Placed','Packed','Out for Delivery','Delivered'].map((s, i, arr) => {
              const steps = ['Placed','Packed','Out for Delivery','Delivered'];
              const currentIdx = steps.indexOf(order.status);
              const active = i <= currentIdx;
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: active ? '#1a6b3a' : '#e8f5ee', border: `2px solid ${active ? '#1a6b3a' : '#c5e0cb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: active ? '#fff' : '#6b8f71' }}>✓</div>
                    <span style={{ fontSize: 9, color: active ? '#1a6b3a' : '#6b8f71', fontWeight: active ? 600 : 400, textAlign: 'center', maxWidth: 55 }}>{s}</span>
                  </div>
                  {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: i < currentIdx ? '#1a6b3a' : '#e0ede3', marginBottom: 16 }} />}
                </React.Fragment>
              );
            })}
          </div>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', borderTop: '0.5px solid #eaf2ec' }}>
              <span>{item.name} x{item.qty}</span>
              <span style={{ color: '#1a6b3a', fontWeight: 600 }}>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 700, fontSize: 15 }}>
            <span>Total</span><span style={{ color: '#1a6b3a' }}>₹{order.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}