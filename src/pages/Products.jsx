import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PRODUCTS = [
  {_id:'1',name:'Fresh Tomato',nameHindi:'ताज़ा टमाटर',quantity:'1 kg',price:35,mrp:45,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=300&h=200&fit=crop'},
  {_id:'2',name:'Green Spinach',nameHindi:'हरी पालक',quantity:'250 g',price:20,mrp:28,category:'vegetables',badge:'Organic',img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop'},
  {_id:'3',name:'Fresh Onion',nameHindi:'ताज़ा प्याज',quantity:'1 kg',price:28,mrp:35,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&h=200&fit=crop'},
  {_id:'4',name:'Potato',nameHindi:'आलू',quantity:'1 kg',price:25,mrp:32,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop'},
  {_id:'5',name:'Green Chilli',nameHindi:'हरी मिर्च',quantity:'100 g',price:15,mrp:22,category:'vegetables',badge:'Hot',img:'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=300&h=200&fit=crop'},
  {_id:'6',name:'Cauliflower',nameHindi:'गोभी',quantity:'1 piece',price:30,mrp:40,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=300&h=200&fit=crop'},
  {_id:'7',name:'Carrot',nameHindi:'गाजर',quantity:'500 g',price:22,mrp:30,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=200&fit=crop'},
  {_id:'8',name:'Cucumber',nameHindi:'खीरा',quantity:'500 g',price:18,mrp:25,category:'vegetables',badge:'Cool',img:'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=200&fit=crop'},
  {_id:'9',name:'Fresh Banana',nameHindi:'केला',quantity:'12 pcs',price:48,mrp:60,category:'fruits',badge:'Ripe',img:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop'},
  {_id:'10',name:'Red Apple',nameHindi:'सेब',quantity:'4 pcs',price:80,mrp:100,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop'},
  {_id:'11',name:'Sweet Orange',nameHindi:'संतरा',quantity:'4 pcs',price:60,mrp:75,category:'fruits',badge:'Juicy',img:'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=200&fit=crop'},
  {_id:'12',name:'Watermelon',nameHindi:'तरबूज',quantity:'1 piece',price:65,mrp:80,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=300&h=200&fit=crop'},
  {_id:'13',name:'Mango',nameHindi:'आम',quantity:'1 kg',price:90,mrp:120,category:'fruits',badge:'Season',img:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=200&fit=crop'},
  {_id:'14',name:'Papaya',nameHindi:'पपीता',quantity:'1 piece',price:55,mrp:70,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=300&h=200&fit=crop'},
  {_id:'15',name:'Full Cream Milk',nameHindi:'दूध',quantity:'500 ml',price:29,mrp:32,category:'dairy',badge:'Daily',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop'},
  {_id:'16',name:'Fresh Curd',nameHindi:'दही',quantity:'400 g',price:35,mrp:45,category:'dairy',badge:'Fresh',img:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop'},
  {_id:'17',name:'Paneer',nameHindi:'पनीर',quantity:'200 g',price:75,mrp:95,category:'dairy',badge:'Fresh',img:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop'},
  {_id:'18',name:'Butter',nameHindi:'मक्खन',quantity:'100 g',price:55,mrp:70,category:'dairy',badge:'Pure',img:'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=200&fit=crop'},
  {_id:'19',name:'Farm Eggs',nameHindi:'अंडे',quantity:'6 pcs',price:36,mrp:48,category:'dairy',badge:'Farm',img:'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=200&fit=crop'},
  {_id:'20',name:'Basmati Rice',nameHindi:'बासमती चावल',quantity:'1 kg',price:85,mrp:110,category:'grains',badge:'Premium',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=300&h=200&fit=crop'},
  {_id:'21',name:'Toor Dal',nameHindi:'तूर दाल',quantity:'500 g',price:60,mrp:75,category:'grains',badge:'Fresh',img:'https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=300&h=200&fit=crop'},
  {_id:'22',name:'Chana Dal',nameHindi:'चना दाल',quantity:'500 g',price:55,mrp:70,category:'grains',badge:'Pure',img:'https://images.unsplash.com/photo-1609501676725-7186f017a4b4?w=300&h=200&fit=crop'},
  {_id:'23',name:'Wheat Atta',nameHindi:'गेहूं का आटा',quantity:'5 kg',price:220,mrp:260,category:'grains',badge:'Best',img:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'},
  {_id:'24',name:'Moong Dal',nameHindi:'मूंग दाल',quantity:'500 g',price:65,mrp:80,category:'grains',badge:'Fresh',img:'https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=300&h=200&fit=crop'},
  {_id:'25',name:'Sugar',nameHindi:'चीनी',quantity:'1 kg',price:45,mrp:55,category:'grains',badge:'Pure',img:'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=300&h=200&fit=crop'},
  {_id:'26',name:'Poha',nameHindi:'पोहा',quantity:'500 g',price:30,mrp:40,category:'grains',badge:'Light',img:'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop'},
  {_id:'27',name:'Sunflower Oil',nameHindi:'सूरजमुखी तेल',quantity:'1 litre',price:145,mrp:175,category:'oil',badge:'Pure',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop'},
  {_id:'28',name:'Mustard Oil',nameHindi:'सरसों का तेल',quantity:'1 litre',price:160,mrp:190,category:'oil',badge:'Kachi Ghani',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop'},
  {_id:'29',name:'Turmeric Powder',nameHindi:'हल्दी',quantity:'100 g',price:28,mrp:40,category:'oil',badge:'Pure',img:'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=200&fit=crop'},
  {_id:'30',name:'Red Chilli Powder',nameHindi:'लाल मिर्च पाउडर',quantity:'100 g',price:32,mrp:45,category:'oil',badge:'Spicy',img:'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=300&h=200&fit=crop'},
  {_id:'31',name:'Garam Masala',nameHindi:'गरम मसाला',quantity:'50 g',price:35,mrp:50,category:'oil',badge:'Blend',img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop'},
  {_id:'32',name:'Salt',nameHindi:'नमक',quantity:'1 kg',price:22,mrp:28,category:'oil',badge:'Iodised',img:'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=300&h=200&fit=crop'},
  {_id:'33',name:'Coriander Powder',nameHindi:'धनिया पाउडर',quantity:'100 g',price:22,mrp:32,category:'oil',badge:'Fresh',img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop'},
  {_id:'34',name:'Parle-G Biscuits',nameHindi:'बिस्किट',quantity:'800 g',price:50,mrp:60,category:'snacks',badge:'Popular',img:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=200&fit=crop'},
  {_id:'35',name:'Namkeen Mix',nameHindi:'नमकीन',quantity:'200 g',price:30,mrp:40,category:'snacks',badge:'Crispy',img:'https://images.unsplash.com/photo-1575367439058-6096bb43d5d3?w=300&h=200&fit=crop'},
  {_id:'36',name:'Potato Chips',nameHindi:'चिप्स',quantity:'100 g',price:20,mrp:30,category:'snacks',badge:'Crunchy',img:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop'},
  {_id:'37',name:'Maggi Noodles',nameHindi:'मैगी नूडल्स',quantity:'4 pack',price:56,mrp:68,category:'snacks',badge:'Quick',img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&h=200&fit=crop'},
  {_id:'38',name:'Brown Bread',nameHindi:'ब्राउन ब्रेड',quantity:'400 g',price:42,mrp:55,category:'snacks',badge:'Fresh',img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop'},
  {_id:'39',name:'Roasted Peanuts',nameHindi:'भुनी मूंगफली',quantity:'200 g',price:25,mrp:35,category:'snacks',badge:'Protein',img:'https://images.unsplash.com/photo-1567892737950-30b3c38ae5e0?w=300&h=200&fit=crop'},
  {_id:'40',name:'Coca Cola',nameHindi:'कोका कोला',quantity:'750 ml',price:40,mrp:50,category:'drinks',badge:'Cold',img:'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop'},
  {_id:'41',name:'Sprite',nameHindi:'स्प्राइट',quantity:'750 ml',price:40,mrp:50,category:'drinks',badge:'Fresh',img:'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=300&h=200&fit=crop'},
  {_id:'42',name:'Mango Juice',nameHindi:'आम का जूस',quantity:'200 ml',price:20,mrp:28,category:'drinks',badge:'Fruity',img:'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=300&h=200&fit=crop'},
  {_id:'43',name:'Mineral Water',nameHindi:'पानी',quantity:'1 litre',price:20,mrp:25,category:'drinks',badge:'Pure',img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&h=200&fit=crop'},
  {_id:'44',name:'Lassi',nameHindi:'लस्सी',quantity:'200 ml',price:25,mrp:35,category:'drinks',badge:'Fresh',img:'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300&h=200&fit=crop'},
  {_id:'45',name:'Dettol Soap',nameHindi:'साबुन',quantity:'75 g',price:38,mrp:50,category:'household',badge:'Protect',img:'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=300&h=200&fit=crop'},
  {_id:'46',name:'Surf Excel',nameHindi:'सर्फ एक्सेल',quantity:'500 g',price:85,mrp:105,category:'household',badge:'Clean',img:'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=200&fit=crop'},
  {_id:'47',name:'Colgate Toothpaste',nameHindi:'टूथपेस्ट',quantity:'150 g',price:65,mrp:85,category:'household',badge:'Care',img:'https://images.unsplash.com/photo-1559591939-0e0e3e8b8a2d?w=300&h=200&fit=crop'},
  {_id:'48',name:'Dish Wash Bar',nameHindi:'बर्तन साबुन',quantity:'200 g',price:20,mrp:28,category:'household',badge:'Clean',img:'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=200&fit=crop'},
  {_id:'49',name:'Agarbatti',nameHindi:'अगरबत्ती',quantity:'20 sticks',price:15,mrp:22,category:'household',badge:'Fragrant',img:'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop'},
  {_id:'50',name:'Match Box',nameHindi:'माचिस',quantity:'1 box',price:5,mrp:8,category:'household',badge:'Daily',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'},
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
    (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nameHindi && p.nameHindi.includes(search))
    )
  );

  if (sort === 'low') filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === 'high') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === 'discount') filtered = [...filtered].sort((a,b) => ((b.mrp-b.price)/b.mrp) - ((a.mrp-a.price)/a.mrp));
  if (sort === 'name') filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div style={{ background:'#f5f9f6', minHeight:'80vh', fontFamily:"'Poppins',sans-serif" }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'28px 36px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:28, fontWeight:800, color:'#fff', marginBottom:4 }}>
              {search ? `"${search}" ke results` : category !== 'All' ? CATS.find(c=>c.id===category)?.label : 'Saare Products 🛒'}
            </h1>
            <p style={{ color:'#86efac', fontSize:14 }}>{filtered.length} products mile</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.25)', borderRadius:50, padding:'10px 18px', gap:10 }}>
            <span style={{ color:'#86efac', fontSize:16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search in English ya हिंदी में..."
              style={{ border:'none', outline:'none', background:'transparent', fontSize:14, color:'#fff', fontFamily:"'Poppins',sans-serif", width:220 }} />
            {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:16 }}>✕</button>}
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', minHeight:'80vh' }}>

        {/* Sidebar */}
        <div style={{ background:'#fff', borderRight:'1.5px solid #e8f2ea', padding:'20px 16px' }}>
          <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:800, color:'#0a2e1a', marginBottom:14 }}>Categories</h3>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 12px', borderRadius:10, border:'none', fontSize:13, fontWeight:category===c.id?700:500, background:category===c.id?'#e6f4ec':'transparent', color:category===c.id?'#145530':'#4a6b50', cursor:'pointer', marginBottom:3, fontFamily:"'Poppins',sans-serif", transition:'all 0.2s' }}>
              {category===c.id && '✓ '}{c.label}
            </button>
          ))}

          <div style={{ borderTop:'1.5px solid #e8f2ea', marginTop:16, paddingTop:16 }}>
            <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:800, color:'#0a2e1a', marginBottom:12 }}>Sort By</h3>
            {[['default','Default'],['low','Price: Low to High'],['high','Price: High to Low'],['discount','Max Discount'],['name','Name A-Z']].map(([v,l]) => (
              <button key={v} onClick={() => setSort(v)}
                style={{ display:'block', width:'100%', textAlign:'left', padding:'8px 12px', borderRadius:10, border:'none', fontSize:12.5, fontWeight:sort===v?700:500, background:sort===v?'#e6f4ec':'transparent', color:sort===v?'#145530':'#4a6b50', cursor:'pointer', marginBottom:3, fontFamily:"'Poppins',sans-serif" }}>
                {sort===v && '✓ '}{l}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ padding:'20px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 20px' }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
              <p style={{ fontFamily:"'Baloo 2',cursive", fontSize:22, fontWeight:800, color:'#0a2e1a', marginBottom:12 }}>
                "{search}" nahi mila!
              </p>
              <p style={{ color:'#6b8f71', marginBottom:20 }}>English ya हिंदी mein try karo</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }}
                style={{ background:'#145530', color:'#fff', border:'none', borderRadius:50, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
              {filtered.map((p, i) => {
                const discount = p.mrp > p.price ? Math.round(((p.mrp-p.price)/p.mrp)*100) : 0;
                return (
                  <div key={p._id}
                    style={{ background:'#fff', borderRadius:18, overflow:'hidden', border:'1.5px solid #e8f2ea', cursor:'pointer', transition:'all 0.25s', animation:`fadeUp 0.4s ${Math.min(i,8)*0.04}s ease both` }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 16px 36px rgba(20,85,48,0.14)'; e.currentTarget.style.borderColor='#a8d5b8'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#e8f2ea'; }}>

                    {/* Image */}
                    <div style={{ height:140, overflow:'hidden', position:'relative' }}>
                      <img src={p.img} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
                        onMouseEnter={e => e.target.style.transform='scale(1.08)'}
                        onMouseLeave={e => e.target.style.transform='scale(1)'} loading="lazy" />
                      <span style={{ position:'absolute', top:8, left:8, background:'#145530', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:50 }}>{p.badge}</span>
                      {discount >= 10 && (
                        <span style={{ position:'absolute', top:8, right:8, background:'#e24b4a', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 8px', borderRadius:50 }}>
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding:12 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:'#0a2e1a', marginBottom:1 }}>{p.name}</div>
                      {p.nameHindi && <div style={{ fontSize:11, color:'#6b8f71', marginBottom:2 }}>{p.nameHindi}</div>}
                      <div style={{ fontSize:11, color:'#6b8f71', marginBottom:10, fontWeight:500 }}>{p.quantity}</div>

                      {/* Price Tag */}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div>
                          <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                            <span style={{ fontFamily:"'Baloo 2',cursive", fontSize:19, fontWeight:800, color:'#145530' }}>₹{p.price}</span>
                            {p.mrp > p.price && (
                              <span style={{ fontSize:12, color:'#9ca3af', textDecoration:'line-through', fontWeight:500 }}>₹{p.mrp}</span>
                            )}
                          </div>
                          {discount > 0 && (
                            <div style={{ fontSize:10, color:'#22c55e', fontWeight:700 }}>
                              ₹{p.mrp-p.price} ki bachat!
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => { addToCart(p); toast.success(`${p.name} added! 🛒`); }}
                          style={{ background:'#e6f4ec', color:'#145530', border:'2px solid #b8dfc6', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, cursor:'pointer', fontWeight:800, transition:'all 0.2s', flexShrink:0 }}
                          onMouseEnter={e => { e.currentTarget.style.background='#145530'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='rotate(90deg)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='#e6f4ec'; e.currentTarget.style.color='#145530'; e.currentTarget.style.transform='rotate(0)'; }}>
                          +
                        </button>
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 200px 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          div[style*="padding: 28px 36px"] { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}