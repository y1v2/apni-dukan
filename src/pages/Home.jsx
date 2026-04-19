import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const FEATURED = [
  {_id:'1',name:'Fresh Tomato',quantity:'1 kg',price:35,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop'},
  {_id:'2',name:'Basmati Rice',quantity:'1 kg',price:85,category:'grains',badge:'Premium',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=400&h=300&fit=crop'},
  {_id:'3',name:'Full Cream Milk',quantity:'500 ml',price:29,category:'dairy',badge:'Daily',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop'},
  {_id:'4',name:'Sunflower Oil',quantity:'1 litre',price:145,category:'oil',badge:'Pure',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'},
  {_id:'5',name:'Fresh Banana',quantity:'12 pcs',price:48,category:'fruits',badge:'Ripe',img:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop'},
  {_id:'6',name:'Wheat Atta',quantity:'5 kg',price:220,category:'grains',badge:'Best',img:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'},
];

const HERO_ITEMS = [
  {_id:'1',name:'Tomato',price:35,category:'vegetables',quantity:'1 kg',img:'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=200&h=200&fit=crop'},
  {_id:'2',name:'Spinach',price:20,category:'vegetables',quantity:'250 g',img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop'},
  {_id:'3',name:'Onion',price:28,category:'vegetables',quantity:'1 kg',img:'https://images.unsplash.com/photo-1508747703725-719777637510?w=200&h=200&fit=crop'},
  {_id:'4',name:'Potato',price:25,category:'vegetables',quantity:'1 kg',img:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop'},
  {_id:'5',name:'Banana',price:48,category:'fruits',quantity:'12 pcs',img:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop'},
  {_id:'6',name:'Apple',price:80,category:'fruits',quantity:'4 pcs',img:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop'},
  {_id:'7',name:'Milk',price:29,category:'dairy',quantity:'500 ml',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop'},
  {_id:'8',name:'Eggs',price:36,category:'dairy',quantity:'6 pcs',img:'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop'},
  {_id:'9',name:'Rice',price:85,category:'grains',quantity:'1 kg',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=200&h=200&fit=crop'},
  {_id:'10',name:'Dal',price:60,category:'grains',quantity:'500 g',img:'https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=200&h=200&fit=crop'},
];

const MARQUEE = [
  '🛒 Free delivery above ₹199',
  '🥬 Fresh vegetables every morning',
  '⚡ 30-minute delivery in Kalpi',
  '💳 UPI, Cards & Cash on Delivery',
  '🌿 100% Fresh & Natural',
  '📦 Easy returns & refunds',
  '🎉 Use code APNI50 for ₹50 off',
];

const CATS = [
  {id:'vegetables',label:'Sabzi',img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&h=80&fit=crop'},
  {id:'fruits',label:'Fruits',img:'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=80&h=80&fit=crop'},
  {id:'dairy',label:'Dairy',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop'},
  {id:'grains',label:'Dal-Rice',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=80&h=80&fit=crop'},
  {id:'oil',label:'Masala',img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80&h=80&fit=crop'},
  {id:'snacks',label:'Snacks',img:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&h=80&fit=crop'},
  {id:'drinks',label:'Drinks',img:'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=80&h=80&fit=crop'},
  {id:'household',label:'Home',img:'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=80&h=80&fit=crop'},
  {id:'',label:'All Items',img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop'},
];

// ✅ FIXED: Simple FloatingCard - no drag, only clean click detection
function FloatingCard({ item, delay, onCardClick }) {
  const [added, setAdded] = useState(false);
  const clickStartRef = useRef(null);
  const movedRef = useRef(false);

  const handleMouseDown = (e) => {
    clickStartRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!clickStartRef.current) return;
    const dx = Math.abs(e.clientX - clickStartRef.current.x);
    const dy = Math.abs(e.clientY - clickStartRef.current.y);
    if (dx > 5 || dy > 5) movedRef.current = true;
  };

  const handleMouseUp = () => {
    if (!movedRef.current && clickStartRef.current) {
      // Clean click — add to cart and redirect
      setAdded(true);
      onCardClick(item);
      setTimeout(() => setAdded(false), 1000);
    }
    clickStartRef.current = null;
    movedRef.current = false;
  };

  // Touch support
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    clickStartRef.current = { x: t.clientX, y: t.clientY };
    movedRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (!clickStartRef.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - clickStartRef.current.x);
    const dy = Math.abs(t.clientY - clickStartRef.current.y);
    if (dx > 8 || dy > 8) movedRef.current = true;
  };

  const handleTouchEnd = () => {
    if (!movedRef.current && clickStartRef.current) {
      setAdded(true);
      onCardClick(item);
      setTimeout(() => setAdded(false), 1000);
    }
    clickStartRef.current = null;
    movedRef.current = false;
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        background: added ? '#145530' : 'rgba(255,255,255,0.96)',
        borderRadius: 20,
        padding: '16px 10px',
        textAlign: 'center',
        border: added ? '2px solid #86efac' : '2px solid rgba(255,255,255,0.7)',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
        animation: `floatAnim ${2.8 + delay * 0.3}s ${delay * 0.15}s ease-in-out infinite`,
        transition: 'background 0.3s, border 0.3s, transform 0.15s',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {added && (
        <div style={{
          position: 'absolute', top: -10, right: -8,
          background: '#22c55e', color: '#fff',
          borderRadius: '50%', width: 24, height: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, zIndex: 10,
          animation: 'popIn 0.3s ease'
        }}>✓</div>
      )}
      <img
        src={item.img}
        alt={item.name}
        draggable={false}
        style={{
          width: 64, height: 64, objectFit: 'cover',
          borderRadius: 14, marginBottom: 8,
          pointerEvents: 'none',
          filter: added ? 'brightness(1.3)' : 'none',
        }}
      />
      <div style={{ fontSize: 10, color: added ? '#86efac' : '#145530', fontWeight: 700, pointerEvents: 'none' }}>
        {item.name}
      </div>
      <div style={{ fontSize: 13, color: added ? '#fff' : '#f07c2a', fontWeight: 800, marginTop: 2, fontFamily: "'Baloo 2',cursive", pointerEvents: 'none' }}>
        ₹{item.price}
      </div>
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearch = () => {
    if (searchVal.trim()) {
      setSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  // ✅ Card click: add to cart + redirect to shop
  const handleCardClick = (item) => {
    addToCart(item);
    toast.success(`${item.name} added! 🛒`, {
      style: { borderRadius: 50, fontWeight: 600 }
    });
    setTimeout(() => navigate('/products'), 600);
  };

  return (
    <div style={{ fontFamily: "'Poppins',sans-serif" }}>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,46,26,0.85)',
            zIndex: 9999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 80,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{
            background: '#fff', borderRadius: 24, padding: 28,
            width: '90%', maxWidth: 560,
            animation: 'slideDown 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f5f9f6', borderRadius: 50, padding: '12px 20px', border: '2px solid #c8e6d4', marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <input
                ref={searchRef}
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search karo - atta, dal, sabzi, fruits..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, fontFamily: "'Poppins',sans-serif", background: 'transparent', color: '#0a2e1a' }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#6b8f71', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#6b8f71', fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>POPULAR SEARCHES</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Tomato','Dal','Rice','Milk','Onion','Oil','Atta','Eggs','Sugar','Paneer'].map(s => (
                  <button key={s}
                    onClick={() => { setSearchVal(s); navigate(`/products?search=${s}`); setSearchOpen(false); }}
                    style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSearch}
              style={{ width: '100%', background: 'linear-gradient(135deg,#145530,#1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
              Search Products →
            </button>
          </div>
        </div>
      )}

      {/* ── Top Bar ── */}
      <div style={{ background: '#0a2e1a', color: '#86efac', textAlign: 'center', padding: '9px 16px', fontSize: 12.5, fontWeight: 500 }}>
        🎉 Free delivery above <b style={{ color: '#fff' }}>₹199</b> &nbsp;·&nbsp;
        Delivering in <b style={{ color: '#fff' }}>Kalpi & nearby areas</b> &nbsp;·&nbsp;
        <b style={{ color: '#fff' }}>Cash on Delivery available</b>
      </div>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg,#0a2e1a 0%,#145530 55%,#1a6b3a 100%)',
        minHeight: 520,
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', width: 480, height: 480, background: 'rgba(255,255,255,0.03)', borderRadius: '50%', top: -100, right: 180, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 220, height: 220, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', bottom: -70, left: 60, pointerEvents: 'none' }} />

        {/* Left text */}
        <div style={{ padding: '68px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', animation: 'fadeUp 0.8s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', color: '#86efac', fontSize: 13, fontWeight: 700, padding: '8px 20px', borderRadius: 50, marginBottom: 24, width: 'fit-content', border: '1px solid rgba(255,255,255,0.25)' }}>
            <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            Now delivering in Kalpi & nearby areas
          </div>
          <h1 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 52, fontWeight: 800, lineHeight: 1.1, color: '#fff', marginBottom: 14, letterSpacing: '-1.5px' }}>
            Fresh Grocery<br />Delivered to<br />Your <span style={{ color: '#86efac' }}>Doorstep</span>
          </h1>
          <p style={{ fontFamily: "'Baloo 2',cursive", fontSize: 18, color: '#86efac', fontWeight: 600, marginBottom: 16, fontStyle: 'italic', lineHeight: 1.5 }}>
            "Agar chahiye ho fresh samaan,<br />to best option hai <span style={{ color: '#fff' }}>Apni Dukan!</span>"
          </p>
          <p style={{ fontSize: 14.5, color: '#bbf7d0', lineHeight: 1.8, maxWidth: 380, marginBottom: 36 }}>
            Apne shehar ki apni online grocery store. Honest prices, same-day delivery, hamesha fresh.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/products')}
              style={{ background: '#f07c2a', color: '#fff', border: 'none', borderRadius: 50, padding: '15px 36px', fontSize: 15, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', fontWeight: 700, boxShadow: '0 8px 24px rgba(240,124,42,0.4)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Shop Now →
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              style={{ background: 'rgba(255,255,255,0.13)', color: '#fff', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 50, padding: '15px 36px', fontSize: 15, fontFamily: "'Poppins',sans-serif", cursor: 'pointer', fontWeight: 600, backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
            >
              🔍 Search Items
            </button>
          </div>
          <div style={{ display: 'flex', gap: 36, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[['50+','Products'],['30min','Delivery'],['100%','Fresh'],['₹0','Hidden Fees']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#fff' }}>{n}</div>
                <div style={{ fontSize: 11, color: '#86efac', marginTop: 1, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Floating Cards — click only, no drag */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', position: 'relative' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: 1, marginBottom: 14, textAlign: 'center' }}>
            👆 CLICK TO ADD TO CART
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 96px)', gap: 12 }}>
            {HERO_ITEMS.map((item, i) => (
              <FloatingCard key={item._id} item={item} delay={i} onCardClick={handleCardClick} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ background: '#f07c2a', padding: '11px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 22s linear infinite' }}>
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} style={{ color: '#fff', fontSize: 13, fontWeight: 600, padding: '0 36px', whiteSpace: 'nowrap' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── Search Bar (clickable, opens modal) ── */}
      <div style={{ padding: '28px 36px 16px', background: '#fff' }}>
        <div
          onClick={() => setSearchOpen(true)}
          style={{ display: 'flex', alignItems: 'center', background: '#f5f9f6', border: '2px solid #c8e6d4', borderRadius: 50, padding: '14px 26px', gap: 14, boxShadow: '0 4px 20px rgba(20,85,48,0.08)', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#145530'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(20,85,48,0.16)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#c8e6d4'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(20,85,48,0.08)'; }}
        >
          <span style={{ fontSize: 20 }}>🔍</span>
          <span style={{ flex: 1, fontSize: 15, color: '#9ab8a0', fontWeight: 400 }}>Search karo - atta, dal, sabzi, fruits, snacks...</span>
          <span style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '8px 22px', fontSize: 13, fontWeight: 700 }}>Search</span>
        </div>
      </div>

      {/* ── Category Circles ── */}
      <div style={{ padding: '20px 36px 8px', background: '#fff' }}>
        <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 20 }}>
          Shop by Category
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: 12 }}>
          {CATS.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate(`/products${cat.id ? `?category=${cat.id}` : ''}`)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e8f2ea', boxShadow: '0 4px 16px rgba(20,85,48,0.12)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#145530'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8f2ea'}>
                <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0a2e1a', textAlign: 'center' }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Products (6 only) ── */}
      <div style={{ padding: '28px 36px 48px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#0a2e1a' }}>
            Today's Top Picks 🔥
          </h2>
          <button
            onClick={() => navigate('/products')}
            style={{ background: '#e6f4ec', color: '#145530', border: '2px solid #b8dfc6', borderRadius: 50, padding: '9px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#145530'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#e6f4ec'; e.currentTarget.style.color = '#145530'; }}
          >
            View All 50+ →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 18 }}>
          {FEATURED.map((p, i) => (
            <div
              key={p._id}
              style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #e8f2ea', cursor: 'pointer', transition: 'all 0.25s', animation: `fadeUp 0.5s ${i * 0.08}s ease both` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(20,85,48,0.15)'; e.currentTarget.style.borderColor = '#a8d5b8'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e8f2ea'; }}
              onClick={() => navigate('/products')}
            >
              <div style={{ height: 130, overflow: 'hidden', position: 'relative' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                <span style={{ position: 'absolute', top: 8, left: 8, background: '#145530', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>{p.badge}</span>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2e1a', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#6b8f71', marginBottom: 8, fontWeight: 500 }}>{p.quantity}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Baloo 2',cursive", fontSize: 18, fontWeight: 800, color: '#145530' }}>₹{p.price}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(p);
                      toast.success(`${p.name} added! 🛒`);
                    }}
                    style={{ background: '#e6f4ec', color: '#145530', border: '2px solid #b8dfc6', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', fontWeight: 800, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#145530'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#e6f4ec'; e.currentTarget.style.color = '#145530'; e.currentTarget.style.transform = 'rotate(0)'; }}
                  >+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div style={{ background: '#f5f9f6', padding: '48px 36px' }}>
        <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 28, textAlign: 'center' }}>
          Why Choose Apni Dukan? 💚
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {[
            ['🌿','Always Fresh','Roz subah fresh products aate hain local farms se'],
            ['⚡','Super Fast','30-60 minute mein delivery aapke darwaze par'],
            ['💰','Best Prices','Sachche daam, koi chhupa charge nahi'],
            ['🤝','Local Love','Apne shehar ki dukaan, apne logon ke liye'],
          ].map(([icon, title, desc]) => (
            <div key={title}
              style={{ background: '#fff', borderRadius: 20, padding: '28px 20px', textAlign: 'center', border: '1.5px solid #e8f2ea', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#6b8f71', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Offer Banner ── */}
      <div style={{ margin: '0 36px 48px', background: 'linear-gradient(135deg,#0a2e1a,#145530)', borderRadius: 28, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 220, height: 220, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div>
          <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
            Get ₹50 off on your first order! 🎉
          </h2>
          <p style={{ color: '#86efac', fontSize: 14, lineHeight: 1.7 }}>
            Use code <b style={{ color: '#f07c2a', fontSize: 16 }}>APNI50</b> at checkout. Valid for new users. Min order ₹199.
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          style={{ background: '#f07c2a', color: '#fff', border: 'none', borderRadius: 50, padding: '16px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", boxShadow: '0 8px 24px rgba(240,124,42,0.4)', flexShrink: 0, position: 'relative', zIndex: 1 }}
        >
          Claim Offer →
        </button>
      </div>

      {/* ── Location Bar ── */}
      <div style={{ background: '#fff', borderTop: '2px solid #e0ede5', padding: '24px 36px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 52, height: 52, background: '#145530', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>📍</div>
        <div>
          <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 17, fontWeight: 800, color: '#0a2e1a' }}>Our Warehouse / Office</div>
          <div style={{ fontSize: 13.5, color: '#4a6b50', marginTop: 4, fontWeight: 500 }}>135, Raj Ghat, Kalpi, Jalaun — 285204, Uttar Pradesh, India</div>
        </div>
        <a
          href="https://wa.me/917355691229"
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: 'auto', background: '#25D366', color: '#fff', borderRadius: 50, padding: '10px 24px', textDecoration: 'none', fontSize: 13, fontWeight: 700, flexShrink: 0 }}
        >
          💬 WhatsApp Order
        </a>
      </div>

      {/* ── All CSS Animations ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.6); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 1.15fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(4, 96px)"] {
            grid-template-columns: repeat(5, 1fr) !important;
            gap: 8px !important;
          }
          div[style*="grid-template-columns: repeat(9,1fr)"] {
            grid-template-columns: repeat(5,1fr) !important;
          }
          div[style*="grid-template-columns: repeat(6,1fr)"] {
            grid-template-columns: repeat(2,1fr) !important;
          }
          div[style*="grid-template-columns: repeat(4,1fr)"] {
            grid-template-columns: repeat(2,1fr) !important;
          }
          div[style*="padding: 68px 52px"] {
            padding: 36px 20px !important;
          }
          h1[style*="font-size: 52px"] {
            font-size: 34px !important;
          }
          div[style*="padding: 28px 36px"], div[style*="padding: 20px 36px"],
          div[style*="padding: 48px 36px"] {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          div[style*="padding: 40px 48px"] {
            flex-direction: column !important;
            padding: 24px 20px !important;
            gap: 20px !important;
            text-align: center !important;
          }
          div[style*="margin: 0 36px 48px"] {
            margin: 0 16px 32px !important;
          }
        }
      `}</style>
    </div>
  );
}