import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';

function ProductRow({ product, onSave, onDelete }) {
  const [price, setPrice] = useState(product.price);
  const [mrp, setMrp] = useState(product.mrp || product.price);
  const [stock, setStock] = useState(product.stock);
  const [badge, setBadge] = useState(product.badge || 'Fresh');
  const [unit, setUnit] = useState(product.unit || 'kg');
  const [changed, setChanged] = useState(false);
  const disc = mrp > price ? Math.round(((mrp-price)/mrp)*100) : 0;
  const iS = { width:68, padding:'5px 7px', border:'1.5px solid #d0e8d8', borderRadius:7, fontSize:12, outline:'none', fontFamily:'Poppins, sans-serif' };

  return (
    <tr style={{ borderBottom:'1px solid #f0f7f2', background:changed?'#fffbeb':'#fff' }}>
      <td style={{ padding:'8px 11px', fontSize:12, fontWeight:600, color:'#0a2e1a' }}>
        <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:120 }}>{product.name}</div>
        {product.nameHindi && <div style={{ fontSize:10, color:'#6b8f71' }}>{product.nameHindi}</div>}
      </td>
      <td style={{ padding:'8px 5px', fontSize:11, color:'#6b8f71' }}>{product.category}</td>
      <td style={{ padding:'8px 4px' }}><input type="number" value={mrp} onChange={e=>{setMrp(Number(e.target.value));setChanged(true);}} style={iS} /></td>
      <td style={{ padding:'8px 4px' }}>
        <input type="number" value={price} onChange={e=>{setPrice(Number(e.target.value));setChanged(true);}} style={{ ...iS, borderColor:changed?'#f07c2a':'#d0e8d8' }} />
        {disc>0 && <div style={{ fontSize:9, color:'#22c55e', fontWeight:700 }}>{disc}%</div>}
      </td>
      <td style={{ padding:'8px 4px' }}>
        <input type="number" value={stock} onChange={e=>{setStock(Number(e.target.value));setChanged(true);}} style={{ ...iS, borderColor:stock<20?'#fca5a5':'#d0e8d8' }} />
      </td>
      <td style={{ padding:'8px 4px' }}>
        <select value={unit} onChange={e=>{setUnit(e.target.value);setChanged(true);}} style={{ ...iS, width:60, cursor:'pointer' }}>
          {['kg','g','litre','ml','pcs','dozen'].map(u=><option key={u} value={u}>{u}</option>)}
        </select>
      </td>
      <td style={{ padding:'8px 4px' }}>
        <input value={badge} onChange={e=>{setBadge(e.target.value);setChanged(true);}} style={{ ...iS, width:70 }} />
      </td>
      <td style={{ padding:'8px 4px' }}>
        <span style={{ fontSize:10, fontWeight:700, padding:'3px 7px', borderRadius:50, background:stock<=0?'#fee2e2':stock<20?'#fff7ed':'#e6f4ec', color:stock<=0?'#e24b4a':stock<20?'#f07c2a':'#145530' }}>
          {stock<=0?'OUT':stock<20?'LOW':'OK'}
        </span>
      </td>
      <td style={{ padding:'8px 4px' }}>
        <div style={{ display:'flex', gap:4 }}>
          <button onClick={()=>{onSave(product._id,{price,mrp,stock,badge,unit});setChanged(false);}}
            style={{ background:changed?'#f07c2a':'#145530', color:'#fff', border:'none', borderRadius:50, padding:'4px 10px', fontSize:10, fontWeight:700, cursor:'pointer' }}>
            {changed?'Save!':'OK'}
          </button>
          <button onClick={()=>{ if(window.confirm('Delete '+product.name+'?')) onDelete(product._id); }}
            style={{ background:'#fee2e2', color:'#e24b4a', border:'none', borderRadius:50, padding:'4px 8px', fontSize:10, fontWeight:700, cursor:'pointer' }}>Del</button>
        </div>
      </td>
    </tr>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { products, updateProduct, addProduct, deleteProduct, ratings, approveRating, rejectRating, blockedUsers, blockUser, unblockUser } = useProducts();

  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [coupons, setCoupons] = useState(() => { try { return JSON.parse(localStorage.getItem('apnidukan_coupons')||'[]'); } catch { return []; } });
  const [newProduct, setNewProduct] = useState({ name:'', nameHindi:'', price:'', mrp:'', stock:'', category:'vegetables', badge:'Fresh', quantity:'', unit:'kg', img:'', description:'' });
  const [newCoupon, setNewCoupon] = useState({ code:'', type:'flat', value:'', minOrder:'', usageLimit:'' });
  const [blockPassword, setBlockPassword] = useState('');
  const [blockTarget, setBlockTarget] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');
    if (!auth || !authTime || Date.now()-Number(authTime) > 8*60*60*1000) { navigate('/admin-login'); return; }
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(API+'/orders/all', { headers:{ Authorization:'Bearer '+token } });
      setOrders(data);
    } catch { setOrders([]); }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get(API+'/auth/users', { headers:{ Authorization:'Bearer '+token } });
      setCustomers(data);
    } catch { setCustomers([]); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(API+'/orders/'+id+'/status', { status }, { headers:{ Authorization:'Bearer '+token } });
      if (status==='Delivered') {
        await axios.put(API+'/orders/'+id+'/payment', { paymentStatus:'Done' }, { headers:{ Authorization:'Bearer '+token } }).catch(()=>{});
        toast.success('Status: Delivered + Payment: Done ✅');
      } else { toast.success('Status: '+status+' ✅'); }
      fetchOrders();
    } catch { toast.error('Update fail'); }
  };

  const handleSave = (id, updates) => { updateProduct(id, updates); toast.success('✅ Main website pe bhi update ho gaya!'); };
  const handleDelete = (id) => { deleteProduct(id); toast.success('Product delete ho gaya'); };

  const handleAddProduct = () => {
    if (!newProduct.name||!newProduct.price||!newProduct.stock) { toast.error('Naam, price aur stock zaruri hai'); return; }
    addProduct({ ...newProduct, price:Number(newProduct.price), mrp:Number(newProduct.mrp||newProduct.price), stock:Number(newProduct.stock) });
    toast.success(newProduct.name+' add ho gaya! ✅');
    setNewProduct({ name:'', nameHindi:'', price:'', mrp:'', stock:'', category:'vegetables', badge:'Fresh', quantity:'', unit:'kg', img:'', description:'' });
  };

  const saveCoupons = (arr) => { setCoupons(arr); localStorage.setItem('apnidukan_coupons', JSON.stringify(arr)); };
  const addCoupon = () => {
    if (!newCoupon.code||!newCoupon.value) { toast.error('Code aur value zaruri hai'); return; }
    if (coupons.find(c=>c.code.toUpperCase()===newCoupon.code.toUpperCase())) { toast.error('Code pehle se hai'); return; }
    const updated = [...coupons, { ...newCoupon, code:newCoupon.code.toUpperCase(), value:Number(newCoupon.value), minOrder:Number(newCoupon.minOrder||0), usageLimit:Number(newCoupon.usageLimit||999), used:0, active:true }];
    saveCoupons(updated); toast.success('Coupon create ho gaya! ✅');
    setNewCoupon({ code:'', type:'flat', value:'', minOrder:'', usageLimit:'' });
  };

  const handleBlockUser = (customer) => {
    if (blockPassword !== 'Y@sh1234') { toast.error('Galat password!'); return; }
    blockUser(customer);
    toast.success(customer.name+' ko block kar diya!');
    setBlockTarget(null); setBlockPassword('');
  };

  const logout = () => { localStorage.removeItem('adminAuth'); localStorage.removeItem('adminAuthTime'); navigate('/admin-login'); };

  const tabBtn = (active) => ({ padding:'8px 15px', border:'none', borderRadius:50, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Poppins, sans-serif', background:active?'#145530':'#e6f4ec', color:active?'#fff':'#145530' });
  const inp = { width:'100%', padding:'9px 11px', border:'1.5px solid #d0e8d8', borderRadius:9, fontSize:12, outline:'none', fontFamily:'Poppins, sans-serif', background:'#f5f9f6', marginBottom:8, boxSizing:'border-box' };

  const STATUS_COLORS = { Placed:'#378ADD', Packed:'#BA7517', 'Out for Delivery':'#f07c2a', Delivered:'#145530', Cancelled:'#e24b4a' };
  const STEPS = ['Placed','Packed','Out for Delivery','Delivered'];

  const totalRevenue = orders.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+(o.grandTotal||o.total||0),0);
  const todayOrders = orders.filter(o=>new Date(o.createdAt).toDateString()===new Date().toDateString()).length;
  const lowStock = products.filter(p=>p.stock<20).length;
  const pendingRatings = ratings.filter(r=>r.status==='pending').length;

  const filteredProducts = products.filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.nameHindi&&p.nameHindi.includes(productSearch)) || p.category.includes(productSearch.toLowerCase()));
  const filteredOrders = orders.filter(o => !orderSearch || (o.receiptNumber&&o.receiptNumber.includes(orderSearch)) || (o.address?.name&&o.address.name.toLowerCase().includes(orderSearch.toLowerCase())) || (o.address?.phone&&o.address.phone.includes(orderSearch)));

  return (
    <div style={{ background:'#f5f9f6', minHeight:'100vh', fontFamily:'Poppins, sans-serif' }}>

      {/* Block user modal */}
      {blockTarget && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:'28px', maxWidth:380, width:'100%' }}>
            <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>🔒 Block Customer</h3>
            <p style={{ fontSize:13, color:'#6b8f71', marginBottom:16 }}>{blockTarget.name} ({blockTarget.email}) ko permanently block karoge?</p>
            <label style={{ fontSize:11, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:5 }}>Admin Password *</label>
            <input type="password" style={inp} placeholder="Y@sh1234" value={blockPassword} onChange={e=>setBlockPassword(e.target.value)} />
            <div style={{ display:'flex', gap:10, marginTop:14 }}>
              <button onClick={()=>handleBlockUser(blockTarget)} style={{ flex:1, background:'#e24b4a', color:'#fff', border:'none', borderRadius:50, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Block User</button>
              <button onClick={()=>{setBlockTarget(null);setBlockPassword('');}} style={{ flex:1, background:'#f5f5f5', color:'#6b8f71', border:'none', borderRadius:50, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:'linear-gradient(135deg,#0a2e1a,#145530)', padding:'16px 22px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div>
          <h1 style={{ fontFamily:'Baloo 2, cursive', fontSize:20, fontWeight:800, color:'#fff' }}>👑 Admin Panel — Apni Dukan</h1>
          <p style={{ color:'#86efac', fontSize:11, marginTop:1 }}>Saari cheezein yahan se manage karo</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={()=>navigate('/')} style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.3)', borderRadius:50, padding:'6px 15px', fontSize:12, fontWeight:600, cursor:'pointer' }}>🏠</button>
          <button onClick={logout} style={{ background:'#fee2e2', color:'#e24b4a', border:'none', borderRadius:50, padding:'6px 15px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, padding:'14px 20px 0' }}>
        {[['📦','Orders',orders.length,'#145530'],['📅','Aaj',todayOrders,'#f07c2a'],['💰','Revenue','Rs.'+totalRevenue.toLocaleString('en-IN'),'#145530'],['⚠️','Low Stock',lowStock,lowStock>0?'#e24b4a':'#145530'],['⭐','Ratings Pending',pendingRatings,pendingRatings>0?'#f07c2a':'#145530']].map(([icon,label,value,color])=>(
          <div key={label} style={{ background:'#fff', borderRadius:13, border:'1.5px solid #e8f2ea', padding:'12px' }}>
            <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
            <div style={{ fontSize:10, color:'#6b8f71', fontWeight:600, marginBottom:2 }}>{label}</div>
            <div style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {lowStock>0 && <div style={{ margin:'10px 20px 0', background:'#fee2e2', border:'1.5px solid #fca5a5', borderRadius:11, padding:'9px 13px', fontSize:12, color:'#e24b4a', fontWeight:600 }}>⚠️ Low Stock: {products.filter(p=>p.stock<20).slice(0,5).map(p=>p.name).join(', ')}</div>}

      {/* Tabs */}
      <div style={{ display:'flex', gap:7, padding:'12px 20px 0', flexWrap:'wrap' }}>
        {[['orders','📦 Orders'],['stock','📊 Stock'],['add','➕ Add'],['coupons','🎟️ Coupons'],['ratings','⭐ Ratings'],['customers','👥 Customers']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={tabBtn(tab===t)}>{l}</button>
        ))}
      </div>

      <div style={{ padding:'12px 20px 40px' }}>

        {/* ORDERS */}
        {tab==='orders' && (
          <div>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12, flexWrap:'wrap' }}>
              <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', flex:1 }}>Orders ({filteredOrders.length})</h2>
              <input placeholder="Name, phone, receipt..." value={orderSearch} onChange={e=>setOrderSearch(e.target.value)} style={{ padding:'7px 13px', border:'1.5px solid #d0e8d8', borderRadius:50, fontSize:12, outline:'none', width:230, background:'#fff' }} />
              <button onClick={fetchOrders} style={{ background:'#e6f4ec', color:'#145530', border:'1.5px solid #b8dfc6', borderRadius:50, padding:'7px 13px', fontSize:12, fontWeight:700, cursor:'pointer' }}>🔄</button>
            </div>
            {filteredOrders.length===0 ? <div style={{ textAlign:'center', padding:'40px', background:'#fff', borderRadius:16 }}><div style={{ fontSize:32, marginBottom:8 }}>📭</div><p style={{ color:'#6b8f71' }}>Koi order nahi</p></div> :
            filteredOrders.map(order=>(
              <div key={order._id} style={{ background:'#fff', borderRadius:15, border:'1.5px solid #e8f2ea', padding:'14px', marginBottom:11 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, flexWrap:'wrap', gap:6 }}>
                  <div>
                    <div style={{ fontFamily:'Baloo 2, cursive', fontSize:14, fontWeight:800, color:'#0a2e1a' }}>#{order.receiptNumber||order._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize:10, color:'#6b8f71' }}>{new Date(order.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:50, background:(STATUS_COLORS[order.status]||'#888')+'20', color:STATUS_COLORS[order.status]||'#888' }}>{order.status}</span>
                    <span style={{ fontSize:10, padding:'3px 8px', borderRadius:50, background:'#f5f9f6', color:'#4a6b50', fontWeight:600 }}>{order.paymentMethod} — {order.paymentStatus}</span>
                  </div>
                </div>
                <div style={{ background:'#f5f9f6', borderRadius:10, padding:'10px 12px', marginBottom:9, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <div>
                    <div style={{ fontSize:9, color:'#6b8f71', fontWeight:700, marginBottom:3 }}>👤 CUSTOMER</div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#0a2e1a' }}>{order.address?.name}</div>
                    {order.address?.phone && <a href={'tel:'+order.address.phone} style={{ fontSize:11, color:'#145530', fontWeight:700, textDecoration:'none' }}>📞 {order.address.phone}</a>}
                  </div>
                  <div>
                    <div style={{ fontSize:9, color:'#6b8f71', fontWeight:700, marginBottom:3 }}>📍 ADDRESS</div>
                    <div style={{ fontSize:11, color:'#0a2e1a', lineHeight:1.5 }}>{order.address?.street}{order.address?.landmark?', '+order.address.landmark:''}<br />{order.address?.city} — {order.address?.pincode}</div>
                    {order.address?.location?.lat && <a href={'https://maps.google.com/?q='+order.address.location.lat+','+order.address.location.lng} target="_blank" rel="noreferrer" style={{ fontSize:10, color:'#145530', fontWeight:700, textDecoration:'none' }}>🗺️ Map</a>}
                  </div>
                </div>
                {order.items?.map((item,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:11, padding:'4px 0', borderBottom:'1px solid #f0f7f2' }}>
                    <span>{item.name} <span style={{ color:'#6b8f71' }}>x{item.qty}</span></span>
                    <span style={{ fontWeight:700, color:'#145530' }}>Rs.{item.price*item.qty}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:13, marginTop:7, fontFamily:'Baloo 2, cursive', color:'#0a2e1a' }}>
                  <span>Total</span><span style={{ color:'#145530' }}>Rs.{order.grandTotal||order.total}</span>
                </div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center', marginTop:9, paddingTop:7, borderTop:'1px solid #f0f7f2' }}>
                  <span style={{ fontSize:10, color:'#6b8f71', fontWeight:600 }}>Update:</span>
                  {STEPS.map(s=>(
                    <button key={s} onClick={()=>updateOrderStatus(order._id,s)}
                      style={{ background:order.status===s?(STATUS_COLORS[s]||'#888'):'#f5f9f6', color:order.status===s?'#fff':'#4a6b50', border:'1.5px solid '+(order.status===s?(STATUS_COLORS[s]||'#888'):'#e8f2ea'), borderRadius:50, padding:'4px 9px', fontSize:9, fontWeight:700, cursor:'pointer' }}>{s}</button>
                  ))}
                  <button onClick={()=>updateOrderStatus(order._id,'Cancelled')} style={{ background:'#fff0f0', color:'#e24b4a', border:'1.5px solid #fca5a5', borderRadius:50, padding:'4px 8px', fontSize:9, fontWeight:700, cursor:'pointer' }}>Cancel</button>
                  <a href={'https://wa.me/91'+(order.address?.phone||'').replace(/\D/g,'').slice(-10)+'?text='+encodeURIComponent('Namaste '+(order.address?.name||'')+'! Order #'+(order.receiptNumber||order._id.slice(-6).toUpperCase())+' status: '+order.status+'. Total: Rs.'+(order.grandTotal||order.total))}
                    target="_blank" rel="noreferrer" style={{ marginLeft:'auto', background:'#25D366', color:'#fff', borderRadius:50, padding:'4px 11px', textDecoration:'none', fontSize:9, fontWeight:700 }}>💬 WA</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STOCK */}
        {tab==='stock' && (
          <div>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:11, flexWrap:'wrap' }}>
              <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', flex:1 }}>Stock & Prices ({filteredProducts.length})</h2>
              <div style={{ display:'flex', alignItems:'center', background:'#fff', border:'1.5px solid #d0e8d8', borderRadius:50, padding:'6px 13px', gap:7 }}>
                <span>🔍</span>
                <input placeholder="Search product..." value={productSearch} onChange={e=>setProductSearch(e.target.value)} style={{ border:'none', outline:'none', fontSize:12, fontFamily:'Poppins, sans-serif', width:170, background:'transparent' }} />
                {productSearch && <button onClick={()=>setProductSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b8f71', fontSize:13 }}>✕</button>}
              </div>
            </div>
            <div style={{ background:'#e6f4ec', borderRadius:9, padding:'8px 13px', marginBottom:11, fontSize:12, color:'#145530', fontWeight:500 }}>
              💡 Price/stock change karo → Save! button dabao → Main website pe turant update!
            </div>
            <div style={{ overflowX:'auto', borderRadius:13, border:'1.5px solid #e8f2ea' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', background:'#fff' }}>
                <thead>
                  <tr style={{ background:'#145530' }}>
                    {['Product','Cat','MRP','Sale Price','Stock','Unit','Badge','Status','Action'].map(h=>(
                      <th key={h} style={{ padding:'8px 9px', textAlign:'left', fontSize:10, fontWeight:700, color:'#fff', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{filteredProducts.map(p=><ProductRow key={p._id} product={p} onSave={handleSave} onDelete={handleDelete} />)}</tbody>
              </table>
              {filteredProducts.length===0 && <div style={{ textAlign:'center', padding:'24px', color:'#6b8f71' }}>Koi product nahi mila</div>}
            </div>
          </div>
        )}

        {/* ADD PRODUCT */}
        {tab==='add' && (
          <div style={{ maxWidth:560 }}>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:13 }}>➕ Naya Product Add Karo</h2>
            <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid #e8f2ea', padding:'20px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 11px' }}>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Naam *</label><input style={inp} placeholder="Fresh Tomato" value={newProduct.name} onChange={e=>setNewProduct({...newProduct,name:e.target.value})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Hindi Naam</label><input style={inp} placeholder="ताज़ा टमाटर" value={newProduct.nameHindi} onChange={e=>setNewProduct({...newProduct,nameHindi:e.target.value})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>MRP *</label><input type="number" style={inp} placeholder="45" value={newProduct.mrp} onChange={e=>setNewProduct({...newProduct,mrp:e.target.value})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Sale Price *</label><input type="number" style={inp} placeholder="35" value={newProduct.price} onChange={e=>setNewProduct({...newProduct,price:e.target.value})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Stock *</label><input type="number" style={inp} placeholder="100" value={newProduct.stock} onChange={e=>setNewProduct({...newProduct,stock:e.target.value})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Unit</label>
                  <select value={newProduct.unit} onChange={e=>setNewProduct({...newProduct,unit:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    {['kg','g','litre','ml','pcs','dozen'].map(u=><option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Quantity (display)</label><input style={inp} placeholder="1 kg / 500 g / 6 pcs" value={newProduct.quantity} onChange={e=>setNewProduct({...newProduct,quantity:e.target.value})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Badge</label><input style={inp} placeholder="Fresh/New/Hot" value={newProduct.badge} onChange={e=>setNewProduct({...newProduct,badge:e.target.value})} /></div>
                <div style={{ gridColumn:'span 2' }}>
                  <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Category</label>
                  <select value={newProduct.category} onChange={e=>setNewProduct({...newProduct,category:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    {['vegetables','fruits','dairy','grains','oil','snacks','drinks','household'].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Image URL</label>
              <input style={inp} placeholder="https://images.unsplash.com/..." value={newProduct.img} onChange={e=>setNewProduct({...newProduct,img:e.target.value})} />
              <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Description</label>
              <input style={inp} placeholder="Product ki description..." value={newProduct.description} onChange={e=>setNewProduct({...newProduct,description:e.target.value})} />
              {newProduct.price&&newProduct.mrp&&Number(newProduct.mrp)>Number(newProduct.price) && (
                <div style={{ background:'#e6f4ec', borderRadius:8, padding:'7px 11px', marginBottom:9, fontSize:12, color:'#145530', fontWeight:600 }}>
                  ✅ {Math.round(((newProduct.mrp-newProduct.price)/newProduct.mrp)*100)}% off — Rs.{newProduct.mrp-newProduct.price} bachat!
                </div>
              )}
              <button onClick={handleAddProduct} style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'12px', fontSize:14, fontWeight:700, cursor:'pointer' }}>➕ Add Karo</button>
            </div>
          </div>
        )}

        {/* COUPONS */}
        {tab==='coupons' && (
          <div>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:13 }}>🎟️ Coupon Codes</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:11, marginBottom:22 }}>
              {coupons.map(c=>(
                <div key={c.code} style={{ background:'#fff', borderRadius:15, border:'1.5px solid '+(c.active?'#b8dfc6':'#e8f2ea'), padding:'14px', opacity:c.active?1:0.65 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                    <div style={{ fontFamily:'Baloo 2, cursive', fontSize:17, fontWeight:800, color:'#145530' }}>{c.code}</div>
                    <span style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:50, background:c.active?'#e6f4ec':'#fee2e2', color:c.active?'#145530':'#e24b4a' }}>{c.active?'Active':'Off'}</span>
                  </div>
                  <div style={{ fontSize:12, color:'#0a2e1a', fontWeight:600, marginBottom:2 }}>{c.type==='flat'?'Rs.'+c.value+' OFF':c.value+'% OFF'}</div>
                  <div style={{ fontSize:10, color:'#6b8f71', marginBottom:10 }}>Min: Rs.{c.minOrder} | Used: {c.used||0}/{c.usageLimit}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={()=>saveCoupons(coupons.map(x=>x.code===c.code?{...x,active:!x.active}:x))} style={{ flex:1, background:c.active?'#fff7ed':'#e6f4ec', color:c.active?'#f07c2a':'#145530', border:'1.5px solid '+(c.active?'#fed7aa':'#b8dfc6'), borderRadius:50, padding:'5px', fontSize:10, fontWeight:700, cursor:'pointer' }}>{c.active?'Disable':'Enable'}</button>
                    <button onClick={()=>saveCoupons(coupons.filter(x=>x.code!==c.code))} style={{ background:'#fee2e2', color:'#e24b4a', border:'1.5px solid #fca5a5', borderRadius:50, padding:'5px 9px', fontSize:10, fontWeight:700, cursor:'pointer' }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:'#fff', borderRadius:17, border:'1.5px solid #e8f2ea', padding:'18px', maxWidth:460 }}>
              <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:16, fontWeight:800, color:'#0a2e1a', marginBottom:12 }}>➕ Naya Coupon</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 11px' }}>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Code *</label><input style={inp} placeholder="SAVE20" value={newCoupon.code} onChange={e=>setNewCoupon({...newCoupon,code:e.target.value.toUpperCase()})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Type</label>
                  <select value={newCoupon.type} onChange={e=>setNewCoupon({...newCoupon,type:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    <option value="flat">Flat (Rs.)</option>
                    <option value="percent">Percent (%)</option>
                  </select>
                </div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>{newCoupon.type==='flat'?'Amount *':'Percent * (%)'}</label><input type="number" style={inp} placeholder={newCoupon.type==='flat'?'50':'10'} value={newCoupon.value} onChange={e=>setNewCoupon({...newCoupon,value:e.target.value})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Min Order</label><input type="number" style={inp} placeholder="199" value={newCoupon.minOrder} onChange={e=>setNewCoupon({...newCoupon,minOrder:e.target.value})} /></div>
                <div><label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:3 }}>Usage Limit</label><input type="number" style={inp} placeholder="100" value={newCoupon.usageLimit} onChange={e=>setNewCoupon({...newCoupon,usageLimit:e.target.value})} /></div>
              </div>
              <button onClick={addCoupon} style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'12px', fontSize:13, fontWeight:700, cursor:'pointer' }}>🎟️ Create Coupon</button>
            </div>
          </div>
        )}

        {/* RATINGS */}
        {tab==='ratings' && (
          <div>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:13 }}>⭐ Customer Ratings</h2>
            {ratings.length===0 ? (
              <div style={{ textAlign:'center', padding:'40px', background:'#fff', borderRadius:16 }}><div style={{ fontSize:36, marginBottom:8 }}>⭐</div><p style={{ color:'#6b8f71' }}>Abhi koi rating nahi hai</p></div>
            ) : ratings.map((r,i)=>(
              <div key={i} style={{ background:'#fff', borderRadius:15, border:'1.5px solid '+(r.status==='approved'?'#b8dfc6':r.status==='rejected'?'#fca5a5':'#e8f2ea'), padding:'14px', marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8, flexWrap:'wrap', gap:6 }}>
                  <div>
                    <div style={{ fontFamily:'Baloo 2, cursive', fontSize:15, fontWeight:800, color:'#0a2e1a' }}>{r.customerName||'Customer'}</div>
                    <div style={{ fontSize:10, color:'#6b8f71', marginTop:2 }}>{new Date(r.createdAt).toLocaleDateString('en-IN')} | Order #{(r.orderId||'').slice(-6).toUpperCase()}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:50, background:r.status==='approved'?'#e6f4ec':r.status==='rejected'?'#fee2e2':'#fff7ed', color:r.status==='approved'?'#145530':r.status==='rejected'?'#e24b4a':'#f07c2a' }}>
                    {r.status==='approved'?'✅ Approved':r.status==='rejected'?'❌ Rejected':'⏳ Pending'}
                  </span>
                </div>
                <div style={{ display:'flex', gap:2, marginBottom:7 }}>
                  {[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:18, color:s<=r.stars?'#f59e0b':'#d1d5db' }}>★</span>)}
                  <span style={{ fontSize:12, color:'#6b8f71', marginLeft:6, alignSelf:'center' }}>({r.stars}/5)</span>
                </div>
                {r.comment && <p style={{ fontSize:13, color:'#0a2e1a', fontStyle:'italic', lineHeight:1.6, marginBottom:10 }}>"{r.comment}"</p>}
                {r.status==='pending' && (
                  <div style={{ display:'flex', gap:9 }}>
                    <button onClick={()=>{ approveRating(r.id); toast.success('Rating approved! Home page pe dikhegi ✅'); }}
                      style={{ background:'#e6f4ec', color:'#145530', border:'1.5px solid #b8dfc6', borderRadius:50, padding:'7px 18px', fontSize:12, fontWeight:700, cursor:'pointer' }}>✅ Approve</button>
                    <button onClick={()=>{ rejectRating(r.id); toast.success('Rating reject kar di'); }}
                      style={{ background:'#fee2e2', color:'#e24b4a', border:'1.5px solid #fca5a5', borderRadius:50, padding:'7px 18px', fontSize:12, fontWeight:700, cursor:'pointer' }}>❌ Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CUSTOMERS */}
        {tab==='customers' && (
          <div>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:800, color:'#0a2e1a', marginBottom:13 }}>👥 Customers</h2>

            {/* Blocked users */}
            {blockedUsers.length>0 && (
              <div style={{ marginBottom:18 }}>
                <h3 style={{ fontFamily:'Baloo 2, cursive', fontSize:15, fontWeight:800, color:'#e24b4a', marginBottom:10 }}>🔒 Blocked Users ({blockedUsers.length})</h3>
                {blockedUsers.map((u,i)=>(
                  <div key={i} style={{ background:'#fff', borderRadius:13, border:'1.5px solid #fca5a5', padding:'12px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#0a2e1a' }}>{u.name}</div>
                      <div style={{ fontSize:11, color:'#6b8f71' }}>{u.email} | {u.phone}</div>
                    </div>
                    <button onClick={()=>{ unblockUser(u.email); toast.success(u.name+' unblock kar diya!'); }}
                      style={{ background:'#e6f4ec', color:'#145530', border:'1.5px solid #b8dfc6', borderRadius:50, padding:'6px 14px', fontSize:11, fontWeight:700, cursor:'pointer' }}>Unblock</button>
                  </div>
                ))}
              </div>
            )}

            {customers.length===0 ? (
              <div style={{ textAlign:'center', padding:'40px', background:'#fff', borderRadius:16 }}>
                <div style={{ fontSize:36, marginBottom:8 }}>👥</div>
                <p style={{ color:'#6b8f71', fontSize:13 }}>Backend connect karo customers dekhne ke liye</p>
                <p style={{ color:'#9ca3af', fontSize:11, marginTop:4 }}>localhost:5000 pe backend chalu karo</p>
              </div>
            ) : customers.map((c,i)=>(
              <div key={i} style={{ background:'#fff', borderRadius:13, border:'1.5px solid #e8f2ea', padding:'12px', marginBottom:9, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, background:'#145530', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, fontWeight:800, flexShrink:0 }}>
                  {c.name?c.name.charAt(0).toUpperCase():'U'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0a2e1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                  <div style={{ fontSize:11, color:'#6b8f71' }}>{c.email} | {c.phone||'N/A'}</div>
                </div>
                <button onClick={()=>setBlockTarget(c)}
                  style={{ background:'#fee2e2', color:'#e24b4a', border:'1.5px solid #fca5a5', borderRadius:50, padding:'6px 13px', fontSize:11, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                  🔒 Block
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width:768px) {
          div[style*="repeat(5,1fr)"] { grid-template-columns:repeat(2,1fr) !important; }
          div[style*="repeat(3,1fr)"] { grid-template-columns:1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns:1fr !important; }
          div[style*="padding: 12px 20px"] { padding:12px !important; }
        }
      `}</style>
    </div>
  );
}