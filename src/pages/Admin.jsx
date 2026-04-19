import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';

const INITIAL_PRODUCTS = [
  {_id:'s1',name:'Fresh Tomato',price:35,mrp:45,stock:100,category:'vegetables',badge:'Fresh'},
  {_id:'s2',name:'Green Spinach',price:20,mrp:28,stock:80,category:'vegetables',badge:'Organic'},
  {_id:'s3',name:'Fresh Onion',price:28,mrp:35,stock:150,category:'vegetables',badge:'Fresh'},
  {_id:'s4',name:'Potato',price:25,mrp:32,stock:200,category:'vegetables',badge:'Fresh'},
  {_id:'s5',name:'Green Chilli',price:15,mrp:20,stock:60,category:'vegetables',badge:'Hot'},
  {_id:'s6',name:'Cauliflower',price:30,mrp:40,stock:45,category:'vegetables',badge:'Fresh'},
  {_id:'s7',name:'Carrot',price:22,mrp:30,stock:70,category:'vegetables',badge:'Fresh'},
  {_id:'s8',name:'Cucumber',price:18,mrp:25,stock:80,category:'vegetables',badge:'Cool'},
  {_id:'s9',name:'Fresh Banana',price:48,mrp:60,stock:90,category:'fruits',badge:'Ripe'},
  {_id:'s10',name:'Red Apple',price:80,mrp:100,stock:50,category:'fruits',badge:'Fresh'},
  {_id:'s11',name:'Sweet Orange',price:60,mrp:75,stock:60,category:'fruits',badge:'Juicy'},
  {_id:'s12',name:'Watermelon',price:65,mrp:80,stock:20,category:'fruits',badge:'Fresh'},
  {_id:'s13',name:'Mango',price:90,mrp:120,stock:40,category:'fruits',badge:'Season'},
  {_id:'s14',name:'Papaya',price:55,mrp:70,stock:35,category:'fruits',badge:'Fresh'},
  {_id:'s15',name:'Full Cream Milk',price:29,mrp:32,stock:120,category:'dairy',badge:'Daily'},
  {_id:'s16',name:'Fresh Curd',price:35,mrp:45,stock:80,category:'dairy',badge:'Fresh'},
  {_id:'s17',name:'Paneer',price:75,mrp:95,stock:30,category:'dairy',badge:'Fresh'},
  {_id:'s18',name:'Butter',price:55,mrp:70,stock:25,category:'dairy',badge:'Pure'},
  {_id:'s19',name:'Farm Eggs',price:36,mrp:48,stock:100,category:'dairy',badge:'Farm'},
  {_id:'s20',name:'Basmati Rice',price:85,mrp:110,stock:50,category:'grains',badge:'Premium'},
  {_id:'s21',name:'Toor Dal',price:60,mrp:75,stock:60,category:'grains',badge:'Fresh'},
  {_id:'s22',name:'Chana Dal',price:55,mrp:70,stock:55,category:'grains',badge:'Pure'},
  {_id:'s23',name:'Wheat Atta',price:220,mrp:260,stock:40,category:'grains',badge:'Best'},
  {_id:'s24',name:'Moong Dal',price:65,mrp:80,stock:45,category:'grains',badge:'Fresh'},
  {_id:'s25',name:'Sugar',price:45,mrp:55,stock:80,category:'grains',badge:'Pure'},
  {_id:'s26',name:'Poha',price:30,mrp:40,stock:60,category:'grains',badge:'Light'},
  {_id:'s27',name:'Sunflower Oil',price:145,mrp:175,stock:45,category:'oil',badge:'Pure'},
  {_id:'s28',name:'Mustard Oil',price:160,mrp:190,stock:40,category:'oil',badge:'Kachi Ghani'},
  {_id:'s29',name:'Turmeric Powder',price:28,mrp:40,stock:70,category:'oil',badge:'Pure'},
  {_id:'s30',name:'Red Chilli Powder',price:32,mrp:45,stock:65,category:'oil',badge:'Spicy'},
  {_id:'s31',name:'Garam Masala',price:35,mrp:50,stock:55,category:'oil',badge:'Blend'},
  {_id:'s32',name:'Salt',price:22,mrp:28,stock:90,category:'oil',badge:'Iodised'},
  {_id:'s33',name:'Coriander Powder',price:22,mrp:32,stock:60,category:'oil',badge:'Fresh'},
  {_id:'s34',name:'Parle-G Biscuits',price:50,mrp:60,stock:80,category:'snacks',badge:'Popular'},
  {_id:'s35',name:'Namkeen Mix',price:30,mrp:40,stock:70,category:'snacks',badge:'Crispy'},
  {_id:'s36',name:'Potato Chips',price:20,mrp:30,stock:90,category:'snacks',badge:'Crunchy'},
  {_id:'s37',name:'Maggi Noodles',price:56,mrp:68,stock:75,category:'snacks',badge:'Quick'},
  {_id:'s38',name:'Brown Bread',price:42,mrp:55,stock:40,category:'snacks',badge:'Fresh'},
  {_id:'s39',name:'Roasted Peanuts',price:25,mrp:35,stock:85,category:'snacks',badge:'Protein'},
  {_id:'s40',name:'Coca Cola',price:40,mrp:50,stock:60,category:'drinks',badge:'Cold'},
  {_id:'s41',name:'Sprite',price:40,mrp:50,stock:55,category:'drinks',badge:'Fresh'},
  {_id:'s42',name:'Mango Juice',price:20,mrp:28,stock:70,category:'drinks',badge:'Fruity'},
  {_id:'s43',name:'Mineral Water',price:20,mrp:25,stock:100,category:'drinks',badge:'Pure'},
  {_id:'s44',name:'Lassi',price:25,mrp:35,stock:40,category:'drinks',badge:'Fresh'},
  {_id:'s45',name:'Dettol Soap',price:38,mrp:50,stock:60,category:'household',badge:'Protect'},
  {_id:'s46',name:'Surf Excel',price:85,mrp:105,stock:45,category:'household',badge:'Clean'},
  {_id:'s47',name:'Colgate Toothpaste',price:65,mrp:85,stock:50,category:'household',badge:'Care'},
  {_id:'s48',name:'Dish Wash Bar',price:20,mrp:28,stock:70,category:'household',badge:'Clean'},
  {_id:'s49',name:'Agarbatti',price:15,mrp:22,stock:80,category:'household',badge:'Fragrant'},
  {_id:'s50',name:'Match Box',price:5,mrp:8,stock:120,category:'household',badge:'Daily'},
];

