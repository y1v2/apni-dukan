import React from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const EMOJIS = { vegetables: '🥬', fruits: '🍎', dairy: '🥛', grains: '🍚', oil: '🧴', snacks: '🍪', drinks: '🧃', default: '🛒' };

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const emoji = EMOJIS[product.category] || EMOJIS.default;

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaf2ec', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ height: 110, background: '#e8f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>{emoji}</div>
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#12200f' }}>{product.name}</div>
        <div style={{ fontSize: 11, color: '#6b8f71', margin: '2px 0 8px' }}>{product.quantity}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1a6b3a' }}>₹{product.price}</span>
          <button onClick={() => { addToCart(product); toast.success('Added to cart!'); }}
            style={{ background: '#e8f5ee', color: '#1a6b3a', border: '1.5px solid #c5e0cb', borderRadius: '50%', width: 28, height: 28, fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        </div>
      </div>
    </div>
  );
}