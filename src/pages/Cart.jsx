import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, total, savings } = useCart();
  const navigate = useNavigate();
  const deliveryCharge = total >= 199 ? 0 : 30;
  const grandTotal = total + deliveryCharge;

  if (cartItems.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f9f6', padding: 20, fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 10, textAlign: 'center' }}>Aapka cart khali hai!</h2>
      <p style={{ color: '#6b8f71', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>Kuch fresh items add karo aur order karo</p>
      <Link to="/" style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '14px 32px', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
        Shopping Shuru Karo →
      </Link>
    </div>
  );

  return (
    <div style={{ background: '#f5f9f6', minHeight: '80vh', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a2e1a, #145530)', padding: '24px 24px' }}>
        <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>🛒 Aapka Cart</h1>
        <p style={{ color: '#86efac', fontSize: 13 }}>{cartItems.length} items selected</p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

          {/* Items */}
          <div>
            {cartItems.map(item => (
              <div key={item._id} style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8f2ea', padding: '14px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                {item.img && <img src={item.img} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />}
                {!item.img && <div style={{ width: 64, height: 64, background: '#e6f4ec', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🛒</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0a2e1a', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: '#6b8f71', marginBottom: 6 }}>{item.quantity}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#145530' }}>Rs.{item.price}</span>
                    {item.mrp && item.mrp > item.price && <span style={{ fontSize: 11, color: '#9ca3af', textDecoration: 'line-through' }}>Rs.{item.mrp}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => updateQty(item._id, item.qty - 1)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e0ede3', background: '#f5f9f6', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                  <span style={{ fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: 'center', color: '#0a2e1a' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e0ede3', background: '#f5f9f6', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, color: '#145530', fontSize: 16 }}>Rs.{item.price * item.qty}</div>
                  {item.mrp && item.mrp > item.price && <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>Rs.{(item.mrp - item.price) * item.qty} bachat</div>}
                </div>
                <button onClick={() => removeFromCart(item._id)} style={{ color: '#e24b4a', background: '#fee2e2', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8f2ea', padding: '20px', height: 'fit-content', position: 'sticky', top: 80 }}>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 16 }}>Order Summary</h3>

            {savings > 0 && (
              <div style={{ background: '#e6f4ec', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: '#145530', fontWeight: 700, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span>🎉 Total Bachat</span><span>Rs.{savings}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b8f71', marginBottom: 8, padding: '4px 0' }}>
              <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span><span>Rs.{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, padding: '4px 0' }}>
              <span style={{ color: '#6b8f71' }}>Delivery</span>
              <span style={{ color: deliveryCharge === 0 ? '#145530' : '#0a2e1a', fontWeight: deliveryCharge === 0 ? 700 : 500 }}>
                {deliveryCharge === 0 ? 'FREE 🎉' : 'Rs.' + deliveryCharge}
              </span>
            </div>
            {deliveryCharge > 0 && (
              <div style={{ background: '#fff7ed', borderRadius: 8, padding: '7px 10px', fontSize: 11, color: '#f07c2a', fontWeight: 600, marginBottom: 8 }}>
                💡 Rs.{199 - total} aur add karo FREE delivery ke liye!
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, padding: '12px 0', borderTop: '2px solid #e8f2ea', fontFamily: 'Baloo 2, cursive', color: '#0a2e1a' }}>
              <span>Grand Total</span><span style={{ color: '#145530' }}>Rs.{grandTotal}</span>
            </div>

            <button onClick={() => navigate('/checkout')}
              style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px', fontWeight: 700, textDecoration: 'none', fontSize: 15, marginTop: 8, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', boxShadow: '0 8px 20px rgba(20,85,48,0.25)' }}>
              Checkout karo →
            </button>
            <Link to="/" style={{ display: 'block', textAlign: 'center', color: '#145530', fontSize: 13, marginTop: 12, fontWeight: 600, textDecoration: 'none' }}>
              ← Shopping jaari rakho
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 300px"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: relative !important; top: 0 !important; }
          div[style*="padding: 14px 16px"] { flex-wrap: wrap !important; }
        }
        @media (max-width: 480px) {
          h1[style*="font-size: 28px"] { font-size: 22px !important; }
        }
      `}</style>
    </div>
  );
}