function ProductRow({ product, onSave }) {
  const [price, setPrice] = useState(product.price);
  const [mrp, setMrp] = useState(product.mrp || product.price);
  const [stock, setStock] = useState(product.stock);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <tr style={{ borderBottom: '1px solid #f0f7f2', background: parseInt(product._id.replace('s','')) % 2 === 0 ? '#fff' : '#fafffe' }}>
      <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#0a2e1a' }}>{product.name}</td>
      <td style={{ padding: '10px 16px', fontSize: 12, color: '#6b8f71' }}>{product.category}</td>
      <td style={{ padding: '10px 8px' }}>
        <input type="number" value={mrp} onChange={e => setMrp(Number(e.target.value))}
          style={{ width: 75, padding: '6px 8px', border: '1.5px solid #d0e8d8', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Poppins',sans-serif" }} />
      </td>
      <td style={{ padding: '10px 8px' }}>
        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
          style={{ width: 75, padding: '6px 8px', border: '1.5px solid #d0e8d8', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Poppins',sans-serif" }} />
        {discount > 0 && <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, marginTop: 2 }}>{discount}% OFF</div>}
      </td>
      <td style={{ padding: '10px 8px' }}>
        <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))}
          style={{ width: 75, padding: '6px 8px', border: `1.5px solid ${stock < 20 ? '#fca5a5' : '#d0e8d8'}`, borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Poppins',sans-serif" }} />
      </td>
      <td style={{ padding: '10px 8px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 50, background: stock <= 0 ? '#fee2e2' : stock < 20 ? '#fff7ed' : '#e6f4ec', color: stock <= 0 ? '#e24b4a' : stock < 20 ? '#f07c2a' : '#145530' }}>
          {stock <= 0 ? 'Out of Stock' : stock < 20 ? 'Low Stock' : 'In Stock'}
        </span>
      </td>
      <td style={{ padding: '10px 8px' }}>
        <button onClick={() => onSave(product._id, price, mrp, stock)}
          style={{ background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '6px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
          Save
        </button>
      </td>
    </tr>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [newProduct, setNewProduct] = useState({ name:'', price:'', mrp:'', stock:'', category:'vegetables', badge:'Fresh', quantity:'', nameHindi:'' });
  const [searchOrder, setSearchOrder] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders/all`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(data);
    } catch { toast.error('Orders load nahi hue — backend check karo'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API}/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Status: ${status} ✅`);
      fetchOrders();
    } catch { toast.error('Update fail hua'); }
  };

  const handleSaveProduct = (id, price, mrp, stock) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, price, mrp, stock } : p));
    toast.success('Saved! ✅ Products.jsx mein bhi same price update karo.');
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) { toast.error('Naam, price aur stock zaruri hai'); return; }
    const id = 's' + (products.length + 1);
    setProducts(prev => [...prev, { ...newProduct, _id: id, price: Number(newProduct.price), mrp: Number(newProduct.mrp || newProduct.price), stock: Number(newProduct.stock) }]);
    toast.success(`${newProduct.name} add ho gaya! ✅ Ab Products.jsx mein bhi manually add karo.`);
    setNewProduct({ name:'', price:'', mrp:'', stock:'', category:'vegetables', badge:'Fresh', quantity:'', nameHindi:'' });
  };

  const tabStyle = (active) => ({
    padding: '10px 20px', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'all 0.2s',
    background: active ? '#145530' : '#e6f4ec', color: active ? '#fff' : '#145530'
  });

  const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #d0e8d8', borderRadius: 12, fontSize: 13, outline: 'none', fontFamily: "'Poppins',sans-serif", background: '#f5f9f6', marginBottom: 10, boxSizing: 'border-box' };

  const STATUS_COLORS = { Placed:'#378ADD', Packed:'#BA7517', 'Out for Delivery':'#f07c2a', Delivered:'#145530', Cancelled:'#e24b4a' };
  const STEPS = ['Placed','Packed','Out for Delivery','Delivered'];

  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.grandTotal || o.total || 0), 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const lowStock = products.filter(p => p.stock < 20).length;

  const filteredOrders = orders.filter(o =>
    !searchOrder ||
    o.receiptNumber?.includes(searchOrder) ||
    o.address?.name?.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.address?.phone?.includes(searchOrder)
  );

  return (
    <div style={{ background: '#f5f9f6', minHeight: '100vh', fontFamily: "'Poppins',sans-serif" }}>

      <div style={{ background: 'linear-gradient(135deg,#0a2e1a,#145530)', padding: '24px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>👑 Admin Panel — Apni Dukan</h1>
          <p style={{ color: '#86efac', fontSize: 13 }}>Saari cheezein yahan se manage karo</p>
        </div>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 50, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
          ← Website Dekho
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, padding: '24px 36px 0' }}>
        {[
          ['📦','Total Orders', orders.length,'#145530'],
          ['📅','Aaj ke Orders', todayOrders,'#f07c2a'],
          ['💰','Total Revenue',`₹${totalRevenue.toLocaleString('en-IN')}`,'#145530'],
          ['⚠️','Low Stock Items', lowStock, lowStock > 0 ? '#e24b4a' : '#145530'],
        ].map(([icon,label,value,color]) => (
          <div key={label} style={{ background:'#fff', borderRadius:18, border:'1.5px solid #e8f2ea', padding:'20px' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
            <div style={{ fontSize:12, color:'#6b8f71', fontWeight:600, marginBottom:4 }}>{label}</div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:10, padding:'20px 36px 0', flexWrap:'wrap' }}>
        {[['orders','📦 Orders'],['stock','📊 Stock & Prices'],['add','➕ Add Product']].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(tab===t)}>{l}</button>
        ))}
      </div>

      <div style={{ padding:'20px 36px 40px' }}>

        {/* ORDERS */}
        {tab === 'orders' && (
          <div>
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:20, flexWrap:'wrap' }}>
              <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:22, fontWeight:800, color:'#0a2e1a', flex:1 }}>
                All Orders ({filteredOrders.length})
              </h2>
              <input placeholder="Search by name, phone, receipt..." value={searchOrder} onChange={e => setSearchOrder(e.target.value)}
                style={{ padding:'9px 16px', border:'1.5px solid #d0e8d8', borderRadius:50, fontSize:13, outline:'none', fontFamily:"'Poppins',sans-serif", width:260, background:'#fff' }} />
              <button onClick={fetchOrders} style={{ background:'#e6f4ec', color:'#145530', border:'1.5px solid #b8dfc6', borderRadius:50, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer' }}>🔄 Refresh</button>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px', background:'#fff', borderRadius:20 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                <p style={{ color:'#6b8f71', fontSize:16 }}>Abhi koi order nahi hai</p>
              </div>
            ) : filteredOrders.map(order => (
              <div key={order._id} style={{ background:'#fff', borderRadius:20, border:'1.5px solid #e8f2ea', padding:'22px', marginBottom:16, boxShadow:'0 2px 12px rgba(20,85,48,0.05)' }}>

                {/* Order Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, flexWrap:'wrap', gap:8 }}>
                  <div>
                    <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#0a2e1a' }}>
                      Order #{order.receiptNumber || order._id.slice(-6).toUpperCase()}
                    </div>
                    <div style={{ fontSize:12, color:'#6b8f71', marginTop:3 }}>
                      {new Date(order.createdAt).toLocaleString('en-IN',{ day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <span style={{ fontSize:12, fontWeight:700, padding:'5px 14px', borderRadius:50, background:STATUS_COLORS[order.status]+'20', color:STATUS_COLORS[order.status], border:`1.5px solid ${STATUS_COLORS[order.status]}40` }}>
                      {order.status}
                    </span>
                    <span style={{ fontSize:12, fontWeight:600, padding:'5px 12px', borderRadius:50, background:'#f5f9f6', color:'#4a6b50' }}>
                      {order.paymentMethod} — {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Customer + Address */}
                <div style={{ background:'#f5f9f6', borderRadius:14, padding:'14px 18px', marginBottom:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <div style={{ fontSize:11, color:'#6b8f71', fontWeight:700, marginBottom:6, letterSpacing:1 }}>👤 CUSTOMER</div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#0a2e1a' }}>{order.address?.name || order.user?.name}</div>
                    <a href={`tel:${order.address?.phone}`} style={{ fontSize:13, color:'#145530', fontWeight:700, textDecoration:'none', display:'block', marginTop:4 }}>
                      📞 {order.address?.phone}
                    </a>
                    {order.user?.email && <div style={{ fontSize:12, color:'#6b8f71', marginTop:3 }}>{order.user.email}</div>}
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'#6b8f71', fontWeight:700, marginBottom:6, letterSpacing:1 }}>📍 DELIVERY ADDRESS</div>
                    <div style={{ fontSize:13, color:'#0a2e1a', lineHeight:1.7 }}>
                      {order.address?.street}
                      {order.address?.landmark ? `, ${order.address.landmark}` : ''}<br />
                      {order.address?.city} — {order.address?.pincode}
                    </div>
                    {order.address?.location?.lat && (
                      <a href={`https://maps.google.com/?q=${order.address.location.lat},${order.address.location.lng}`}
                        target="_blank" rel="noreferrer"
                        style={{ fontSize:11, color:'#145530', fontWeight:700, textDecoration:'none', display:'inline-block', marginTop:4 }}>
                        🗺️ Google Maps par Dekho
                      </a>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom:14 }}>
                  {order.items?.map((item,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'6px 0', borderBottom:'1px solid #f0f7f2' }}>
                      <span style={{ color:'#0a2e1a', fontWeight:500 }}>{item.name} <span style={{ color:'#6b8f71' }}>× {item.qty}</span></span>
                      <span style={{ fontWeight:700, color:'#145530', fontFamily:"'Baloo 2',cursive" }}>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:17, marginTop:10, fontFamily:"'Baloo 2',cursive", color:'#0a2e1a', paddingTop:8, borderTop:'2px solid #e8f2ea' }}>
                    <span>Grand Total</span>
                    <span style={{ color:'#145530' }}>₹{order.grandTotal || order.total}</span>
                  </div>
                </div>

                {/* Status Buttons */}
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'#6b8f71', fontWeight:600 }}>Update:</span>
                  {STEPS.map(s => (
                    <button key={s} onClick={() => updateOrderStatus(order._id, s)}
                      style={{ background:order.status===s?STATUS_COLORS[s]:'#f5f9f6', color:order.status===s?'#fff':'#4a6b50', border:`1.5px solid ${order.status===s?STATUS_COLORS[s]:'#e8f2ea'}`, borderRadius:50, padding:'6px 14px', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", transition:'all 0.2s' }}>
                      {s}
                    </button>
                  ))}
                  <button onClick={() => updateOrderStatus(order._id,'Cancelled')}
                    style={{ background:order.status==='Cancelled'?'#e24b4a':'#fff0f0', color:order.status==='Cancelled'?'#fff':'#e24b4a', border:'1.5px solid #fca5a5', borderRadius:50, padding:'6px 14px', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif" }}>
                    Cancel
                  </button>
                  <a href={`https://wa.me/91${(order.address?.phone||'').replace(/\D/g,'').slice(-10)}?text=${encodeURIComponent(`Namaste ${order.address?.name}! Aapka Apni Dukan order #${order.receiptNumber||order._id.slice(-6).toUpperCase()} ka status: ${order.status}. Total: ₹${order.grandTotal||order.total}`)}`}
                    target="_blank" rel="noreferrer"
                    style={{ marginLeft:'auto', background:'#25D366', color:'#fff', borderRadius:50, padding:'6px 16px', textDecoration:'none', fontSize:11, fontWeight:700 }}>
                    💬 WhatsApp Customer
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STOCK & PRICES */}
        {tab === 'stock' && (
          <div>
            <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:22, fontWeight:800, color:'#0a2e1a', marginBottom:16 }}>
              📊 Stock & Price Management
            </h2>
            {products.filter(p => p.stock < 20).length > 0 && (
              <div style={{ background:'#fee2e2', border:'1.5px solid #fca5a5', borderRadius:14, padding:'12px 18px', marginBottom:16, fontSize:13, color:'#e24b4a', fontWeight:600 }}>
                ⚠️ Low Stock: {products.filter(p => p.stock < 20).map(p => p.name).join(', ')}
              </div>
            )}
            <div style={{ overflowX:'auto', borderRadius:16, border:'1.5px solid #e8f2ea' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', background:'#fff' }}>
                <thead>
                  <tr style={{ background:'#145530' }}>
                    {['Product','Category','MRP (₹)','Sale Price (₹)','Stock','Status','Action'].map(h => (
                      <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:12, fontWeight:700, color:'#fff', fontFamily:"'Poppins',sans-serif", whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <ProductRow key={p._id} product={p} onSave={handleSaveProduct} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD PRODUCT */}
        {tab === 'add' && (
          <div style={{ maxWidth:600 }}>
            <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:22, fontWeight:800, color:'#0a2e1a', marginBottom:20 }}>➕ Naya Product Add Karo</h2>
            <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #e8f2ea', padding:'28px' }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#6b8f71', display:'block', marginBottom:4 }}>Product Naam (English) *</label>
              <input style={inp} placeholder="jaise Fresh Tomato" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name:e.target.value})} />

              <label style={{ fontSize:12, fontWeight:600, color:'#6b8f71', display:'block', marginBottom:4 }}>Product Naam (Hindi)</label>
              <input style={inp} placeholder="jaise ताज़ा टमाटर" value={newProduct.nameHindi} onChange={e => setNewProduct({...newProduct, nameHindi:e.target.value})} />

              <label style={{ fontSize:12, fontWeight:600, color:'#6b8f71', display:'block', marginBottom:4 }}>Quantity</label>
              <input style={inp} placeholder="jaise 1 kg, 500 g, 6 pcs" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity:e.target.value})} />

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'#6b8f71', display:'block', marginBottom:4 }}>MRP (₹) *</label>
                  <input type="number" style={inp} placeholder="45" value={newProduct.mrp} onChange={e => setNewProduct({...newProduct, mrp:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'#6b8f71', display:'block', marginBottom:4 }}>Sale Price (₹) *</label>
                  <input type="number" style={inp} placeholder="35" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price:e.target.value})} />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'#6b8f71', display:'block', marginBottom:4 }}>Stock (units) *</label>
                  <input type="number" style={inp} placeholder="100" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'#6b8f71', display:'block', marginBottom:4 }}>Badge</label>
                  <input style={inp} placeholder="Fresh, New, Hot, Sale" value={newProduct.badge} onChange={e => setNewProduct({...newProduct, badge:e.target.value})} />
                </div>
              </div>

              <label style={{ fontSize:12, fontWeight:600, color:'#6b8f71', display:'block', marginBottom:4 }}>Category *</label>
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category:e.target.value})}
                style={{ ...inp, cursor:'pointer' }}>
                {['vegetables','fruits','dairy','grains','oil','snacks','drinks','household'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                ))}
              </select>

              {newProduct.price && newProduct.mrp && Number(newProduct.mrp) > Number(newProduct.price) && (
                <div style={{ background:'#e6f4ec', borderRadius:12, padding:'12px 16px', marginBottom:12, fontSize:13, color:'#145530', fontWeight:600 }}>
                  ✅ Customer ko {Math.round(((newProduct.mrp-newProduct.price)/newProduct.mrp)*100)}% discount milega — ₹{newProduct.mrp-newProduct.price} ki bachat!
                </div>
              )}

              <button onClick={handleAddProduct}
                style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'14px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif" }}>
                ➕ Product Add Karo
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          div[style*="padding: 24px 36px"] { padding: 16px !important; }
          div[style*="padding: 20px 36px"] { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}