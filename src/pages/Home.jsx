import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import toast from 'react-hot-toast';

const MARQUEE = ['🛒 Free delivery above Rs.199','🥬 Fresh vegetables every morning','⚡ 30-minute delivery in Kalpi','💳 UPI, Cards & Cash on Delivery','🌿 100% Fresh & Natural','📦 Easy returns & refunds','🎉 Use code APNI50 for Rs.50 off'];

const CATS = [
  {id:'vegetables',label:'Sabzi',img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&h=80&fit=crop'},
  {id:'fruits',label:'Fruits',img:'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=80&h=80&fit=crop'},
  {id:'dairy',label:'Dairy',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop'},
  {id:'grains',label:'Dal-Rice',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=80&h=80&fit=crop'},
  {id:'oil',label:'Masala',img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80&h=80&fit=crop'},
  {id:'snacks',label:'Snacks',img:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&h=80&fit=crop'},
  {id:'drinks',label:'Drinks',img:'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=80&h=80&fit=crop'},
  {id:'household',label:'Home',img:'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=80&h=80&fit=crop'},
  {id:'',label:'All',img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop'},
];

function Card3D({ product, onAdd, onClick }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [added, setAdded] = useState(false);
  const ref = useRef(null);
  const inStock = product.stock > 0;

  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setTilt({ x: (clientY - cy) / 8, y: (cx - clientX) / 8 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  const handleClick = () => {
    if (!inStock) { toast.error('Out of Stock!'); return; }
    setAdded(true);
    onAdd(product);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div ref={ref}
      onMouseMove={handleMove} onMouseLeave={handleLeave}
      onTouchMove={handleMove} onTouchEnd={handleLeave}
      style={{ perspective: 800, cursor: inStock ? 'pointer' : 'not-allowed' }}>
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${added ? 'scale(1.08)' : 'scale(1)'}`,
          transition: 'transform 0.15s ease',
          background: added ? 'linear-gradient(135deg, #145530, #1a6b3a)' : inStock ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,252,245,0.9))' : 'linear-gradient(145deg, #f5f5f5, #efefef)',
          borderRadius: 18,
          padding: '12px 8px 10px',
          textAlign: 'center',
          boxShadow: added ? '0 12px 30px rgba(20,85,48,0.5)' : '0 8px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
          border: added ? '2px solid #86efac' : inStock ? '1.5px solid rgba(255,255,255,0.7)' : '1.5px solid #ddd',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
          animationName: 'float3d',
          animationDuration: '3s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDelay: '0s',
          opacity: inStock ? 1 : 0.7,
        }}
        onClick={handleClick}
      >
        {/* Shine effect */}
        <div style={{ position: 'absolute', top: -20, left: -20, width: 60, height: 60, background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)', pointerEvents: 'none', transition: 'transform 0.2s', transform: `translate(${tilt.y * 2}px, ${tilt.x * 2}px)` }} />

        {!inStock && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '3px', textAlign: 'center' }}>OUT OF STOCK</div>}

        {added && <div style={{ position: 'absolute', top: -8, right: -6, background: '#22c55e', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, zIndex: 10, boxShadow: '0 4px 10px rgba(34,197,94,0.5)' }}>✓</div>}

        <div onClick={(e) => { e.stopPropagation(); onClick(product); }} style={{ position: 'relative', zIndex: 2 }}>
          <img src={product.img} alt={product.name} draggable={false}
            style={{ width: 58, height: 58, objectFit: 'cover', borderRadius: 12, marginBottom: 6, pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
          <div style={{ fontSize: 9, color: added ? '#86efac' : inStock ? '#145530' : '#9ca3af', fontWeight: 700, pointerEvents: 'none', lineHeight: 1.2, marginBottom: 2 }}>{product.name}</div>
          <div style={{ fontSize: 11, color: added ? '#fff' : '#f07c2a', fontWeight: 800, fontFamily: 'Baloo 2, cursive', pointerEvents: 'none' }}>
            {inStock ? 'Rs.' + product.price : 'N/A'}
          </div>
          {product.mrp > product.price && inStock && (
            <div style={{ fontSize: 8, color: added ? 'rgba(255,255,255,0.7)' : '#9ca3af', textDecoration: 'line-through', pointerEvents: 'none' }}>Rs.{product.mrp}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const { products, approvedRatings } = useProducts();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const searchRef = useRef(null);

  const heroItems = products.slice(0, 10);
  const featured = products.filter(p => p.stock > 0).slice(0, 6);
  const happyCount = approvedRatings.length;
  const avgRating = approvedRatings.length > 0 ? (approvedRatings.reduce((s, r) => s + r.stars, 0) / approvedRatings.length).toFixed(1) : '5.0';
  const topComments = approvedRatings.slice(-3).reverse();

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleSearch = () => {
    if (searchVal.trim()) { setSearchOpen(false); navigate('/products?search=' + encodeURIComponent(searchVal.trim())); }
  };

  const handleCardAdd = (product) => {
    const result = addToCart(product);
    if (result && !result.success) { toast.error(result.message); return; }
    toast.success(product.name + ' added! 🛒');
    setTimeout(() => navigate('/products'), 500);
  };

  const handleCardClick = (product) => {
    navigate('/product/' + product._id);
  };

  const handleAddFeatured = (e, p) => {
    e.stopPropagation();
    if (p.stock <= 0) { toast.error('Out of Stock!'); return; }
    const result = addToCart(p);
    if (result && !result.success) { toast.error(result.message); return; }
    toast.success(p.name + ' added! 🛒');
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Search Modal */}
      {searchOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,46,26,0.88)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 70 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 26, width: '90%', maxWidth: 540, boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f5f9f6', borderRadius: 50, padding: '11px 18px', border: '2px solid #c8e6d4', marginBottom: 18 }}>
              <span style={{ fontSize: 18 }}>🔍</span>
              <input ref={searchRef} value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search karo - atta, dal, sabzi... ya हिंदी में"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Poppins, sans-serif', background: 'transparent', color: '#0a2e1a' }} />
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#6b8f71' }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: '#6b8f71', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>POPULAR</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {['Tomato','Dal','Rice','Milk','Onion','Oil','Atta','Eggs','Sugar','Paneer'].map(s => (
                  <button key={s} onClick={() => { navigate('/products?search=' + s); setSearchOpen(false); }}
                    style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '5px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSearch} style={{ width: '100%', background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Search →
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ background: '#0a2e1a', color: '#86efac', textAlign: 'center', padding: '8px 16px', fontSize: 12, fontWeight: 500 }}>
        🎉 Free delivery above Rs.199 · Kalpi &amp; nearby areas · Cash on Delivery available
      </div>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a2e1a 0%, #145530 55%, #1a6b3a 100%)', padding: '40px 24px 32px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: '50%', top: -100, right: -80, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>

          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.12)', color: '#86efac', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 50, marginBottom: 18, border: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              Now delivering in Kalpi
            </div>
            <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 42, fontWeight: 800, lineHeight: 1.1, color: '#fff', marginBottom: 10, letterSpacing: '-1px' }}>
              Fresh Grocery<br />Delivered to<br /><span style={{ color: '#86efac' }}>Your Doorstep</span>
            </h1>
            <p style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, color: '#86efac', fontWeight: 600, marginBottom: 10, fontStyle: 'italic' }}>
              "Agar chahiye ho fresh samaan, to best option hai Apni Dukan!"
            </p>
            <p style={{ fontSize: 13, color: '#bbf7d0', lineHeight: 1.7, maxWidth: 340, marginBottom: 24 }}>
              Apne shehar ki apni online grocery store.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/products')} style={{ background: '#f07c2a', color: '#fff', border: 'none', borderRadius: 50, padding: '13px 28px', fontSize: 14, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', fontWeight: 700, boxShadow: '0 8px 20px rgba(240,124,42,0.4)' }}>
                Shop Now →
              </button>
              <button onClick={() => setSearchOpen(true)} style={{ background: 'rgba(255,255,255,0.13)', color: '#fff', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 50, padding: '13px 28px', fontSize: 14, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', fontWeight: 600 }}>
                🔍 Search
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 28, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap' }}>
              {[['50+','Products'],['30min','Delivery'],[happyCount > 0 ? happyCount+'+' : '100+','Happy Customers'],[avgRating+'★','Avg Rating']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#fff' }}>{n}</div>
                  <div style={{ fontSize: 10, color: '#86efac', fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D Floating Cards */}
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1, marginBottom: 12, textAlign: 'center' }}>
              👆 TAP TO ADD · CLICK IMAGE TO VIEW
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {heroItems.map((item, i) => (
                <div key={item._id} style={{ animationName: 'float3d', animationDuration: (3 + i * 0.3) + 's', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: (i * 0.15) + 's' }}>
                  <Card3D product={item} onAdd={handleCardAdd} onClick={handleCardClick} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{ background: '#f07c2a', padding: '10px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: 'max-content', animationName: 'marquee', animationDuration: '22s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}>
          {[...MARQUEE,...MARQUEE].map((item,i) => (
            <span key={i} style={{ color: '#fff', fontSize: 13, fontWeight: 600, padding: '0 30px', whiteSpace: 'nowrap' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '24px 24px 12px', background: '#fff' }}>
        <div onClick={() => setSearchOpen(true)} style={{ display: 'flex', alignItems: 'center', background: '#f5f9f6', border: '2px solid #c8e6d4', borderRadius: 50, padding: '12px 20px', gap: 12, cursor: 'pointer', maxWidth: 700, margin: '0 auto' }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <span style={{ flex: 1, fontSize: 14, color: '#9ab8a0' }}>Search karo - atta, dal, sabzi, fruits... ya हिंदी में</span>
          <span style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '7px 18px', fontSize: 13, fontWeight: 700 }}>Search</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '16px 24px 8px', background: '#fff' }}>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0a2e1a', marginBottom: 16 }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 10 }}>
          {CATS.map(cat => (
            <div key={cat.id} onClick={() => navigate('/products' + (cat.id ? '?category=' + cat.id : ''))} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e8f2ea', boxShadow: '0 4px 12px rgba(20,85,48,0.1)', transition: 'all 0.2s' }}>
                <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#0a2e1a', textAlign: 'center' }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ padding: '20px 24px 40px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0a2e1a' }}>Today's Top Picks 🔥</h2>
          <button onClick={() => navigate('/products')} style={{ background: '#e6f4ec', color: '#145530', border: '2px solid #b8dfc6', borderRadius: 50, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View All 50+ →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          {featured.map(p => {
            const disc = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
            return (
              <div key={p._id} onClick={() => navigate('/product/' + p._id)}
                style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #e8f2ea', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 28px rgba(20,85,48,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <span style={{ position: 'absolute', top: 7, left: 7, background: '#145530', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>{p.badge}</span>
                  {disc >= 10 && <span style={{ position: 'absolute', top: 7, right: 7, background: '#e24b4a', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 50 }}>{disc}% OFF</span>}
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2e1a', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: '#6b8f71', marginBottom: 7 }}>{p.quantity}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#145530' }}>Rs.{p.price}</span>
                        {p.mrp > p.price && <span style={{ fontSize: 10, color: '#9ca3af', textDecoration: 'line-through' }}>Rs.{p.mrp}</span>}
                      </div>
                    </div>
                    <button onClick={e => handleAddFeatured(e, p)}
                      style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', fontWeight: 800 }}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ background: '#f5f9f6', padding: '36px 24px' }}>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0a2e1a', marginBottom: 20, textAlign: 'center' }}>Why Choose Apni Dukan? 💚</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, maxWidth: 900, margin: '0 auto' }}>
          {[['🌿','Always Fresh','Roz subah fresh products'],['⚡','Super Fast','30-60 min delivery'],['💰','Best Prices','No hidden charges'],['🤝','Local Love','Apne shehar ki dukaan']].map(([icon,title,desc]) => (
            <div key={title} style={{ background: '#fff', borderRadius: 16, padding: '22px 16px', textAlign: 'center', border: '1.5px solid #e8f2ea' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#0a2e1a', marginBottom: 5 }}>{title}</div>
              <div style={{ fontSize: 11, color: '#6b8f71', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Happy Customers */}
      {approvedRatings.length > 0 && (
        <div style={{ background: '#fff', padding: '36px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>
              😊 {happyCount}+ Happy Customers
            </div>
            <div style={{ fontSize: 14, color: '#6b8f71' }}>
              {'⭐'.repeat(Math.round(Number(avgRating)))} {avgRating}/5 average rating
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 900, margin: '0 auto' }}>
            {(topComments.length > 0 ? topComments : [{stars:5,comment:'Bahut fresh items mile! Delivery bhi fast thi.',customerName:'Rahul K.',orderId:'demo'},{stars:5,comment:'Apni Dukan se order karna bahut aasaan hai. Prices bhi ache hain.',customerName:'Priya S.',orderId:'demo2'},{stars:4,comment:'Kal ke order mein sab kuch fresh tha. Recommend karunga!',customerName:'Amit V.',orderId:'demo3'}]).map((r, i) => (
              <div key={i} style={{ background: '#f5f9f6', borderRadius: 16, padding: '18px', border: '1.5px solid #e8f2ea' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 14, color: s <= r.stars ? '#f59e0b' : '#d1d5db' }}>★</span>)}
                </div>
                <p style={{ fontSize: 13, color: '#0a2e1a', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic' }}>"{r.comment}"</p>
                <div style={{ fontSize: 11, color: '#6b8f71', fontWeight: 700 }}>— {r.customerName || 'Customer'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offer Banner */}
      <div style={{ margin: '0 24px 36px', background: 'linear-gradient(135deg, #0a2e1a, #145530)', borderRadius: 22, padding: '32px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 7 }}>Get Rs.50 off on your first order! 🎉</h2>
          <p style={{ color: '#86efac', fontSize: 13 }}>Use code <strong style={{ color: '#f07c2a', fontSize: 15 }}>APNI50</strong> at checkout. Min order Rs.199.</p>
        </div>
        <button onClick={() => navigate('/products')} style={{ background: '#f07c2a', color: '#fff', border: 'none', borderRadius: 50, padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0, position: 'relative', zIndex: 1 }}>
          Claim Offer →
        </button>
      </div>

      {/* Location */}
      <div style={{ background: '#fff', borderTop: '2px solid #e0ede5', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ width: 44, height: 44, background: '#145530', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📍</div>
        <div>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#0a2e1a' }}>Our Warehouse / Office</div>
          <div style={{ fontSize: 12, color: '#4a6b50', marginTop: 2 }}>135, Raj Ghat, Kalpi, Jalaun — 285204, UP</div>
        </div>
        <a href="https://wa.me/917355691229" target="_blank" rel="noreferrer"
          style={{ marginLeft: 'auto', background: '#25D366', color: '#fff', borderRadius: 50, padding: '9px 20px', textDecoration: 'none', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          💬 WhatsApp
        </a>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');
        @keyframes float3d { 0%,100%{transform:translateY(0) rotateX(0)} 50%{transform:translateY(-8px) rotateX(3deg)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }
        @media (max-width:768px) {
          section > div[style] { grid-template-columns:1fr !important; }
          div[style*="repeat(9, 1fr)"] { grid-template-columns:repeat(5,1fr) !important; }
          div[style*="repeat(6, 1fr)"] { grid-template-columns:repeat(2,1fr) !important; }
          div[style*="repeat(4, 1fr)"] { grid-template-columns:repeat(2,1fr) !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns:1fr !important; }
          div[style*="repeat(5, 1fr)"] { grid-template-columns:repeat(4,1fr) !important; gap:6px !important; }
          h1[style] { font-size:30px !important; }
          div[style*="padding: 40px 24px"] { padding:20px 16px !important; }
          div[style*="margin: 0 24px"] { margin:0 16px 24px !important; }
        }
      `}</style>
    </div>
  );
}