import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const FEATURED = [
  {_id:'f1',name:'Fresh Tomato',nameHindi:'ताज़ा टमाटर',quantity:'1 kg',price:35,mrp:45,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop'},
  {_id:'f2',name:'Basmati Rice',nameHindi:'बासमती चावल',quantity:'1 kg',price:85,mrp:110,category:'grains',badge:'Premium',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=400&h=300&fit=crop'},
  {_id:'f3',name:'Full Cream Milk',nameHindi:'दूध',quantity:'500 ml',price:29,mrp:32,category:'dairy',badge:'Daily',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop'},
  {_id:'f4',name:'Sunflower Oil',nameHindi:'सूरजमुखी तेल',quantity:'1 litre',price:145,mrp:175,category:'oil',badge:'Pure',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'},
  {_id:'f5',name:'Fresh Banana',nameHindi:'केला',quantity:'12 pcs',price:48,mrp:60,category:'fruits',badge:'Ripe',img:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop'},
  {_id:'f6',name:'Wheat Atta',nameHindi:'गेहूं का आटा',quantity:'5 kg',price:220,mrp:260,category:'grains',badge:'Best',img:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'},
];

const HERO_ITEMS = [
  {_id:'h1',name:'Tomato',price:35,mrp:45,category:'vegetables',quantity:'1 kg',img:'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=200&h=200&fit=crop'},
  {_id:'h2',name:'Spinach',price:20,mrp:28,category:'vegetables',quantity:'250 g',img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop'},
  {_id:'h3',name:'Onion',price:28,mrp:35,category:'vegetables',quantity:'1 kg',img:'https://images.unsplash.com/photo-1508747703725-719777637510?w=200&h=200&fit=crop'},
  {_id:'h4',name:'Potato',price:25,mrp:32,category:'vegetables',quantity:'1 kg',img:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop'},
  {_id:'h5',name:'Banana',price:48,mrp:60,category:'fruits',quantity:'12 pcs',img:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop'},
  {_id:'h6',name:'Apple',price:80,mrp:100,category:'fruits',quantity:'4 pcs',img:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop'},
  {_id:'h7',name:'Milk',price:29,mrp:32,category:'dairy',quantity:'500 ml',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop'},
  {_id:'h8',name:'Eggs',price:36,mrp:48,category:'dairy',quantity:'6 pcs',img:'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop'},
  {_id:'h9',name:'Rice',price:85,mrp:110,category:'grains',quantity:'1 kg',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=200&h=200&fit=crop'},
  {_id:'h10',name:'Dal',price:60,mrp:75,category:'grains',quantity:'500 g',img:'https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=200&h=200&fit=crop'},
];

const MARQUEE = [
  '🛒 Free delivery above Rs.199',
  '🥬 Fresh vegetables every morning',
  '⚡ 30-minute delivery in Kalpi',
  '💳 UPI, Cards & Cash on Delivery',
  '🌿 100% Fresh & Natural',
  '📦 Easy returns & refunds',
  '🎉 Use code APNI50 for Rs.50 off',
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
      setAdded(true);
      onCardClick(item);
      setTimeout(() => setAdded(false), 1000);
    }
    clickStartRef.current = null;
    movedRef.current = false;
  };
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
        padding: '14px 10px',
        textAlign: 'center',
        border: added ? '2px solid #86efac' : '2px solid rgba(255,255,255,0.7)',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        boxShadow: '0 8px 24px rgba(0,0,0,0.13)',
        animationName: 'floatAnim',
        animationDuration: (2.8 + delay * 0.3) + 's',
        animationDelay: (delay * 0.12) + 's',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        transition: 'background 0.3s, border 0.3s',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {added && (
        <div style={{
          position: 'absolute', top: -10, right: -8,
          background: '#22c55e', color: '#fff',
          borderRadius: '50%', width: 22, height: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, zIndex: 10,
        }}>✓</div>
      )}
      <img
        src={item.img}
        alt={item.name}
        draggable={false}
        style={{
          width: 60, height: 60, objectFit: 'cover',
          borderRadius: 14, marginBottom: 6, pointerEvents: 'none',
        }}
      />
      <div style={{ fontSize: 10, color: added ? '#86efac' : '#145530', fontWeight: 700, pointerEvents: 'none' }}>
        {item.name}
      </div>
      <div style={{ fontSize: 12, color: added ? '#fff' : '#f07c2a', fontWeight: 800, marginTop: 2, fontFamily: 'Baloo 2, cursive', pointerEvents: 'none' }}>
        Rs.{item.price}
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
      navigate('/products?search=' + encodeURIComponent(searchVal.trim()));
    }
  };

  const handleCardClick = (item) => {
    addToCart(item);
    toast.success(item.name + ' added! 🛒');
    setTimeout(() => navigate('/products'), 600);
  };

  const handleAddFeatured = (e, p) => {
    e.stopPropagation();
    addToCart(p);
    toast.success(p.name + ' added! 🛒');
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Search Modal */}
      {searchOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,46,26,0.85)',
            zIndex: 9999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 80,
          }}
        >
          <div style={{
            background: '#fff', borderRadius: 24, padding: 28,
            width: '90%', maxWidth: 560,
            boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f5f9f6', borderRadius: 50, padding: '12px 20px', border: '2px solid #c8e6d4', marginBottom: 20 }}>
              <span style={{ fontSize: 18 }}>🔍</span>
              <input
                ref={searchRef}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="Search karo - atta, dal, sabzi..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Poppins, sans-serif', background: 'transparent', color: '#0a2e1a' }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#6b8f71' }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#6b8f71', fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>POPULAR SEARCHES</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Tomato', 'Dal', 'Rice', 'Milk', 'Onion', 'Oil', 'Atta', 'Eggs'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { navigate('/products?search=' + s); setSearchOpen(false); }}
                    style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSearch}
              style={{ width: '100%', background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
            >
              Search Products →
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ background: '#0a2e1a', color: '#86efac', textAlign: 'center', padding: '9px 16px', fontSize: 12, fontWeight: 500 }}>
        🎉 Free delivery above Rs.199 · Delivering in Kalpi &amp; nearby areas · Cash on Delivery available
      </div>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #0a2e1a 0%, #145530 55%, #1a6b3a 100%)', minHeight: 500, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', overflow: 'hidden', position: 'relative' }}>
        <div style={{ padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', color: '#86efac', fontSize: 12, fontWeight: 700, padding: '7px 18px', borderRadius: 50, marginBottom: 22, width: 'fit-content', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
            Now delivering in Kalpi &amp; nearby areas
          </div>
          <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 48, fontWeight: 800, lineHeight: 1.1, color: '#fff', marginBottom: 12, letterSpacing: '-1px' }}>
            Fresh Grocery<br />Delivered to<br /><span style={{ color: '#86efac' }}>Your Doorstep</span>
          </h1>
          <p style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, color: '#86efac', fontWeight: 600, marginBottom: 14, fontStyle: 'italic' }}>
            "Agar chahiye ho fresh samaan, to best option hai Apni Dukan!"
          </p>
          <p style={{ fontSize: 14, color: '#bbf7d0', lineHeight: 1.8, maxWidth: 360, marginBottom: 32 }}>
            Apne shehar ki apni online grocery store. Honest prices, same-day delivery.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/products')}
              style={{ background: '#f07c2a', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 32px', fontSize: 14, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', fontWeight: 700, boxShadow: '0 8px 24px rgba(240,124,42,0.4)' }}
            >
              Shop Now →
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              style={{ background: 'rgba(255,255,255,0.13)', color: '#fff', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 50, padding: '14px 32px', fontSize: 14, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', fontWeight: 600 }}
            >
              🔍 Search
            </button>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[['50+', 'Products'], ['30min', 'Delivery'], ['100%', 'Fresh'], ['Rs.0', 'Hidden Fees']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#fff' }}>{n}</div>
                <div style={{ fontSize: 10, color: '#86efac', marginTop: 2, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Hero Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, marginBottom: 12, textAlign: 'center' }}>
            CLICK TO ADD TO CART
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 88px)', gap: 10 }}>
            {HERO_ITEMS.map((item, i) => (
              <FloatingCard key={item._id} item={item} delay={i} onCardClick={handleCardClick} />
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{ background: '#f07c2a', padding: '10px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: 'max-content', animationName: 'marquee', animationDuration: '22s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}>
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} style={{ color: '#fff', fontSize: 13, fontWeight: 600, padding: '0 32px', whiteSpace: 'nowrap' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '28px 32px 16px', background: '#fff' }}>
        <div
          onClick={() => setSearchOpen(true)}
          style={{ display: 'flex', alignItems: 'center', background: '#f5f9f6', border: '2px solid #c8e6d4', borderRadius: 50, padding: '13px 22px', gap: 12, boxShadow: '0 4px 16px rgba(20,85,48,0.07)', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 18 }}>🔍</span>
          <span style={{ flex: 1, fontSize: 14, color: '#9ab8a0' }}>Search karo - atta, dal, sabzi, fruits...</span>
          <span style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '7px 20px', fontSize: 13, fontWeight: 700 }}>Search</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '20px 32px 8px', background: '#fff' }}>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#0a2e1a', marginBottom: 18 }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 10 }}>
          {CATS.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('/products' + (cat.id ? '?category=' + cat.id : ''))}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e8f2ea', boxShadow: '0 4px 14px rgba(20,85,48,0.1)' }}>
                <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0a2e1a', textAlign: 'center' }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ padding: '24px 32px 40px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#0a2e1a' }}>Today's Top Picks 🔥</h2>
          <button
            onClick={() => navigate('/products')}
            style={{ background: '#e6f4ec', color: '#145530', border: '2px solid #b8dfc6', borderRadius: 50, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
          >
            View All 50+ →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {FEATURED.map((p) => {
            const disc = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
            return (
              <div
                key={p._id}
                onClick={() => navigate('/products')}
                style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1.5px solid #e8f2ea', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(20,85,48,0.13)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ height: 125, overflow: 'hidden', position: 'relative' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <span style={{ position: 'absolute', top: 8, left: 8, background: '#145530', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 50 }}>{p.badge}</span>
                  {disc >= 10 && <span style={{ position: 'absolute', top: 8, right: 8, background: '#e24b4a', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 50 }}>{disc}% OFF</span>}
                </div>
                <div style={{ padding: 11 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2e1a', marginBottom: 1 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: '#6b8f71', marginBottom: 7 }}>{p.quantity}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#145530' }}>Rs.{p.price}</span>
                        {p.mrp > p.price && <span style={{ fontSize: 11, color: '#9ca3af', textDecoration: 'line-through' }}>Rs.{p.mrp}</span>}
                      </div>
                      {disc > 0 && <div style={{ fontSize: 9, color: '#22c55e', fontWeight: 700 }}>Rs.{p.mrp - p.price} bachat!</div>}
                    </div>
                    <button
                      onClick={(e) => handleAddFeatured(e, p)}
                      style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', fontWeight: 800 }}
                    >+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ background: '#f5f9f6', padding: '40px 32px' }}>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#0a2e1a', marginBottom: 24, textAlign: 'center' }}>Why Choose Apni Dukan? 💚</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[['🌿', 'Always Fresh', 'Roz subah fresh products aate hain'], ['⚡', 'Super Fast', '30-60 min delivery aapke darwaze tak'], ['💰', 'Best Prices', 'Honest prices, koi chhupa charge nahi'], ['🤝', 'Local Love', 'Apne shehar ki dukaan, apne logon ke liye']].map(([icon, title, desc]) => (
            <div key={title} style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', textAlign: 'center', border: '1.5px solid #e8f2ea' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#6b8f71', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Banner */}
      <div style={{ margin: '0 32px 40px', background: 'linear-gradient(135deg, #0a2e1a, #145530)', borderRadius: 24, padding: '36px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Get Rs.50 off on your first order! 🎉</h2>
          <p style={{ color: '#86efac', fontSize: 14 }}>Use code <strong style={{ color: '#f07c2a', fontSize: 16 }}>APNI50</strong> at checkout. Min order Rs.199.</p>
        </div>
        <button
          onClick={() => navigate('/products')}
          style={{ background: '#f07c2a', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', flexShrink: 0, position: 'relative', zIndex: 1 }}
        >
          Claim Offer →
        </button>
      </div>

      {/* Location */}
      <div style={{ background: '#fff', borderTop: '2px solid #e0ede5', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, background: '#145530', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📍</div>
        <div>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a' }}>Our Warehouse / Office</div>
          <div style={{ fontSize: 13, color: '#4a6b50', marginTop: 3 }}>135, Raj Ghat, Kalpi, Jalaun — 285204, Uttar Pradesh, India</div>
        </div>
        <a href="https://wa.me/917355691229" target="_blank" rel="noreferrer"
          style={{ marginLeft: 'auto', background: '#25D366', color: '#fff', borderRadius: 50, padding: '10px 22px', textDecoration: 'none', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          💬 WhatsApp Order
        </a>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');
        @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @media (max-width:768px) {
          section[style] { grid-template-columns:1fr !important; }
          div[style*="repeat(6"] { grid-template-columns:repeat(2,1fr) !important; }
          div[style*="repeat(9"] { grid-template-columns:repeat(5,1fr) !important; }
          div[style*="repeat(4"] { grid-template-columns:repeat(2,1fr) !important; }
          div[style*="repeat(4, 88px)"] { grid-template-columns:repeat(5,1fr) !important; gap:6px !important; }
          h1[style] { font-size:32px !important; }
          div[style*="padding: 60px 48px"] { padding:32px 20px !important; }
          div[style*="margin: 0 32px"] { margin:0 16px 32px !important; flex-direction:column !important; gap:16px !important; }
          div[style*="padding: 40px 32px"] { padding:24px 16px !important; }
        }
      `}</style>
    </div>
  );
}