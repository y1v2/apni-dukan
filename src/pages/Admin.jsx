import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';

const DEFAULT_PRODUCTS = [
  {_id:'1',name:'Fresh Tomato',nameHindi:'ताज़ा टमाटर',price:35,mrp:45,stock:100,category:'vegetables',badge:'Fresh',quantity:'1 kg'},
  {_id:'2',name:'Green Spinach',nameHindi:'हरी पालक',price:20,mrp:28,stock:80,category:'vegetables',badge:'Organic',quantity:'250 g'},
  {_id:'3',name:'Fresh Onion',nameHindi:'ताज़ा प्याज',price:28,mrp:35,stock:150,category:'vegetables',badge:'Fresh',quantity:'1 kg'},
  {_id:'4',name:'Potato',nameHindi:'आलू',price:25,mrp:32,stock:200,category:'vegetables',badge:'Fresh',quantity:'1 kg'},
  {_id:'5',name:'Green Chilli',nameHindi:'हरी मिर्च',price:15,mrp:22,stock:60,category:'vegetables',badge:'Hot',quantity:'100 g'},
  {_id:'6',name:'Cauliflower',nameHindi:'गोभी',price:30,mrp:40,stock:45,category:'vegetables',badge:'Fresh',quantity:'1 piece'},
  {_id:'7',name:'Carrot',nameHindi:'गाजर',price:22,mrp:30,stock:70,category:'vegetables',badge:'Fresh',quantity:'500 g'},
  {_id:'8',name:'Cucumber',nameHindi:'खीरा',price:18,mrp:25,stock:80,category:'vegetables',badge:'Cool',quantity:'500 g'},
  {_id:'9',name:'Fresh Banana',nameHindi:'केला',price:48,mrp:60,stock:90,category:'fruits',badge:'Ripe',quantity:'12 pcs'},
  {_id:'10',name:'Red Apple',nameHindi:'सेब',price:80,mrp:100,stock:50,category:'fruits',badge:'Fresh',quantity:'4 pcs'},
  {_id:'11',name:'Sweet Orange',nameHindi:'संतरा',price:60,mrp:75,stock:60,category:'fruits',badge:'Juicy',quantity:'4 pcs'},
  {_id:'12',name:'Watermelon',nameHindi:'तरबूज',price:65,mrp:80,stock:20,category:'fruits',badge:'Fresh',quantity:'1 piece'},
  {_id:'13',name:'Mango',nameHindi:'आम',price:90,mrp:120,stock:40,category:'fruits',badge:'Season',quantity:'1 kg'},
  {_id:'14',name:'Papaya',nameHindi:'पपीता',price:55,mrp:70,stock:35,category:'fruits',badge:'Fresh',quantity:'1 piece'},
  {_id:'15',name:'Full Cream Milk',nameHindi:'दूध',price:29,mrp:32,stock:120,category:'dairy',badge:'Daily',quantity:'500 ml'},
  {_id:'16',name:'Fresh Curd',nameHindi:'दही',price:35,mrp:45,stock:80,category:'dairy',badge:'Fresh',quantity:'400 g'},
  {_id:'17',name:'Paneer',nameHindi:'पनीर',price:75,mrp:95,stock:30,category:'dairy',badge:'Fresh',quantity:'200 g'},
  {_id:'18',name:'Butter',nameHindi:'मक्खन',price:55,mrp:70,stock:25,category:'dairy',badge:'Pure',quantity:'100 g'},
  {_id:'19',name:'Farm Eggs',nameHindi:'अंडे',price:36,mrp:48,stock:100,category:'dairy',badge:'Farm',quantity:'6 pcs'},
  {_id:'20',name:'Basmati Rice',nameHindi:'बासमती चावल',price:85,mrp:110,stock:50,category:'grains',badge:'Premium',quantity:'1 kg'},
  {_id:'21',name:'Toor Dal',nameHindi:'तूर दाल',price:60,mrp:75,stock:60,category:'grains',badge:'Fresh',quantity:'500 g'},
  {_id:'22',name:'Chana Dal',nameHindi:'चना दाल',price:55,mrp:70,stock:55,category:'grains',badge:'Pure',quantity:'500 g'},
  {_id:'23',name:'Wheat Atta',nameHindi:'गेहूं का आटा',price:220,mrp:260,stock:40,category:'grains',badge:'Best',quantity:'5 kg'},
  {_id:'24',name:'Moong Dal',nameHindi:'मूंग दाल',price:65,mrp:80,stock:45,category:'grains',badge:'Fresh',quantity:'500 g'},
  {_id:'25',name:'Sugar',nameHindi:'चीनी',price:45,mrp:55,stock:80,category:'grains',badge:'Pure',quantity:'1 kg'},
  {_id:'26',name:'Poha',nameHindi:'पोहा',price:30,mrp:40,stock:60,category:'grains',badge:'Light',quantity:'500 g'},
  {_id:'27',name:'Sunflower Oil',nameHindi:'सूरजमुखी तेल',price:145,mrp:175,stock:45,category:'oil',badge:'Pure',quantity:'1 litre'},
  {_id:'28',name:'Mustard Oil',nameHindi:'सरसों का तेल',price:160,mrp:190,stock:40,category:'oil',badge:'Kachi Ghani',quantity:'1 litre'},
  {_id:'29',name:'Turmeric Powder',nameHindi:'हल्दी',price:28,mrp:40,stock:70,category:'oil',badge:'Pure',quantity:'100 g'},
  {_id:'30',name:'Red Chilli Powder',nameHindi:'लाल मिर्च',price:32,mrp:45,stock:65,category:'oil',badge:'Spicy',quantity:'100 g'},
  {_id:'31',name:'Garam Masala',nameHindi:'गरम मसाला',price:35,mrp:50,stock:55,category:'oil',badge:'Blend',quantity:'50 g'},
  {_id:'32',name:'Salt',nameHindi:'नमक',price:22,mrp:28,stock:90,category:'oil',badge:'Iodised',quantity:'1 kg'},
  {_id:'33',name:'Coriander Powder',nameHindi:'धनिया पाउडर',price:22,mrp:32,stock:60,category:'oil',badge:'Fresh',quantity:'100 g'},
  {_id:'34',name:'Parle-G Biscuits',nameHindi:'बिस्किट',price:50,mrp:60,stock:80,category:'snacks',badge:'Popular',quantity:'800 g'},
  {_id:'35',name:'Namkeen Mix',nameHindi:'नमकीन',price:30,mrp:40,stock:70,category:'snacks',badge:'Crispy',quantity:'200 g'},
  {_id:'36',name:'Potato Chips',nameHindi:'चिप्स',price:20,mrp:30,stock:90,category:'snacks',badge:'Crunchy',quantity:'100 g'},
  {_id:'37',name:'Maggi Noodles',nameHindi:'मैगी',price:56,mrp:68,stock:75,category:'snacks',badge:'Quick',quantity:'4 pack'},
  {_id:'38',name:'Brown Bread',nameHindi:'ब्रेड',price:42,mrp:55,stock:40,category:'snacks',badge:'Fresh',quantity:'400 g'},
  {_id:'39',name:'Roasted Peanuts',nameHindi:'मूंगफली',price:25,mrp:35,stock:85,category:'snacks',badge:'Protein',quantity:'200 g'},
  {_id:'40',name:'Coca Cola',nameHindi:'कोका कोला',price:40,mrp:50,stock:60,category:'drinks',badge:'Cold',quantity:'750 ml'},
  {_id:'41',name:'Sprite',nameHindi:'स्प्राइट',price:40,mrp:50,stock:55,category:'drinks',badge:'Fresh',quantity:'750 ml'},
  {_id:'42',name:'Mango Juice',nameHindi:'आम का जूस',price:20,mrp:28,stock:70,category:'drinks',badge:'Fruity',quantity:'200 ml'},
  {_id:'43',name:'Mineral Water',nameHindi:'पानी',price:20,mrp:25,stock:100,category:'drinks',badge:'Pure',quantity:'1 litre'},
  {_id:'44',name:'Lassi',nameHindi:'लस्सी',price:25,mrp:35,stock:40,category:'drinks',badge:'Fresh',quantity:'200 ml'},
  {_id:'45',name:'Dettol Soap',nameHindi:'साबुन',price:38,mrp:50,stock:60,category:'household',badge:'Protect',quantity:'75 g'},
  {_id:'46',name:'Surf Excel',nameHindi:'सर्फ एक्सेल',price:85,mrp:105,stock:45,category:'household',badge:'Clean',quantity:'500 g'},
  {_id:'47',name:'Colgate Toothpaste',nameHindi:'टूथपेस्ट',price:65,mrp:85,stock:50,category:'household',badge:'Care',quantity:'150 g'},
  {_id:'48',name:'Dish Wash Bar',nameHindi:'बर्तन साबुन',price:20,mrp:28,stock:70,category:'household',badge:'Clean',quantity:'200 g'},
  {_id:'49',name:'Agarbatti',nameHindi:'अगरबत्ती',price:15,mrp:22,stock:80,category:'household',badge:'Fragrant',quantity:'20 sticks'},
  {_id:'50',name:'Match Box',nameHindi:'माचिस',price:5,mrp:8,stock:120,category:'household',badge:'Daily',quantity:'1 box'},
];

