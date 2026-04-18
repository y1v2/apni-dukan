import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, total } = useCart();
  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 60 }}>🛒</div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, marginTop: 16 }}>Your cart is empty</h2>
      <Link to="/" style={{ display: 'inline-block', marginTop: 20, background: '#1a6b3a', color: '#fff', borderRadius: 50, padding: '12px 28px', textDecoration: 'none' }}>Start Shopping</Link>
    </div>
  );
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Your Cart</h1>
      {cartItems.map(item => (
        <div key={item._id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaf2ec', padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 36 }}>🛒</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 15 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: '#6b8f71' }}>{item.quantity}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => updateQty(item._id, item.qty - 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e0ede3', background: '#fff', cursor: 'pointer', fontSize: 16 }}>-</button>
            <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
            <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e0ede3', background: '#fff', cursor: 'pointer', fontSize: 16 }}>+</button>
          </div>
          <div style={{ fontWeight: 700, color: '#1a6b3a', minWidth: 60, textAlign: 'right' }}>₹{item.price * item.qty}</div>
          <button onClick={() => removeFromCart(item._id)} style={{ color: '#e24b4a', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
      ))}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaf2ec', padding: '20px', marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
          <span>Total</span><span style={{ color: '#1a6b3a' }}>₹{total}</span>
        </div>
        <Link to="/checkout" style={{ display: 'block', textAlign: 'center', marginTop: 16, background: '#1a6b3a', color: '#fff', borderRadius: 50, padding: '14px', fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>Proceed to Checkout</Link>
      </div>
    </div>
  );
}