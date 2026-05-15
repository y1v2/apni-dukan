import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';

// ─── Product Row Component (outside Admin to avoid hooks-in-loop error) ───────
function ProductRow({ product, onSave, onDelete }) {
  const [price, setPrice] = useState(product.price);
  const [mrp, setMrp] = useState(product.mrp || product.price);
  const [stock, setStock] = useState(product.stock);
  const [badge, setBadge] = useState(product.badge || 'Fresh');
  const [unit, setUnit] = useState(product.unit || 'kg');
  const [changed, setChanged] = useState(false);

  const disc = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const iS = {
    width: 65, padding: '5px 6px', border: '1.5px solid #d0e8d8',
    borderRadius: 7, fontSize: 12, outline: 'none', fontFamily: 'Poppins, sans-serif'
  };

  const EMOJIS = {
    vegetables: '🥬', fruits: '🍎', dairy: '🥛', grains: '🌾',
    oil: '🌶️', snacks: '🍪', drinks: '🧃', household: '🧼'
  };

  return (
    <tr style={{ borderBottom: '1px solid #f0f7f2', background: changed ? '#fffbeb' : '#fff', transition: 'background 0.3s' }}>
      <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#0a2e1a', minWidth: 130 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#e6f4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            {product.img ? (
              <img src={product.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            ) : null}
            <span style={{ display: product.img ? 'none' : 'block' }}>{EMOJIS[product.category] || '🛒'}</span>
          </div>
          <div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>{product.name}</div>
            {product.nameHindi && <div style={{ fontSize: 10, color: '#6b8f71' }}>{product.nameHindi}</div>}
          </div>
        </div>
      </td>
      <td style={{ padding: '8px 5px', fontSize: 11, color: '#6b8f71' }}>{product.category}</td>
      <td style={{ padding: '8px 4px' }}>
        <input type="number" value={mrp} onChange={e => { setMrp(Number(e.target.value)); setChanged(true); }} style={iS} />
      </td>
      <td style={{ padding: '8px 4px' }}>
        <input type="number" value={price} onChange={e => { setPrice(Number(e.target.value)); setChanged(true); }}
          style={{ ...iS, borderColor: changed ? '#f07c2a' : '#d0e8d8' }} />
        {disc > 0 && <div style={{ fontSize: 9, color: '#22c55e', fontWeight: 700 }}>{disc}% OFF</div>}
      </td>
      <td style={{ padding: '8px 4px' }}>
        <input type="number" value={stock} onChange={e => { setStock(Number(e.target.value)); setChanged(true); }}
          style={{ ...iS, borderColor: stock <= 0 ? '#fca5a5' : stock < 20 ? '#fed7aa' : '#d0e8d8' }} />
      </td>
      <td style={{ padding: '8px 4px' }}>
        <select value={unit} onChange={e => { setUnit(e.target.value); setChanged(true); }}
          style={{ ...iS, width: 58, cursor: 'pointer' }}>
          {['kg', 'g', 'litre', 'ml', 'pcs', 'dozen'].map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </td>
      <td style={{ padding: '8px 4px' }}>
        <input value={badge} onChange={e => { setBadge(e.target.value); setChanged(true); }}
          style={{ ...iS, width: 68 }} />
      </td>
      <td style={{ padding: '8px 4px' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 50,
          background: stock <= 0 ? '#fee2e2' : stock < 20 ? '#fff7ed' : '#e6f4ec',
          color: stock <= 0 ? '#e24b4a' : stock < 20 ? '#f07c2a' : '#145530'
        }}>
          {stock <= 0 ? 'OUT' : stock < 20 ? 'LOW' : 'OK'}
        </span>
      </td>
      <td style={{ padding: '8px 4px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => { onSave(product._id, { price, mrp, stock, badge, unit }); setChanged(false); }}
            style={{
              background: changed ? '#f07c2a' : '#145530', color: '#fff', border: 'none',
              borderRadius: 50, padding: '5px 10px', fontSize: 10, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap'
            }}>
            {changed ? 'Save!' : 'OK'}
          </button>
          <button
            onClick={() => { if (window.confirm('Delete ' + product.name + '?')) onDelete(product._id); }}
            style={{
              background: '#fee2e2', color: '#e24b4a', border: '1.5px solid #fca5a5',
              borderRadius: 50, padding: '5px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer'
            }}>
            Del
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Notification Tab (uses local state, outside main component) ──────────────
function NotificationTab({ notifications, sendNotification }) {
  const [msg, setMsg] = useState('');
  const [type, setType] = useState('info');

  const notifColors = { info: '#378ADD', offer: '#145530', alert: '#e24b4a', holiday: '#f07c2a' };
  const notifLabels = { info: 'ℹ️ Info', offer: '🎉 Offer', alert: '⚠️ Alert', holiday: '🎊 Festival' };

  const inp = {
    width: '100%', padding: '9px 12px', border: '1.5px solid #d0e8d8', borderRadius: 10,
    fontSize: 13, outline: 'none', fontFamily: 'Poppins, sans-serif', background: '#f5f9f6',
    marginBottom: 8, boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>
        🔔 Notifications — Customers ko Bhejo
      </h2>

      {/* Send new */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8f2ea', padding: '20px', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>
          ➕ Naya Message Bhejo
        </h3>

        {/* Type selector */}
        <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 8 }}>Type Choose Karo</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
          {[['info', '💙', 'Info', '#378ADD'], ['offer', '💚', 'Offer', '#145530'], ['alert', '❤️', 'Alert', '#e24b4a'], ['holiday', '🧡', 'Festival', '#f07c2a']].map(([t, icon, label, color]) => (
            <div key={t} onClick={() => setType(t)}
              style={{
                border: '2px solid ' + (type === t ? color : '#e8f2ea'), borderRadius: 11,
                padding: '10px 6px', cursor: 'pointer',
                background: type === t ? color + '18' : '#fff', textAlign: 'center', transition: 'all 0.2s'
              }}>
              <div style={{ fontSize: 20, marginBottom: 3 }}>{icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: type === t ? color : '#6b8f71' }}>{label}</div>
            </div>
          ))}
        </div>

        <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Message *</label>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
          placeholder={'Jaise:\n• Aaj store 8 PM tak hi open hai.\n• Holi Special: 20% off sabhi items par!\n• New stock aa gaya — Fresh vegetables available!'}
          style={{ ...inp, resize: 'none', height: 90, marginBottom: 12 }} />

        <div style={{ background: '#f5f9f6', borderRadius: 10, padding: '10px 13px', fontSize: 12, color: '#6b8f71', marginBottom: 14 }}>
          💡 Yeh notification sabhi registered customers ke Profile → Notifications mein dikhegi. Unread badge bhi dikhega.
        </div>

        <button
          onClick={() => {
            if (!msg.trim()) { toast.error('Message likho pehle'); return; }
            sendNotification(msg.trim(), type);
            setMsg('');
            toast.success('✅ Notification sabhi customers ko bhej di!');
          }}
          style={{
            width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff',
            border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
          }}>
          🔔 Send to All Customers
        </button>
      </div>

      {/* History */}
      <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 12 }}>
        Sent Notifications ({notifications.length})
      </h3>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔔</div>
          <p style={{ color: '#6b8f71', fontSize: 13 }}>Abhi koi notification nahi bheji</p>
        </div>
      ) : notifications.map((n, i) => {
        const color = notifColors[n.type] || '#378ADD';
        return (
          <div key={i} style={{
            background: '#fff', borderRadius: 13,
            border: '1.5px solid ' + color + '40', padding: '13px', marginBottom: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, flexWrap: 'wrap', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 50, background: color + '20', color }}>
                {notifLabels[n.type] || n.type}
              </span>
              <span style={{ fontSize: 10, color: '#6b8f71' }}>
                {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#0a2e1a', lineHeight: 1.6, margin: '0 0 6px' }}>{n.message}</p>
            <div style={{ fontSize: 11, color: '#6b8f71' }}>👁️ {(n.readBy || []).length} customers ne padha</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Admin Component ──────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const {
    products, updateProduct, addProduct, deleteProduct,
    ratings, approveRating, rejectRating,
    blockedUsers, blockUser, unblockUser,
    notifications, sendNotification,
  } = useProducts();

  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Stock tab
  const [productSearch, setProductSearch] = useState('');

  // Orders tab
  const [orderSearch, setOrderSearch] = useState('');

  // Coupons
  const [coupons, setCoupons] = useState(() => {
    try { return JSON.parse(localStorage.getItem('apnidukan_coupons') || '[]'); } catch { return []; }
  });
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'flat', value: '', minOrder: '', usageLimit: '' });

  // Add product
  const [newProduct, setNewProduct] = useState({
    name: '', nameHindi: '', price: '', mrp: '', stock: '',
    category: 'vegetables', badge: 'Fresh', quantity: '', unit: 'kg', img: '', description: ''
  });

  // Block user modal
  const [blockTarget, setBlockTarget] = useState(null);
  const [blockPassword, setBlockPassword] = useState('');

  // ── Auth check ────────────────────────────────────────────────────────────
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');
    if (!auth || !authTime || Date.now() - Number(authTime) > 8 * 60 * 60 * 1000) {
      navigate('/admin-login');
      return;
    }
    fetchOrders();
    fetchCustomers();
  }, []);

  // ── Data fetchers ─────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(API + '/orders/all', { headers: { Authorization: 'Bearer ' + token } });
      setOrders(data);
    } catch { setOrders([]); }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get(API + '/auth/users', { headers: { Authorization: 'Bearer ' + token } });
      setCustomers(data);
    } catch { setCustomers([]); }
  };

  // ── Order actions ─────────────────────────────────────────────────────────
  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(API + '/orders/' + id + '/status', { status }, { headers: { Authorization: 'Bearer ' + token } });
      if (status === 'Delivered') {
        toast.success('Status: Delivered ✅ Payment: Done ✅');
      } else {
        toast.success('Status: ' + status + ' ✅');
      }
      fetchOrders();
    } catch { toast.error('Update fail hua'); }
  };

  // ── Product actions ───────────────────────────────────────────────────────
  const handleSaveProduct = (id, updates) => {
    updateProduct(id, updates);
    toast.success('✅ Main website pe bhi update ho gaya!');
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error('Naam, price aur stock zaruri hai');
      return;
    }
    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp || newProduct.price),
      stock: Number(newProduct.stock),
      images: newProduct.img ? [newProduct.img] : [],
    });
    toast.success(newProduct.name + ' add ho gaya! ✅');
    setNewProduct({ name: '', nameHindi: '', price: '', mrp: '', stock: '', category: 'vegetables', badge: 'Fresh', quantity: '', unit: 'kg', img: '', description: '' });
  };

  // ── Coupon actions ────────────────────────────────────────────────────────
  const saveCoupons = (arr) => {
    setCoupons(arr);
    localStorage.setItem('apnidukan_coupons', JSON.stringify(arr));
  };

  const addCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) { toast.error('Code aur value zaruri hai'); return; }
    if (coupons.find(c => c.code.toUpperCase() === newCoupon.code.toUpperCase())) { toast.error('Yeh code pehle se hai'); return; }
    const added = {
      ...newCoupon, code: newCoupon.code.toUpperCase(),
      value: Number(newCoupon.value), minOrder: Number(newCoupon.minOrder || 0),
      usageLimit: Number(newCoupon.usageLimit || 999), used: 0, active: true
    };
    saveCoupons([...coupons, added]);
    toast.success('Coupon ' + added.code + ' create ho gaya! ✅');
    setNewCoupon({ code: '', type: 'flat', value: '', minOrder: '', usageLimit: '' });
  };

  // ── Block user actions ────────────────────────────────────────────────────
  const handleBlockConfirm = () => {
    if (blockPassword !== 'Y@sh1234') { toast.error('Galat password!'); return; }
    blockUser(blockTarget);
    toast.success(blockTarget.name + ' ko block kar diya! ✅');
    setBlockTarget(null);
    setBlockPassword('');
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    navigate('/admin-login');
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((s, o) => s + (o.grandTotal || o.total || 0), 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const lowStock = products.filter(p => p.stock < 20);
  const pendingRatings = ratings.filter(r => r.status === 'pending').length;

  const filteredProducts = products.filter(p => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.nameHindi && p.nameHindi.includes(productSearch)) ||
      p.category.toLowerCase().includes(q) ||
      (p.badge && p.badge.toLowerCase().includes(q))
    );
  });

  const filteredOrders = orders.filter(o => {
    if (!orderSearch) return true;
    const q = orderSearch.toLowerCase();
    return (
      (o.receiptNumber && o.receiptNumber.toLowerCase().includes(q)) ||
      (o.address?.name && o.address.name.toLowerCase().includes(q)) ||
      (o.address?.phone && o.address.phone.includes(orderSearch))
    );
  });

  // ── Styles ────────────────────────────────────────────────────────────────
  const tabBtn = (active) => ({
    padding: '8px 14px', border: 'none', borderRadius: 50, fontSize: 12, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
    background: active ? '#145530' : '#e6f4ec',
    color: active ? '#fff' : '#145530',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  });

  const inp = {
    width: '100%', padding: '9px 11px', border: '1.5px solid #d0e8d8', borderRadius: 9,
    fontSize: 12, outline: 'none', fontFamily: 'Poppins, sans-serif', background: '#f5f9f6',
    marginBottom: 8, boxSizing: 'border-box'
  };

  const card = { background: '#fff', borderRadius: 16, border: '1.5px solid #e8f2ea', padding: '16px', marginBottom: 12 };

  const STATUS_COLORS = {
    Placed: '#378ADD', Packed: '#BA7517',
    'Out for Delivery': '#f07c2a', Delivered: '#145530', Cancelled: '#e24b4a'
  };
  const STEPS = ['Placed', 'Packed', 'Out for Delivery', 'Delivered'];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#f5f9f6', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Block User Modal ────────────────────────────────────────── */}
      {blockTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 22, padding: '28px', maxWidth: 380, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
              <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>
                Block Customer?
              </h3>
              <p style={{ fontSize: 13, color: '#6b8f71' }}>
                <strong style={{ color: '#0a2e1a' }}>{blockTarget.name}</strong><br />
                {blockTarget.email}
                {blockTarget.phone && <><br />📞 {blockTarget.phone}</>}
              </p>
              <p style={{ fontSize: 12, color: '#e24b4a', marginTop: 8, fontWeight: 600 }}>
                Yeh customer login nahi kar payega aur order nahi de payega jab tak unblock na karo.
              </p>
            </div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>
              Admin Password Confirm Karo *
            </label>
            <input type="password" value={blockPassword} onChange={e => setBlockPassword(e.target.value)}
              placeholder="Y@sh1234"
              style={{ ...inp, border: '2px solid #d0e8d8', borderRadius: 12, padding: '11px 14px', fontSize: 13, marginBottom: 14 }}
              onKeyDown={e => e.key === 'Enter' && handleBlockConfirm()} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleBlockConfirm}
                style={{ flex: 1, background: '#e24b4a', color: '#fff', border: 'none', borderRadius: 50, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                🔒 Block Karo
              </button>
              <button onClick={() => { setBlockTarget(null); setBlockPassword(''); }}
                style={{ flex: 1, background: '#f5f5f5', color: '#6b8f71', border: 'none', borderRadius: 50, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0a2e1a, #145530)', padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>
            👑 Admin Panel — Apni Dukan
          </h1>
          <p style={{ color: '#86efac', fontSize: 11, marginTop: 3 }}>Saari cheezein yahan se manage karo</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 50, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            🏠 Website
          </button>
          <button onClick={logout}
            style={{ background: '#fee2e2', color: '#e24b4a', border: 'none', borderRadius: 50, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, padding: '14px 20px 0' }}>
        {[
          ['📦', 'Total Orders', orders.length, '#145530'],
          ['📅', 'Aaj ke Orders', todayOrders, '#f07c2a'],
          ['💰', 'Revenue', 'Rs.' + totalRevenue.toLocaleString('en-IN'), '#145530'],
          ['⚠️', 'Low Stock', lowStock.length, lowStock.length > 0 ? '#e24b4a' : '#145530'],
          ['⭐', 'Ratings Pending', pendingRatings, pendingRatings > 0 ? '#f07c2a' : '#145530'],
        ].map(([icon, label, value, color]) => (
          <div key={label} style={{ background: '#fff', borderRadius: 13, border: '1.5px solid #e8f2ea', padding: '12px' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 10, color: '#6b8f71', fontWeight: 600, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Low Stock Alert ─────────────────────────────────────────── */}
      {lowStock.length > 0 && (
        <div style={{ margin: '10px 20px 0', background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 11, padding: '9px 13px', fontSize: 12, color: '#e24b4a', fontWeight: 600 }}>
          ⚠️ Low/Out of Stock: {lowStock.slice(0, 6).map(p => p.name + (p.stock <= 0 ? ' (OUT)' : ' (' + p.stock + ')')).join(' · ')}
          {lowStock.length > 6 && ' +' + (lowStock.length - 6) + ' more'}
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 7, padding: '14px 20px 0', flexWrap: 'wrap' }}>
        {[
          ['orders', '📦 Orders'],
          ['stock', '📊 Stock & Prices'],
          ['add', '➕ Add Product'],
          ['coupons', '🎟️ Coupons'],
          ['ratings', '⭐ Ratings'],
          ['customers', '👥 Customers'],
          ['notifications', '🔔 Notifications'],
        ].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={tabBtn(tab === t)}>{l}</button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────── */}
      <div style={{ padding: '14px 20px 60px' }}>

        {/* ════════════ ORDERS TAB ════════════ */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', flex: 1, margin: 0 }}>
                Orders ({filteredOrders.length})
              </h2>
              <input
                placeholder="Name, phone, receipt..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                style={{ padding: '8px 14px', border: '1.5px solid #d0e8d8', borderRadius: 50, fontSize: 12, outline: 'none', fontFamily: 'Poppins, sans-serif', width: 220, background: '#fff' }}
              />
              <button onClick={fetchOrders}
                style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                🔄 Refresh
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', background: '#fff', borderRadius: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                <p style={{ color: '#6b8f71' }}>Koi order nahi mila</p>
              </div>
            ) : filteredOrders.map(order => (
              <div key={order._id} style={card}>
                {/* Order header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#0a2e1a' }}>
                      #{order.receiptNumber || order._id.slice(-6).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 10, color: '#6b8f71', marginTop: 2 }}>
                      {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 50, background: (STATUS_COLORS[order.status] || '#888') + '20', color: STATUS_COLORS[order.status] || '#888' }}>
                      {order.status}
                    </span>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 50, background: '#f5f9f6', color: '#4a6b50', fontWeight: 600 }}>
                      {order.paymentMethod}
                    </span>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 50, background: order.paymentStatus === 'Done' || order.paymentStatus === 'Paid' ? '#e6f4ec' : '#fff7ed', color: order.paymentStatus === 'Done' || order.paymentStatus === 'Paid' ? '#145530' : '#f07c2a', fontWeight: 700 }}>
                      💰 {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Customer + Address */}
                <div style={{ background: '#f5f9f6', borderRadius: 10, padding: '10px 12px', marginBottom: 9, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 9, color: '#6b8f71', fontWeight: 700, marginBottom: 3, letterSpacing: 0.5 }}>👤 CUSTOMER</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2e1a' }}>{order.address?.name || 'N/A'}</div>
                    {order.address?.phone && (
                      <a href={'tel:' + order.address.phone} style={{ fontSize: 12, color: '#145530', fontWeight: 700, textDecoration: 'none' }}>
                        📞 {order.address.phone}
                      </a>
                    )}
                    {order.user?.email && <div style={{ fontSize: 10, color: '#6b8f71', marginTop: 2 }}>{order.user.email}</div>}
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: '#6b8f71', fontWeight: 700, marginBottom: 3, letterSpacing: 0.5 }}>📍 ADDRESS</div>
                    <div style={{ fontSize: 11, color: '#0a2e1a', lineHeight: 1.6 }}>
                      {order.address?.street || ''}
                      {order.address?.landmark ? ', ' + order.address.landmark : ''}
                      <br />
                      {order.address?.city || ''} — {order.address?.pincode || ''}
                    </div>
                    {order.address?.location?.lat && (
                      <a href={'https://maps.google.com/?q=' + order.address.location.lat + ',' + order.address.location.lng}
                        target="_blank" rel="noreferrer"
                        style={{ fontSize: 10, color: '#145530', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 3 }}>
                        🗺️ View on Map
                      </a>
                    )}
                  </div>
                </div>

                {/* Items */}
                {order.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '5px 0', borderBottom: '1px solid #f0f7f2' }}>
                    <span style={{ color: '#0a2e1a' }}>{item.name} <span style={{ color: '#6b8f71' }}>×{item.qty}</span></span>
                    <span style={{ fontWeight: 700, color: '#145530' }}>Rs.{item.price * item.qty}</span>
                  </div>
                ))}

                {/* Totals */}
                <div style={{ paddingTop: 8, marginTop: 4 }}>
                  {(order.couponDiscount > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#22c55e', fontWeight: 600, marginBottom: 3 }}>
                      <span>🎟️ Coupon</span><span>-Rs.{order.couponDiscount}</span>
                    </div>
                  )}
                  {(order.walletDiscount > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#145530', fontWeight: 600, marginBottom: 3 }}>
                      <span>💰 Wallet</span><span>-Rs.{order.walletDiscount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 14, fontFamily: 'Baloo 2, cursive', color: '#0a2e1a', borderTop: '1.5px solid #e8f2ea', paddingTop: 6 }}>
                    <span>Grand Total</span>
                    <span style={{ color: '#145530' }}>Rs.{order.grandTotal || order.total}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center', marginTop: 10, paddingTop: 9, borderTop: '1px solid #f0f7f2' }}>
                  <span style={{ fontSize: 10, color: '#6b8f71', fontWeight: 600, marginRight: 2 }}>Update:</span>
                  {STEPS.map(s => (
                    <button key={s} onClick={() => updateOrderStatus(order._id, s)}
                      style={{
                        background: order.status === s ? (STATUS_COLORS[s] || '#888') : '#f5f9f6',
                        color: order.status === s ? '#fff' : '#4a6b50',
                        border: '1.5px solid ' + (order.status === s ? (STATUS_COLORS[s] || '#888') : '#e8f2ea'),
                        borderRadius: 50, padding: '4px 9px', fontSize: 9, fontWeight: 700, cursor: 'pointer'
                      }}>
                      {s}
                    </button>
                  ))}
                  <button onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                    style={{ background: '#fff0f0', color: '#e24b4a', border: '1.5px solid #fca5a5', borderRadius: 50, padding: '4px 9px', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <a href={'https://wa.me/91' + (order.address?.phone || '').replace(/\D/g, '').slice(-10) +
                      '?text=' + encodeURIComponent(
                        'Namaste ' + (order.address?.name || '') + '! Apni Dukan se aapka order #' +
                        (order.receiptNumber || order._id.slice(-6).toUpperCase()) +
                        ' status: *' + order.status + '*. Total: Rs.' +
                        (order.grandTotal || order.total) + '. Shukriya! 🙏'
                      )}
                    target="_blank" rel="noreferrer"
                    style={{ marginLeft: 'auto', background: '#25D366', color: '#fff', borderRadius: 50, padding: '4px 12px', textDecoration: 'none', fontSize: 10, fontWeight: 700 }}>
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════════ STOCK & PRICES TAB ════════════ */}
        {tab === 'stock' && (
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', flex: 1, margin: 0 }}>
                Stock & Prices ({filteredProducts.length} products)
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #d0e8d8', borderRadius: 50, padding: '7px 14px', gap: 7 }}>
                <span>🔍</span>
                <input
                  placeholder="Product search karo..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 12, fontFamily: 'Poppins, sans-serif', width: 170, background: 'transparent' }}
                />
                {productSearch && (
                  <button onClick={() => setProductSearch('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b8f71', fontSize: 14, lineHeight: 1 }}>✕</button>
                )}
              </div>
            </div>

            <div style={{ background: '#e6f4ec', borderRadius: 10, padding: '9px 14px', marginBottom: 12, fontSize: 12, color: '#145530', fontWeight: 500 }}>
              💡 Price ya stock change karo → <strong>Save!</strong> button dabao → Main website pe turant update! Stock 0 karne par "Out of Stock" dikhega.
            </div>

            <div style={{ overflowX: 'auto', borderRadius: 14, border: '1.5px solid #e8f2ea', boxShadow: '0 2px 12px rgba(20,85,48,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', minWidth: 760 }}>
                <thead>
                  <tr style={{ background: '#145530' }}>
                    {['Product', 'Cat', 'MRP (Rs.)', 'Sale Price', 'Stock', 'Unit', 'Badge', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '9px 9px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <ProductRow key={p._id} product={p} onSave={handleSaveProduct} onDelete={deleteProduct} />
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#6b8f71', background: '#fff' }}>
                  Koi product nahi mila "{productSearch}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════ ADD PRODUCT TAB ════════════ */}
        {tab === 'add' && (
          <div style={{ maxWidth: 580 }}>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>
              ➕ Naya Product Add Karo
            </h2>
            <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8f2ea', padding: '22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Naam (English) *</label>
                  <input style={inp} placeholder="Fresh Tomato" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Hindi Naam</label>
                  <input style={inp} placeholder="ताज़ा टमाटर" value={newProduct.nameHindi} onChange={e => setNewProduct({ ...newProduct, nameHindi: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>MRP (Rs.) *</label>
                  <input type="number" style={inp} placeholder="45" value={newProduct.mrp} onChange={e => setNewProduct({ ...newProduct, mrp: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Sale Price (Rs.) *</label>
                  <input type="number" style={inp} placeholder="35" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Stock *</label>
                  <input type="number" style={inp} placeholder="100" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Unit</label>
                  <select value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                    style={{ ...inp, cursor: 'pointer' }}>
                    {['kg', 'g', 'litre', 'ml', 'pcs', 'dozen'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Quantity (display)</label>
                  <input style={inp} placeholder="1 kg / 500 g / 6 pcs" value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Badge</label>
                  <input style={inp} placeholder="Fresh / New / Hot / Sale" value={newProduct.badge} onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Category *</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ ...inp, cursor: 'pointer' }}>
                    {['vegetables', 'fruits', 'dairy', 'grains', 'oil', 'snacks', 'drinks', 'household'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Image URL (Unsplash ya koi bhi)</label>
              <input style={inp} placeholder="https://images.unsplash.com/photo-XXXX?w=400&h=300&fit=crop" value={newProduct.img} onChange={e => setNewProduct({ ...newProduct, img: e.target.value })} />

              <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Description</label>
              <input style={inp} placeholder="Product ki short description..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />

              {newProduct.price && newProduct.mrp && Number(newProduct.mrp) > Number(newProduct.price) && (
                <div style={{ background: '#e6f4ec', borderRadius: 9, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#145530', fontWeight: 600 }}>
                  ✅ {Math.round(((newProduct.mrp - newProduct.price) / newProduct.mrp) * 100)}% discount — Rs.{newProduct.mrp - newProduct.price} ki bachat!
                </div>
              )}

              <button onClick={handleAddProduct}
                style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                ➕ Product Add Karo
              </button>
            </div>
          </div>
        )}

        {/* ════════════ COUPONS TAB ════════════ */}
        {tab === 'coupons' && (
          <div>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>
              🎟️ Coupon Codes
            </h2>

            {/* Existing coupons */}
            {coupons.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {coupons.map((c, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid ' + (c.active ? '#b8dfc6' : '#e8f2ea'), padding: '16px', opacity: c.active ? 1 : 0.65 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#145530', letterSpacing: 1 }}>{c.code}</div>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 50, background: c.active ? '#e6f4ec' : '#fee2e2', color: c.active ? '#145530' : '#e24b4a' }}>
                        {c.active ? 'Active' : 'Off'}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#0a2e1a', fontWeight: 600, marginBottom: 3 }}>
                      {c.type === 'flat' ? 'Rs.' + c.value + ' OFF' : c.value + '% OFF'}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b8f71', marginBottom: 2 }}>Min order: Rs.{c.minOrder}</div>
                    <div style={{ fontSize: 11, color: '#6b8f71', marginBottom: 12 }}>Used: {c.used || 0} / {c.usageLimit}</div>
                    <div style={{ display: 'flex', gap: 7 }}>
                      <button onClick={() => saveCoupons(coupons.map(x => x.code === c.code ? { ...x, active: !x.active } : x))}
                        style={{ flex: 1, background: c.active ? '#fff7ed' : '#e6f4ec', color: c.active ? '#f07c2a' : '#145530', border: '1.5px solid ' + (c.active ? '#fed7aa' : '#b8dfc6'), borderRadius: 50, padding: '6px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => saveCoupons(coupons.filter(x => x.code !== c.code))}
                        style={{ background: '#fee2e2', color: '#e24b4a', border: '1.5px solid #fca5a5', borderRadius: 50, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create new coupon */}
            <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8f2ea', padding: '20px', maxWidth: 480 }}>
              <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>
                ➕ Naya Coupon Banao
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Code *</label>
                  <input style={inp} placeholder="HOLI30" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Type</label>
                  <select value={newCoupon.type} onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    style={{ ...inp, cursor: 'pointer' }}>
                    <option value="flat">Flat (Rs. amount)</option>
                    <option value="percent">Percent (%)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>
                    {newCoupon.type === 'flat' ? 'Discount Amount (Rs.) *' : 'Discount Percent (%) *'}
                  </label>
                  <input type="number" style={inp} placeholder={newCoupon.type === 'flat' ? '50' : '10'} value={newCoupon.value} onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Min Order (Rs.)</label>
                  <input type="number" style={inp} placeholder="199" value={newCoupon.minOrder} onChange={e => setNewCoupon({ ...newCoupon, minOrder: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Usage Limit</label>
                  <input type="number" style={inp} placeholder="100" value={newCoupon.usageLimit} onChange={e => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })} />
                </div>
              </div>
              {newCoupon.code && newCoupon.value && (
                <div style={{ background: '#e6f4ec', borderRadius: 9, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#145530', fontWeight: 600 }}>
                  Preview: Code <strong>{newCoupon.code}</strong> — {newCoupon.type === 'flat' ? 'Rs.' + newCoupon.value + ' flat off' : newCoupon.value + '% off'} on orders above Rs.{newCoupon.minOrder || 0}
                </div>
              )}
              <button onClick={addCoupon}
                style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                🎟️ Coupon Create Karo
              </button>
            </div>
          </div>
        )}

        {/* ════════════ RATINGS TAB ════════════ */}
        {tab === 'ratings' && (
          <div>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>
              ⭐ Customer Ratings
            </h2>
            <p style={{ fontSize: 12, color: '#6b8f71', marginBottom: 14 }}>
              Approved ratings homepage pe "Happy Customers" section mein dikhti hain.
            </p>

            {ratings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', background: '#fff', borderRadius: 16 }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>⭐</div>
                <p style={{ color: '#6b8f71' }}>Abhi koi rating nahi aayi</p>
              </div>
            ) : (
              <div>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
                  {[
                    ['⏳', 'Pending', ratings.filter(r => r.status === 'pending').length, '#f07c2a'],
                    ['✅', 'Approved', ratings.filter(r => r.status === 'approved').length, '#145530'],
                    ['❌', 'Rejected', ratings.filter(r => r.status === 'rejected').length, '#e24b4a'],
                  ].map(([icon, label, count, color]) => (
                    <div key={label} style={{ background: '#fff', borderRadius: 13, padding: '14px', textAlign: 'center', border: '1.5px solid #e8f2ea' }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color }}>{count}</div>
                      <div style={{ fontSize: 11, color: '#6b8f71' }}>{label}</div>
                    </div>
                  ))}
                </div>

                {ratings.map((r, i) => (
                  <div key={i} style={{
                    background: '#fff', borderRadius: 15,
                    border: '1.5px solid ' + (r.status === 'approved' ? '#b8dfc6' : r.status === 'rejected' ? '#fca5a5' : '#e8f2ea'),
                    padding: '14px', marginBottom: 11
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                      <div>
                        <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#0a2e1a' }}>
                          {r.customerName || 'Customer'}
                        </div>
                        <div style={{ fontSize: 10, color: '#6b8f71', marginTop: 2 }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {r.orderId && ' | Order #' + (r.orderId || '').slice(-6).toUpperCase()}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 11px', borderRadius: 50,
                        background: r.status === 'approved' ? '#e6f4ec' : r.status === 'rejected' ? '#fee2e2' : '#fff7ed',
                        color: r.status === 'approved' ? '#145530' : r.status === 'rejected' ? '#e24b4a' : '#f07c2a'
                      }}>
                        {r.status === 'approved' ? '✅ Approved' : r.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} style={{ fontSize: 20, color: s <= r.stars ? '#f59e0b' : '#d1d5db' }}>★</span>
                      ))}
                      <span style={{ fontSize: 12, color: '#6b8f71', marginLeft: 6, alignSelf: 'center' }}>({r.stars}/5)</span>
                    </div>

                    {r.comment && (
                      <p style={{ fontSize: 13, color: '#0a2e1a', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10, background: '#f5f9f6', padding: '9px 12px', borderRadius: 9 }}>
                        "{r.comment}"
                      </p>
                    )}

                    {r.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => { approveRating(r.id); toast.success('Rating approved! Homepage pe dikhegi ✅'); }}
                          style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '8px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          ✅ Approve
                        </button>
                        <button onClick={() => { rejectRating(r.id); toast.success('Rating reject kar di'); }}
                          style={{ background: '#fee2e2', color: '#e24b4a', border: '1.5px solid #fca5a5', borderRadius: 50, padding: '8px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════ CUSTOMERS TAB ════════════ */}
        {tab === 'customers' && (
          <div>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>
              👥 Customers
            </h2>

            {/* Blocked users */}
            {blockedUsers.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#e24b4a', marginBottom: 10 }}>
                  🔒 Blocked Users ({blockedUsers.length})
                </h3>
                {blockedUsers.map((u, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 13, border: '1.5px solid #fca5a5', padding: '12px 14px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ width: 36, height: 36, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#e24b4a', flexShrink: 0 }}>
                      {(u.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2e1a' }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: '#6b8f71' }}>{u.email} {u.phone && '| ' + u.phone}</div>
                      <div style={{ fontSize: 10, color: '#e24b4a', marginTop: 2 }}>
                        Blocked on: {new Date(u.blockedAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <button onClick={() => { unblockUser(u.email); toast.success(u.name + ' unblock kar diya! ✅'); }}
                      style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                      🔓 Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* All customers */}
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#0a2e1a', marginBottom: 10 }}>
              All Customers ({customers.length})
            </h3>
            {customers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
                <p style={{ color: '#6b8f71', fontSize: 13 }}>Backend connect karo customers dekhne ke liye</p>
                <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 4 }}>
                  localhost:5000 pe backend chalu karo
                </p>
                <button onClick={fetchCustomers}
                  style={{ background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}>
                  🔄 Retry
                </button>
              </div>
            ) : customers.map((c, i) => {
              const isUserBlocked = blockedUsers.some(b => b.email === c.email);
              return (
                <div key={i} style={{
                  background: isUserBlocked ? '#fff5f5' : '#fff',
                  borderRadius: 13,
                  border: '1.5px solid ' + (isUserBlocked ? '#fca5a5' : '#e8f2ea'),
                  padding: '12px 14px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'
                }}>
                  <div style={{ width: 38, height: 38, background: isUserBlocked ? '#fee2e2' : '#145530', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
                    {(c.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2e1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name} {c.age && <span style={{ fontSize: 11, color: '#6b8f71', fontWeight: 500 }}>({c.age} yrs)</span>}
                      {isUserBlocked && <span style={{ fontSize: 10, background: '#fee2e2', color: '#e24b4a', padding: '1px 7px', borderRadius: 50, marginLeft: 6 }}>Blocked</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b8f71' }}>
                      {c.email} {c.phone && '| ' + c.phone}
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>
                      Joined: {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  {!isUserBlocked ? (
                    <button onClick={() => setBlockTarget(c)}
                      style={{ background: '#fee2e2', color: '#e24b4a', border: '1.5px solid #fca5a5', borderRadius: 50, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                      🔒 Block
                    </button>
                  ) : (
                    <button onClick={() => { unblockUser(c.email); toast.success(c.name + ' unblock kar diya!'); }}
                      style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                      🔓 Unblock
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════ NOTIFICATIONS TAB ════════════ */}
        {tab === 'notifications' && (
          <NotificationTab notifications={notifications} sendNotification={sendNotification} />
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          div[style*="repeat(5, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="padding: 14px 20px"] { padding: 12px !important; }
        }
      `}</style>
    </div>
  );
}