const DEFAULT_COUPONS = [
  { code: 'APNI50', type: 'flat', value: 50, minOrder: 199, active: true, usageLimit: 100, used: 0 },
  { code: 'SAVE10', type: 'percent', value: 10, minOrder: 299, active: true, usageLimit: 50, used: 0 },
  { code: 'WELCOME', type: 'flat', value: 30, minOrder: 149, active: true, usageLimit: 200, used: 0 },
];

function getStoredProducts() {
  try {
    const s = localStorage.getItem('apnidukan_products');
    return s ? JSON.parse(s) : DEFAULT_PRODUCTS;
  } catch (e) { return DEFAULT_PRODUCTS; }
}
function getStoredCoupons() {
  try {
    const s = localStorage.getItem('apnidukan_coupons');
    return s ? JSON.parse(s) : DEFAULT_COUPONS;
  } catch (e) { return DEFAULT_COUPONS; }
}
function saveProducts(arr) { localStorage.setItem('apnidukan_products', JSON.stringify(arr)); }
function saveCoupons(arr) { localStorage.setItem('apnidukan_coupons', JSON.stringify(arr)); }

// ✅ ProductRow is outside Admin — no hooks inside loops
function ProductRow({ product, onSave }) {
  const [price, setPrice] = useState(product.price);
  const [mrp, setMrp] = useState(product.mrp || product.price);
  const [stock, setStock] = useState(product.stock);
  const [badge, setBadge] = useState(product.badge || 'Fresh');
  const [changed, setChanged] = useState(false);
  const disc = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const iStyle = { width: 68, padding: '5px 7px', border: '1.5px solid #d0e8d8', borderRadius: 8, fontSize: 12, outline: 'none', fontFamily: 'Poppins, sans-serif' };

  return (
    <tr style={{ borderBottom: '1px solid #f0f7f2', background: changed ? '#fffbeb' : '#fff' }}>
      <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#0a2e1a' }}>
        <div>{product.name}</div>
        {product.nameHindi && <div style={{ fontSize: 10, color: '#6b8f71' }}>{product.nameHindi}</div>}
      </td>
      <td style={{ padding: '8px 8px', fontSize: 11, color: '#6b8f71' }}>{product.category}</td>
      <td style={{ padding: '8px 5px' }}>
        <input type="number" value={mrp} onChange={(e) => { setMrp(Number(e.target.value)); setChanged(true); }} style={iStyle} />
      </td>
      <td style={{ padding: '8px 5px' }}>
        <input type="number" value={price} onChange={(e) => { setPrice(Number(e.target.value)); setChanged(true); }} style={{ ...iStyle, borderColor: changed ? '#f07c2a' : '#d0e8d8' }} />
        {disc > 0 && <div style={{ fontSize: 9, color: '#22c55e', fontWeight: 700 }}>{disc}% OFF</div>}
      </td>
      <td style={{ padding: '8px 5px' }}>
        <input type="number" value={stock} onChange={(e) => { setStock(Number(e.target.value)); setChanged(true); }} style={{ ...iStyle, borderColor: stock < 20 ? '#fca5a5' : '#d0e8d8' }} />
      </td>
      <td style={{ padding: '8px 5px' }}>
        <input value={badge} onChange={(e) => { setBadge(e.target.value); setChanged(true); }} style={{ ...iStyle, width: 75 }} />
      </td>
      <td style={{ padding: '8px 5px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: stock <= 0 ? '#fee2e2' : stock < 20 ? '#fff7ed' : '#e6f4ec', color: stock <= 0 ? '#e24b4a' : stock < 20 ? '#f07c2a' : '#145530' }}>
          {stock <= 0 ? 'Out' : stock < 20 ? 'Low' : 'OK'}
        </span>
      </td>
      <td style={{ padding: '8px 5px' }}>
        <button
          onClick={() => { onSave(product._id, { price, mrp, stock, badge }); setChanged(false); }}
          style={{ background: changed ? '#f07c2a' : '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
        >
          {changed ? 'Save!' : 'OK'}
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
  const [products, setProducts] = useState(getStoredProducts());
  const [coupons, setCoupons] = useState(getStoredCoupons());
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', nameHindi: '', price: '', mrp: '', stock: '', category: 'vegetables', badge: 'Fresh', quantity: '', img: '' });
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'flat', value: '', minOrder: '', usageLimit: '' });

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');
    if (!auth || !authTime || Date.now() - Number(authTime) > 8 * 60 * 60 * 1000) {
      navigate('/admin-login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(API + '/orders/all', { headers: { Authorization: 'Bearer ' + token } });
      setOrders(data);
    } catch (e) {
      console.log('Backend not available');
      setOrders([]);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(API + '/orders/' + id + '/status', { status }, { headers: { Authorization: 'Bearer ' + token } });
      toast.success('Status: ' + status + ' ✅');
      fetchOrders();
    } catch (e) { toast.error('Update fail'); }
  };

  const handleSaveProduct = (id, updates) => {
    const updated = products.map((p) => p._id === id ? { ...p, ...updates } : p);
    setProducts(updated);
    saveProducts(updated);
    toast.success('✅ Main website pe bhi update ho gaya!');
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) { toast.error('Naam, price aur stock zaruri hai'); return; }
    const id = String(products.length + 51);
    const p = { ...newProduct, _id: id, price: Number(newProduct.price), mrp: Number(newProduct.mrp || newProduct.price), stock: Number(newProduct.stock) };
    const updated = [...products, p];
    setProducts(updated);
    saveProducts(updated);
    toast.success(newProduct.name + ' add ho gaya! ✅');
    setNewProduct({ name: '', nameHindi: '', price: '', mrp: '', stock: '', category: 'vegetables', badge: 'Fresh', quantity: '', img: '' });
  };

  const addCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) { toast.error('Code aur value zaruri hai'); return; }
    if (coupons.find((c) => c.code.toUpperCase() === newCoupon.code.toUpperCase())) { toast.error('Yeh code pehle se hai'); return; }
    const updated = [...coupons, { ...newCoupon, code: newCoupon.code.toUpperCase(), value: Number(newCoupon.value), minOrder: Number(newCoupon.minOrder || 0), usageLimit: Number(newCoupon.usageLimit || 999), used: 0, active: true }];
    setCoupons(updated);
    saveCoupons(updated);
    toast.success('Coupon ' + newCoupon.code.toUpperCase() + ' create ho gaya! ✅');
    setNewCoupon({ code: '', type: 'flat', value: '', minOrder: '', usageLimit: '' });
  };

  const toggleCoupon = (code) => {
    const updated = coupons.map((c) => c.code === code ? { ...c, active: !c.active } : c);
    setCoupons(updated);
    saveCoupons(updated);
    toast.success('Updated!');
  };

  const deleteCoupon = (code) => {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    saveCoupons(updated);
    toast.success('Deleted!');
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    navigate('/admin-login');
  };

  const tabBtn = (active) => ({ padding: '8px 16px', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', background: active ? '#145530' : '#e6f4ec', color: active ? '#fff' : '#145530' });
  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #d0e8d8', borderRadius: 10, fontSize: 12, outline: 'none', fontFamily: 'Poppins, sans-serif', background: '#f5f9f6', marginBottom: 8, boxSizing: 'border-box' };

  const STATUS_COLORS = { Placed: '#378ADD', Packed: '#BA7517', 'Out for Delivery': '#f07c2a', Delivered: '#145530', Cancelled: '#e24b4a' };
  const STEPS = ['Placed', 'Packed', 'Out for Delivery', 'Delivered'];

  const totalRevenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + (o.grandTotal || o.total || 0), 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const lowStock = products.filter((p) => p.stock < 20).length;

  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.nameHindi && p.nameHindi.includes(productSearch)) || p.category.includes(q);
  });

  const filteredOrders = orders.filter((o) => {
    if (!orderSearch) return true;
    const q = orderSearch.toLowerCase();
    return (o.receiptNumber && o.receiptNumber.includes(orderSearch)) || (o.address && o.address.name && o.address.name.toLowerCase().includes(q)) || (o.address && o.address.phone && o.address.phone.includes(orderSearch));
  });

  return (
    <div style={{ background: '#f5f9f6', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a2e1a, #145530)', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#fff' }}>👑 Admin Panel — Apni Dukan</h1>
          <p style={{ color: '#86efac', fontSize: 11, marginTop: 2 }}>Saari cheezein yahan se manage karo</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 50, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🏠 Website</button>
          <button onClick={logout} style={{ background: '#fee2e2', color: '#e24b4a', border: 'none', borderRadius: 50, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '16px 24px 0' }}>
        {[['📦', 'Total Orders', orders.length, '#145530'], ['📅', 'Aaj ke Orders', todayOrders, '#f07c2a'], ['💰', 'Revenue', 'Rs.' + totalRevenue.toLocaleString('en-IN'), '#145530'], ['⚠️', 'Low Stock', lowStock, lowStock > 0 ? '#e24b4a' : '#145530']].map(([icon, label, value, color]) => (
          <div key={label} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e8f2ea', padding: '14px' }}>
            <div style={{ fontSize: 22, marginBottom: 5 }}>{icon}</div>
            <div style={{ fontSize: 11, color: '#6b8f71', fontWeight: 600, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {lowStock > 0 && (
        <div style={{ margin: '12px 24px 0', background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#e24b4a', fontWeight: 600 }}>
          ⚠️ Low Stock: {products.filter((p) => p.stock < 20).slice(0, 5).map((p) => p.name).join(', ')}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 24px 0', flexWrap: 'wrap' }}>
        {[['orders', '📦 Orders'], ['stock', '📊 Stock & Prices'], ['add', '➕ Add Product'], ['coupons', '🎟️ Coupons']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={tabBtn(tab === t)}>{l}</button>
        ))}
      </div>

      <div style={{ padding: '14px 24px 40px' }}>

        {/* ORDERS */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', flex: 1 }}>Orders ({filteredOrders.length})</h2>
              <input placeholder="Name, phone, receipt..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} style={{ padding: '8px 14px', border: '1.5px solid #d0e8d8', borderRadius: 50, fontSize: 12, outline: 'none', fontFamily: 'Poppins, sans-serif', width: 240, background: '#fff' }} />
              <button onClick={fetchOrders} style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🔄</button>
            </div>

            {filteredOrders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                <p style={{ color: '#6b8f71' }}>Koi order nahi mila</p>
              </div>
            )}

            {filteredOrders.map((order) => (
              <div key={order._id} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8f2ea', padding: '16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#0a2e1a' }}>#{order.receiptNumber || order._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: '#6b8f71' }}>{new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 50, background: (STATUS_COLORS[order.status] || '#888') + '20', color: STATUS_COLORS[order.status] || '#888' }}>{order.status}</span>
                    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 50, background: '#f5f9f6', color: '#4a6b50', fontWeight: 600 }}>{order.paymentMethod}</span>
                  </div>
                </div>

                <div style={{ background: '#f5f9f6', borderRadius: 10, padding: '10px 12px', marginBottom: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 9, color: '#6b8f71', fontWeight: 700, marginBottom: 3 }}>👤 CUSTOMER</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2e1a' }}>{order.address ? order.address.name : 'N/A'}</div>
                    {order.address && order.address.phone && (
                      <a href={'tel:' + order.address.phone} style={{ fontSize: 11, color: '#145530', fontWeight: 700, textDecoration: 'none' }}>📞 {order.address.phone}</a>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: '#6b8f71', fontWeight: 700, marginBottom: 3 }}>📍 ADDRESS</div>
                    <div style={{ fontSize: 11, color: '#0a2e1a', lineHeight: 1.5 }}>
                      {order.address ? order.address.street : ''}{order.address && order.address.landmark ? ', ' + order.address.landmark : ''}<br />
                      {order.address ? order.address.city : ''} — {order.address ? order.address.pincode : ''}
                    </div>
                    {order.address && order.address.location && order.address.location.lat && (
                      <a href={'https://maps.google.com/?q=' + order.address.location.lat + ',' + order.address.location.lng} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#145530', fontWeight: 700, textDecoration: 'none' }}>🗺️ Map</a>
                    )}
                  </div>
                </div>

                {order.items && order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderBottom: '1px solid #f0f7f2' }}>
                    <span>{item.name} <span style={{ color: '#6b8f71' }}>x{item.qty}</span></span>
                    <span style={{ fontWeight: 700, color: '#145530' }}>Rs.{item.price * item.qty}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 14, marginTop: 8, fontFamily: 'Baloo 2, cursive', color: '#0a2e1a' }}>
                  <span>Total</span><span style={{ color: '#145530' }}>Rs.{order.grandTotal || order.total}</span>
                </div>

                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid #f0f7f2' }}>
                  <span style={{ fontSize: 10, color: '#6b8f71', fontWeight: 600 }}>Update:</span>
                  {STEPS.map((s) => (
                    <button key={s} onClick={() => updateOrderStatus(order._id, s)} style={{ background: order.status === s ? (STATUS_COLORS[s] || '#888') : '#f5f9f6', color: order.status === s ? '#fff' : '#4a6b50', border: '1.5px solid ' + (order.status === s ? (STATUS_COLORS[s] || '#888') : '#e8f2ea'), borderRadius: 50, padding: '4px 10px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>
                      {s}
                    </button>
                  ))}
                  <button onClick={() => updateOrderStatus(order._id, 'Cancelled')} style={{ background: '#fff0f0', color: '#e24b4a', border: '1.5px solid #fca5a5', borderRadius: 50, padding: '4px 9px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <a href={'https://wa.me/91' + (order.address && order.address.phone ? order.address.phone.replace(/\D/g, '').slice(-10) : '') + '?text=' + encodeURIComponent('Namaste ' + (order.address ? order.address.name : '') + '! Apni Dukan order #' + (order.receiptNumber || order._id.slice(-6).toUpperCase()) + ' status: ' + order.status + '. Total: Rs.' + (order.grandTotal || order.total))}
                    target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', background: '#25D366', color: '#fff', borderRadius: 50, padding: '4px 12px', textDecoration: 'none', fontSize: 10, fontWeight: 700 }}>
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STOCK */}
        {tab === 'stock' && (
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', flex: 1 }}>Stock & Prices ({filteredProducts.length})</h2>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #d0e8d8', borderRadius: 50, padding: '7px 14px', gap: 7 }}>
                <span>🔍</span>
                <input placeholder="Product search..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 12, fontFamily: 'Poppins, sans-serif', width: 180, background: 'transparent' }} />
                {productSearch && <button onClick={() => setProductSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b8f71', fontSize: 13 }}>✕</button>}
              </div>
            </div>
            <div style={{ background: '#e6f4ec', borderRadius: 10, padding: '9px 14px', marginBottom: 12, fontSize: 12, color: '#145530', fontWeight: 500 }}>
              💡 Price ya stock change karo aur "Save!" button dabao — main website pe turant update ho jayega!
            </div>
            <div style={{ overflowX: 'auto', borderRadius: 14, border: '1.5px solid #e8f2ea' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                  <tr style={{ background: '#145530' }}>
                    {['Product', 'Category', 'MRP (Rs.)', 'Sale Price (Rs.)', 'Stock', 'Badge', 'Status', 'Save'].map((h) => (
                      <th key={h} style={{ padding: '9px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => <ProductRow key={p._id} product={p} onSave={handleSaveProduct} />)}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <div style={{ textAlign: 'center', padding: '30px', color: '#6b8f71' }}>Koi product nahi mila</div>}
            </div>
          </div>
        )}

        {/* ADD PRODUCT */}
        {tab === 'add' && (
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>➕ Naya Product Add Karo</h2>
            <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8f2ea', padding: '22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Naam (English) *</label><input style={inp} placeholder="Fresh Tomato" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Hindi Naam</label><input style={inp} placeholder="ताज़ा टमाटर" value={newProduct.nameHindi} onChange={(e) => setNewProduct({ ...newProduct, nameHindi: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>MRP (Rs.) *</label><input type="number" style={inp} placeholder="45" value={newProduct.mrp} onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Sale Price (Rs.) *</label><input type="number" style={inp} placeholder="35" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Stock *</label><input type="number" style={inp} placeholder="100" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Quantity</label><input style={inp} placeholder="1 kg / 500 g" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Badge</label><input style={inp} placeholder="Fresh / New / Hot" value={newProduct.badge} onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Category *</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                    {['vegetables', 'fruits', 'dairy', 'grains', 'oil', 'snacks', 'drinks', 'household'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Image URL</label>
              <input style={inp} placeholder="https://images.unsplash.com/..." value={newProduct.img} onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })} />
              {newProduct.price && newProduct.mrp && Number(newProduct.mrp) > Number(newProduct.price) && (
                <div style={{ background: '#e6f4ec', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#145530', fontWeight: 600 }}>
                  ✅ {Math.round(((newProduct.mrp - newProduct.price) / newProduct.mrp) * 100)}% discount — Rs.{newProduct.mrp - newProduct.price} ki bachat!
                </div>
              )}
              <button onClick={handleAddProduct} style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                ➕ Product Add Karo
              </button>
            </div>
          </div>
        )}

        {/* COUPONS */}
        {tab === 'coupons' && (
          <div>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>🎟️ Coupon Codes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              {coupons.map((c) => (
                <div key={c.code} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid ' + (c.active ? '#b8dfc6' : '#e8f2ea'), padding: '16px', opacity: c.active ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#145530', letterSpacing: 1 }}>{c.code}</div>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 50, background: c.active ? '#e6f4ec' : '#fee2e2', color: c.active ? '#145530' : '#e24b4a' }}>{c.active ? 'Active' : 'Off'}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#0a2e1a', fontWeight: 600, marginBottom: 3 }}>{c.type === 'flat' ? 'Rs.' + c.value + ' OFF' : c.value + '% OFF'}</div>
                  <div style={{ fontSize: 10, color: '#6b8f71', marginBottom: 2 }}>Min order: Rs.{c.minOrder}</div>
                  <div style={{ fontSize: 10, color: '#6b8f71', marginBottom: 10 }}>Used: {c.used} / {c.usageLimit}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleCoupon(c.code)} style={{ flex: 1, background: c.active ? '#fff7ed' : '#e6f4ec', color: c.active ? '#f07c2a' : '#145530', border: '1.5px solid ' + (c.active ? '#fed7aa' : '#b8dfc6'), borderRadius: 50, padding: '5px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>{c.active ? 'Disable' : 'Enable'}</button>
                    <button onClick={() => deleteCoupon(c.code)} style={{ background: '#fee2e2', color: '#e24b4a', border: '1.5px solid #fca5a5', borderRadius: 50, padding: '5px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Del</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8f2ea', padding: '20px', maxWidth: 480 }}>
              <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>➕ Naya Coupon Banao</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Code *</label><input style={inp} placeholder="SAVE20" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Type</label>
                  <select value={newCoupon.type} onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="flat">Flat (Rs. amount)</option>
                    <option value="percent">Percent (%)</option>
                  </select>
                </div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>{newCoupon.type === 'flat' ? 'Amount (Rs.) *' : 'Percent (%) *'}</label><input type="number" style={inp} placeholder={newCoupon.type === 'flat' ? '50' : '10'} value={newCoupon.value} onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Min Order (Rs.)</label><input type="number" style={inp} placeholder="199" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Usage Limit</label><input type="number" style={inp} placeholder="100" value={newCoupon.usageLimit} onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })} /></div>
              </div>
              <button onClick={addCoupon} style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                🎟️ Coupon Create Karo
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width:768px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns:repeat(2,1fr) !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}