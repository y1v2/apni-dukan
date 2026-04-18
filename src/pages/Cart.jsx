import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, total } = useCart();

  if (cartItems.length === 0) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f9f6', padding:20 }}>
      <div style={{ fontSize:80, marginBottom:20 }}>🛒</div>
      <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:30, fontWeight:800, color:'#0a2e1a', marginBottom:10 }}>Your cart is empty!</h2>
      <p style={{ color:'#6b8f71', fontSize:15, marginBottom:28 }}>Add some fresh items to get started</p>
      <Link to="/" style={{ background:'#145530', color:'#fff', borderRadius:50, padding:'14px 36px', fontWeight:700, textDecoration:'none', fontSize:15 }}>Start Shopping →</Link>
    </div>
  );

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', padding:'36px' }}>
      <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:32, fontWeight:800, color:'#0a2e1a', marginBottom:28 }}>🛒 Your Cart</h1>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24 }}>
        <div>
          {cartItems.map(item => (
            <div key={item._id} style={{ background:'#fff', borderRadius:20, border:'1.5px solid #e8f2ea', padding:'18px 22px', marginBottom:14, display:'flex', alignItems:'center', gap:16 }}>
              <img src={item.img} alt={item.name} style={{ width:70, height:70, objectFit:'cover', borderRadius:14 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:15, color:'#0a2e1a', fontFamily:"'Poppins',sans-serif" }}>{item.name}</div>
                <div style={{ fontSize:12, color:'#6b8f71', marginTop:3, fontWeight:500 }}>{item.quantity}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button onClick={() => updateQty(item._id, item.qty-1)} style={{ width:32, height:32, borderRadius:'50%', border:'2px solid #e0ede3', background:'#f5f9f6', cursor:'pointer', fontSize:18, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>-</button>
                <span style={{ fontWeight:800, fontSize:16, minWidth:24, textAlign:'center', color:'#0a2e1a' }}>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty+1)} style={{ width:32, height:32, borderRadius:'50%', border:'2px solid #e0ede3', background:'#f5f9f6', cursor:'pointer', fontSize:18, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
              </div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, color:'#145530', fontSize:18, minWidth:70, textAlign:'right' }}>₹{item.price * item.qty}</div>
              <button onClick={() => removeFromCart(item._id)} style={{ color:'#e24b4a', background:'#fee2e2', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #e8f2ea', padding:24, height:'fit-content', position:'sticky', top:80 }}>
          <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:22, fontWeight:800, color:'#0a2e1a', marginBottom:20 }}>Order Summary</h3>
          {cartItems.map(i => (
            <div key={i._id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'6px 0', borderBottom:'1px solid #f0f7f2', color:'#4a6b50' }}>
              <span>{i.name} x{i.qty}</span><span style={{ fontWeight:700, color:'#145530' }}>₹{i.price*i.qty}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, padding:'12px 0', color:'#6b8f71' }}>
            <span>Delivery</span><span style={{ color:'#145530', fontWeight:700 }}>{total >= 199 ? 'FREE 🎉' : '₹30'}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:20, fontWeight:800, padding:'12px 0', borderTop:'2px solid #e8f2ea', fontFamily:"'Baloo 2',cursive", color:'#0a2e1a' }}>
            <span>Total</span><span style={{ color:'#145530' }}>₹{total >= 199 ? total : total + 30}</span>
          </div>
          {total < 199 && <p style={{ fontSize:12, color:'#f07c2a', fontWeight:600, marginBottom:12 }}>Add ₹{199-total} more for free delivery!</p>}
          <Link to="/checkout" style={{ display:'block', textAlign:'center', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', borderRadius:50, padding:'15px', fontWeight:700, textDecoration:'none', fontSize:15, marginTop:8, boxShadow:'0 8px 24px rgba(20,85,48,0.3)' }}>Proceed to Checkout →</Link>
          <Link to="/" style={{ display:'block', textAlign:'center', color:'#145530', fontSize:13, marginTop:14, fontWeight:600, textDecoration:'none' }}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}