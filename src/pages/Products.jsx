import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import toast from 'react-hot-toast';

const CATS = [
  {id:'All',label:'All Items'},{id:'vegetables',label:'Vegetables'},{id:'fruits',label:'Fruits'},
  {id:'dairy',label:'Dairy'},{id:'grains',label:'Grains & Dal'},{id:'oil',label:'Oil & Masala'},
  {id:'snacks',label:'Snacks'},{id:'drinks',label:'Drinks'},{id:'household',label:'Household'},
];

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const getParam = (k) => new URLSearchParams(location.search).get(k) || '';
  const [search, setSearch] = useState(getParam('search'));
  const [category, setCategory] = useState(getParam('category') || 'All');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSearch(p.get('search') || '');
    setCategory(p.get('category') || 'All');
  }, [location.search]);

  let filtered = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const q = search.toLowerCase();
    const matchS = !search || p.name.toLowerCase().includes(q) || (p.nameHindi && p.nameHindi.includes(search));
    return matchCat && matchS;
  });

  if (sort === 'low') filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === 'high') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === 'discount') filtered = [...filtered].sort((a,b) => ((b.mrp-b.price)/b.mrp) - ((a.mrp-a.price)/a.mrp));
  if (sort === 'name') filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name));
  if (sort === 'stock') filtered = [...filtered].sort((a,b) => b.stock - a.stock);

  const sbtn = (active) => ({ display:'block', width:'100%', textAlign:'left', padding:'8px 11px', borderRadius:9, border:'none', fontSize:12.5, fontWeight:active?700:500, background:active?'#e6f4ec':'transparent', color:active?'#145530':'#4a6b50', cursor:'pointer', marginBottom:2, fontFamily:'Poppins, sans-serif' });

  const handleAdd = (e, p) => {
    e.stopPropagation();
    if (p.stock <= 0) { toast.error('Out of Stock!'); return; }
    const r = addToCart(p);
    if (r && !r.success) { toast.error(r.message); return; }
    toast.success(p.name + ' added! 🛒');
  };

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', fontFamily:'Poppins, sans-serif' }}>

      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'22px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Baloo 2, cursive', fontSize:24, fontWeight:800, color:'#fff', marginBottom:2 }}>
              {search ? '"'+search+'" ke results' : category !== 'All' ? (CATS.find(c=>c.id===category)||{}).label||category : 'Saare Products 🛒'}
            </h1>
            <p style={{ color:'#86efac', fontSize:12 }}>{filtered.length} products</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.25)', borderRadius:50, padding:'8px 16px', gap:8 }}>
            <span style={{ color:'#86efac' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search English ya Hindi..."
              style={{ border:'none', outline:'none', background:'transparent', fontSize:13, color:'#fff', fontFamily:'Poppins, sans-serif', width:180 }} />
            {search && <button onClick={()=>setSearch('')} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.7)',cursor:'pointer',fontSize:13 }}>✕</button>}
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', minHeight:'80vh' }}>

        {/* Sidebar */}
        <div style={{ background:'#fff', borderRight:'1.5px solid #e8f2ea', padding:'16px 12px' }}>
          <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:15, fontWeight:800, color:'#0a2e1a', marginBottom:10 }}>Categories</h3>
          {CATS.map(c => <button key={c.id} onClick={()=>setCategory(c.id)} style={sbtn(category===c.id)}>{category===c.id?'✓ ':''}{c.label}</button>)}
          <div style={{ borderTop:'1.5px solid #e8f2ea', marginTop:12, paddingTop:12 }}>
            <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:15, fontWeight:800, color:'#0a2e1a', marginBottom:8 }}>Sort By</h3>
            {[['default','Default'],['low','Price: Low→High'],['high','Price: High→Low'],['discount','Max Discount'],['stock','In Stock First'],['name','Name A-Z']].map(([v,l]) => (
              <button key={v} onClick={()=>setSort(v)} style={sbtn(sort===v)}>{sort===v?'✓ ':''}{l}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding:'16px 18px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px' }}>
              <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
              <p style={{ fontFamily:'Baloo 2, cursive', fontSize:20, fontWeight:800, color:'#0a2e1a', marginBottom:10 }}>Nahi mila "{search}"!</p>
              <button onClick={()=>{setSearch('');setCategory('All');}} style={{ background:'#145530',color:'#fff',border:'none',borderRadius:50,padding:'11px 24px',fontSize:13,fontWeight:700,cursor:'pointer' }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:13 }}>
              {filtered.map(p => {
                const disc = p.mrp > p.price ? Math.round(((p.mrp-p.price)/p.mrp)*100) : 0;
                const inStock = p.stock > 0;
                return (
                  <div key={p._id} onClick={()=>navigate('/product/'+p._id)}
                    style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid ' + (inStock?'#e8f2ea':'#fca5a5'), cursor:'pointer', transition:'all 0.2s', opacity:inStock?1:0.8 }}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 26px rgba(20,85,48,0.12)';}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
                    <div style={{ height:130, overflow:'hidden', position:'relative' }}>
                      <img src={p.img} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', filter:inStock?'none':'grayscale(30%)' }} loading="lazy" />
                      <span style={{ position:'absolute', top:7, left:7, background:'#145530', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:50 }}>{p.badge}</span>
                      {disc>=10 && <span style={{ position:'absolute', top:7, right:7, background:'#e24b4a', color:'#fff', fontSize:9, fontWeight:800, padding:'2px 7px', borderRadius:50 }}>{disc}% OFF</span>}
                      {!inStock && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ background:'#e24b4a', color:'#fff', fontSize:11, fontWeight:800, padding:'5px 14px', borderRadius:50 }}>Out of Stock</span></div>}
                    </div>
                    <div style={{ padding:11 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:'#0a2e1a', marginBottom:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                      {p.nameHindi && <div style={{ fontSize:10, color:'#6b8f71', marginBottom:1 }}>{p.nameHindi}</div>}
                      <div style={{ fontSize:10, color:'#6b8f71', marginBottom:8 }}>{p.quantity}</div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div>
                          <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                            <span style={{ fontFamily:'Baloo 2, cursive', fontSize:16, fontWeight:800, color:'#145530' }}>Rs.{p.price}</span>
                            {p.mrp>p.price && <span style={{ fontSize:10, color:'#9ca3af', textDecoration:'line-through' }}>Rs.{p.mrp}</span>}
                          </div>
                          {disc>0 && <div style={{ fontSize:9, color:'#22c55e', fontWeight:700 }}>Rs.{p.mrp-p.price} bachat!</div>}
                        </div>
                        <button onClick={e=>handleAdd(e,p)}
                          style={{ background:inStock?'#e6f4ec':'#f5f5f5', color:inStock?'#145530':'#9ca3af', border:'1.5px solid '+(inStock?'#b8dfc6':'#ddd'), borderRadius:'50%', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:inStock?'pointer':'not-allowed', fontWeight:800 }}>+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width:768px) {
          div[style*="grid-template-columns: 180px 1fr"] { grid-template-columns:1fr !important; }
          div[style*="grid-template-columns: repeat(4,1fr)"] { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}