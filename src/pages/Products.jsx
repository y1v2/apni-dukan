import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PRODUCTS = [
  {_id:'1',name:'Fresh Tomato',quantity:'1 kg',price:35,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=300&h=200&fit=crop'},
  {_id:'2',name:'Green Spinach',quantity:'250 g',price:20,category:'vegetables',badge:'Organic',img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop'},
  {_id:'3',name:'Fresh Onion',quantity:'1 kg',price:28,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&h=200&fit=crop'},
  {_id:'4',name:'Potato',quantity:'1 kg',price:25,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop'},
  {_id:'5',name:'Green Chilli',quantity:'100 g',price:15,category:'vegetables',badge:'Hot',img:'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=300&h=200&fit=crop'},
  {_id:'6',name:'Cauliflower',quantity:'1 piece',price:30,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=300&h=200&fit=crop'},
  {_id:'7',name:'Carrot',quantity:'500 g',price:22,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=200&fit=crop'},
  {_id:'8',name:'Cucumber',quantity:'500 g',price:18,category:'vegetables',badge:'Cool',img:'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=200&fit=crop'},
  {_id:'9',name:'Fresh Banana',quantity:'12 pcs',price:48,category:'fruits',badge:'Ripe',img:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop'},
  {_id:'10',name:'Red Apple',quantity:'4 pcs',price:80,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop'},
  {_id:'11',name:'Sweet Orange',quantity:'4 pcs',price:60,category:'fruits',badge:'Juicy',img:'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=200&fit=crop'},
  {_id:'12',name:'Watermelon',quantity:'1 piece',price:65,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=300&h=200&fit=crop'},
  {_id:'13',name:'Mango',quantity:'1 kg',price:90,category:'fruits',badge:'Season',img:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=200&fit=crop'},
  {_id:'14',name:'Papaya',quantity:'1 piece',price:55,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=300&h=200&fit=crop'},
  {_id:'15',name:'Full Cream Milk',quantity:'500 ml',price:29,category:'dairy',badge:'Daily',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop'},
  {_id:'16',name:'Fresh Curd',quantity:'400 g',price:35,category:'dairy',badge:'Fresh',img:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop'},
  {_id:'17',name:'Paneer',quantity:'200 g',price:75,category:'dairy',badge:'Fresh',img:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop'},
  {_id:'18',name:'Butter',quantity:'100 g',price:55,category:'dairy',badge:'Pure',img:'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=200&fit=crop'},
  {_id:'19',name:'Farm Eggs',quantity:'6 pcs',price:36,category:'dairy',badge:'Farm',img:'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=200&fit=crop'},
  {_id:'20',name:'Basmati Rice',quantity:'1 kg',price:85,category:'grains',badge:'Premium',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=300&h=200&fit=crop'},
  {_id:'21',name:'Toor Dal',quantity:'500 g',price:60,category:'grains',badge:'Fresh',img:'https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=300&h=200&fit=crop'},
  {_id:'22',name:'Chana Dal',quantity:'500 g',price:55,category:'grains',badge:'Pure',img:'https://images.unsplash.com/photo-1609501676725-7186f017a4b4?w=300&h=200&fit=crop'},
  {_id:'23',name:'Wheat Atta',quantity:'5 kg',price:220,category:'grains',badge:'Best',img:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'},
  {_id:'24',name:'Moong Dal',quantity:'500 g',price:65,category:'grains',badge:'Fresh',img:'https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=300&h=200&fit=crop'},
  {_id:'25',name:'Sugar',quantity:'1 kg',price:45,category:'grains',badge:'Pure',img:'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=300&h=200&fit=crop'},
  {_id:'26',name:'Sunflower Oil',quantity:'1 litre',price:145,category:'oil',badge:'Pure',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop'},
  {_id:'27',name:'Mustard Oil',quantity:'1 litre',price:160,category:'oil',badge:'Kachi Ghani',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop'},
  {_id:'28',name:'Turmeric Powder',quantity:'100 g',price:28,category:'oil',badge:'Pure',img:'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=200&fit=crop'},
  {_id:'29',name:'Red Chilli Powder',quantity:'100 g',price:32,category:'oil',badge:'Spicy',img:'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=300&h=200&fit=crop'},
  {_id:'30',name:'Garam Masala',quantity:'50 g',price:35,category:'oil',badge:'Blend',img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop'},
  {_id:'31',name:'Salt',quantity:'1 kg',price:22,category:'oil',badge:'Iodised',img:'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=300&h=200&fit=crop'},
  {_id:'32',name:'Coriander Powder',quantity:'100 g',price:22,category:'oil',badge:'Fresh',img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop'},
  {_id:'33',name:'Parle-G Biscuits',quantity:'800 g',price:50,category:'snacks',badge:'Popular',img:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=200&fit=crop'},
  {_id:'34',name:'Namkeen Mix',quantity:'200 g',price:30,category:'snacks',badge:'Crispy',img:'https://images.unsplash.com/photo-1575367439058-6096bb43d5d3?w=300&h=200&fit=crop'},
  {_id:'35',name:'Potato Chips',quantity:'100 g',price:20,category:'snacks',badge:'Crunchy',img:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop'},
  {_id:'36',name:'Maggi Noodles',quantity:'4 pack',price:56,category:'snacks',badge:'Quick',img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&h=200&fit=crop'},
  {_id:'37',name:'Brown Bread',quantity:'400 g',price:42,category:'snacks',badge:'Fresh',img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop'},
  {_id:'38',name:'Roasted Peanuts',quantity:'200 g',price:25,category:'snacks',badge:'Protein',img:'https://images.unsplash.com/photo-1567892737950-30b3c38ae5e0?w=300&h=200&fit=crop'},
  {_id:'39',name:'Coca Cola',quantity:'750 ml',price:40,category:'drinks',badge:'Cold',img:'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop'},
  {_id:'40',name:'Sprite',quantity:'750 ml',price:40,category:'drinks',badge:'Fresh',img:'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=300&h=200&fit=crop'},
  {_id:'41',name:'Mango Juice',quantity:'200 ml',price:20,category:'drinks',badge:'Fruity',img:'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=300&h=200&fit=crop'},
  {_id:'42',name:'Mineral Water',quantity:'1 litre',price:20,category:'drinks',badge:'Pure',img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&h=200&fit=crop'},
  {_id:'43',name:'Lassi',quantity:'200 ml',price:25,category:'drinks',badge:'Fresh',img:'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300&h=200&fit=crop'},
  {_id:'44',name:'Dettol Soap',quantity:'75 g',price:38,category:'household',badge:'Protect',img:'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=300&h=200&fit=crop'},
  {_id:'45',name:'Surf Excel',quantity:'500 g',price:85,category:'household',badge:'Clean',img:'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=200&fit=crop'},
  {_id:'46',name:'Colgate Toothpaste',quantity:'150 g',price:65,category:'household',badge:'Care',img:'https://images.unsplash.com/photo-1559591939-0e0e3e8b8a2d?w=300&h=200&fit=crop'},
  {_id:'47',name:'Dish Wash Bar',quantity:'200 g',price:20,category:'household',badge:'Clean',img:'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=200&fit=crop'},
  {_id:'48',name:'Agarbatti',quantity:'20 sticks',price:15,category:'household',badge:'Fragrant',img:'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop'},
  {_id:'49',name:'Match Box',quantity:'1 box',price:5,category:'household',badge:'Daily',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'},
  {_id:'50',name:'Poha',quantity:'500 g',price:30,category:'grains',badge:'Light',img:'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop'},
];

const CATS = [
  {id:'All',label:'All Items'},
  {id:'vegetables',label:'Vegetables'},
  {id:'fruits',label:'Fruits'},
  {id:'dairy',label:'Dairy'},
  {id:'grains',label:'Grains & Dal'},
  {id:'oil',label:'Oil & Masala'},
  {id:'snacks',label:'Snacks'},
  {id:'drinks',label:'Drinks'},
  {id:'household',label:'Household'},
];

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get('search')) setSearch(p.get('search'));
    if (p.get('category')) setCategory(p.get('category'));
  }, [location.search]);

  let filtered = PRODUCTS.filter(p =>
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === 'low') filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === 'high') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === 'name') filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div style={{ background: '#f5f9f6', minHeight: '80vh', fontFamily: "'Poppins',sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0a2e1a,#145530)', padding: '32px 36px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            {search ? `Search: "${search}"` : category !== 'All' ? `${CATS.find(c=>c.id===category)?.label}` : 'All Products 🛒'}
          </h1>
          <p style={{ color: '#86efac', fontSize: 14 }}>{filtered.length} products found</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 50, padding: '10px 20px', gap: 10 }}>
          <span style={{ color: '#86efac', fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#fff', fontFamily: "'Poppins',sans-serif", width: 200 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0, minHeight: '80vh' }}>

        {/* Sidebar */}
        <div style={{ background: '#fff', borderRight: '1.5px solid #e8f2ea', padding: '24px 20px' }}>
          <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 17, fontWeight: 800, color: '#0a2e1a', marginBottom: 16 }}>Categories</h3>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 12, border: 'none', fontSize: 13.5, fontWeight: category===c.id?700:500, background: category===c.id?'#e6f4ec':'transparent', color: category===c.id?'#145530':'#4a6b50', cursor: 'pointer', marginBottom: 4, fontFamily: "'Poppins',sans-serif", transition: 'all 0.2s' }}>
              {category===c.id && '✓ '}{c.label}
            </button>
          ))}
          <div style={{ borderTop: '1.5px solid #e8f2ea', marginTop: 20, paddingTop: 20 }}>
            <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 17, fontWeight: 800, color: '#0a2e1a', marginBottom: 12 }}>Sort By</h3>
            {[['default','Default'],['low','Price: Low to High'],['high','Price: High to Low'],['name','Name A-Z']].map(([v,l]) => (
              <button key={v} onClick={() => setSort(v)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: sort===v?700:500, background: sort===v?'#e6f4ec':'transparent', color: sort===v?'#145530':'#4a6b50', cursor: 'pointer', marginBottom: 4, fontFamily: "'Poppins',sans-serif" }}>
                {sort===v && '✓ '}{l}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ padding: '24px 28px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <p style={{ fontFamily: "'Baloo 2',cursive", fontSize: 22, fontWeight: 800, color: '#0a2e1a', marginBottom: 12 }}>No products found!</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }} style={{ background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
              {filtered.map((p, i) => (
                <div key={p._id}
                  style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #e8f2ea', cursor: 'pointer', transition: 'all 0.25s', animation: `fadeUp 0.4s ${Math.min(i,8)*0.05}s ease both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 16px 36px rgba(20,85,48,0.14)'; e.currentTarget.style.borderColor='#a8d5b8'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#e8f2ea'; }}>
                  <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform='scale(1.08)'}
                      onMouseLeave={e => e.target.style.transform='scale(1)'} loading="lazy" />
                    <span style={{ position: 'absolute', top: 10, left: 10, background: '#145530', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 50 }}>{p.badge}</span>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0a2e1a', marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#6b8f71', marginBottom: 12, fontWeight: 500 }}>{p.quantity}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: "'Baloo 2',cursive", fontSize: 19, fontWeight: 800, color: '#145530' }}>₹{p.price}</span>
                      <button onClick={() => { addToCart(p); toast.success(`${p.name} added! 🛒`); }}
                        style={{ background: '#e6f4ec', color: '#145530', border: '2px solid #b8dfc6', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer', fontWeight: 800, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.target.style.background='#145530'; e.target.style.color='#fff'; e.target.style.transform='rotate(90deg)'; }}
                        onMouseLeave={e => { e.target.style.background='#e6f4ec'; e.target.style.color='#145530'; e.target.style.transform='rotate(0)'; }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}