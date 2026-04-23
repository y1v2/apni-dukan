import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { products } = useProducts();

  const product = products.find(p => p._id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>🔍</div>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, color: '#0a2e1a', marginBottom: 16 }}>Product nahi mila!</h2>
        <button onClick={() => navigate('/products')} style={{ background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          ← Shop par Wapas Jao
        </button>
      </div>
    </div>
  );

  const images = product.images && product.images.length > 0 ? product.images : [product.img];
  const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 6);
  const cartItem = cartItems.find(i => i._id === product._id);
  const disc = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const inStock = product.stock > 0;

  const handleAdd = () => {
    if (!inStock) { toast.error('Out of Stock!'); return; }
    for (let i = 0; i < qty; i++) { addToCart(product); }
    toast.success(product.name + ' x' + qty + ' added to cart! 🛒');
  };

  return (
    <div style={{ background: '#f5f9f6', minHeight: '80vh', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#145530', fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Wapas Jao
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: '#fff', borderRadius: 24, padding: 24, marginBottom: 24, border: '1.5px solid #e8f2ea' }}>

          {/* Images */}
          <div>
            {/* Main image with zoom */}
            <div
              style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: zoomed ? 'zoom-out' : 'zoom-in', marginBottom: 12, height: 300, background: '#f5f9f6' }}
              onClick={() => setZoomed(!zoomed)}
            >
              <img src={images[activeImg]} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: zoomed ? 'scale(1.8)' : 'scale(1)' }} />
              {disc >= 10 && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#e24b4a', color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 50 }}>{disc}% OFF</div>
              )}
              <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 50 }}>
                {zoomed ? '🔍 Click to Zoom Out' : '🔍 Click to Zoom In'}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: '2px solid ' + (activeImg === i ? '#145530' : '#e8f2ea'), cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <img src={img} alt={'img-' + i} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ background: '#145530', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 50, width: 'fit-content' }}>{product.badge}</span>
            <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 2 }}>{product.name}</h1>
            {product.nameHindi && <p style={{ fontSize: 14, color: '#6b8f71', fontWeight: 500 }}>{product.nameHindi}</p>}
            <p style={{ fontSize: 13, color: '#4a6b50', lineHeight: 1.7 }}>{product.description || 'Fresh quality product from Apni Dukan.'}</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 32, fontWeight: 800, color: '#145530' }}>Rs.{product.price}</span>
              {product.mrp > product.price && <span style={{ fontSize: 16, color: '#9ca3af', textDecoration: 'line-through' }}>Rs.{product.mrp}</span>}
              {disc > 0 && <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>Rs.{product.mrp - product.price} bachat!</span>}
            </div>

            <div style={{ fontSize: 13, color: '#4a6b50' }}>
              Quantity: <strong>{product.quantity}</strong>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: inStock ? '#145530' : '#e24b4a', background: inStock ? '#e6f4ec' : '#fee2e2', padding: '6px 16px', borderRadius: 50, width: 'fit-content' }}>
              {inStock ? '✅ In Stock (' + product.stock + ' left)' : '❌ Out of Stock'}
            </div>

            {inStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 13, color: '#6b8f71', fontWeight: 600 }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f5f9f6', borderRadius: 50, padding: '6px 16px', border: '1.5px solid #d0e8d8' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 800, color: '#145530', width: 24 }}>-</button>
                  <span style={{ fontWeight: 800, fontSize: 16, minWidth: 20, textAlign: 'center', color: '#0a2e1a' }}>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 800, color: '#145530', width: 24 }}>+</button>
                </div>
              </div>
            )}

            <button onClick={handleAdd} disabled={!inStock}
              style={{ background: inStock ? 'linear-gradient(135deg, #145530, #1a6b3a)' : '#d1d5db', color: '#fff', border: 'none', borderRadius: 50, padding: '15px', fontSize: 15, fontWeight: 700, cursor: inStock ? 'pointer' : 'not-allowed', fontFamily: 'Poppins, sans-serif', boxShadow: inStock ? '0 8px 20px rgba(20,85,48,0.28)' : 'none', marginTop: 8 }}>
              {inStock ? (cartItem ? '+ Add More (' + cartItem.qty + ' in cart)' : 'Add to Cart 🛒') : 'Out of Stock'}
            </button>

            {cartItem && (
              <button onClick={() => navigate('/cart')} style={{ background: '#e6f4ec', color: '#145530', border: '2px solid #b8dfc6', borderRadius: 50, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                View Cart ({cartItem.qty} items) →
              </button>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1.5px solid #e8f2ea' }}>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 16 }}>
              Related Products 👆
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
              {related.map(p => {
                const d = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
                return (
                  <div key={p._id} onClick={() => navigate('/product/' + p._id)}
                    style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1.5px solid #e8f2ea', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(20,85,48,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                    <div style={{ height: 90, overflow: 'hidden', position: 'relative' }}>
                      <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {d >= 10 && <span style={{ position: 'absolute', top: 5, right: 5, background: '#e24b4a', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 50 }}>{d}%</span>}
                    </div>
                    <div style={{ padding: '8px 8px 10px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0a2e1a', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 13, fontWeight: 800, color: '#145530' }}>Rs.{p.price}</span>
                        <button onClick={e => { e.stopPropagation(); if (p.stock <= 0) { toast.error('Out of Stock!'); return; } addToCart(p); toast.success(p.name + ' added!'); }}
                          style={{ background: p.stock > 0 ? '#e6f4ec' : '#f5f5f5', color: p.stock > 0 ? '#145530' : '#9ca3af', border: '1.5px solid ' + (p.stock > 0 ? '#b8dfc6' : '#ddd'), borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: p.stock > 0 ? 'pointer' : 'not-allowed', fontWeight: 800 }}>+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width:768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns:1fr !important; }
          div[style*="grid-template-columns: repeat(6, 1fr)"] { grid-template-columns:repeat(3,1fr) !important; }
        }
      `}</style>
    </div>
  );
}