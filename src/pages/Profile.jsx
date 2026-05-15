import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const { wallet, getSavedAddresses } = useCart();
  const { notifications, markNotifRead, referrals, generateReferralCode, registerReferralCode } = useProducts();

  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    bio: user?.bio || '',
    city: user?.city || '',
  });
  const [myCode, setMyCode] = useState('');
  const savedAddresses = getSavedAddresses();

  const unreadCount = notifications.filter(n => !(n.readBy || []).includes(user?.email)).length;

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem('apnidukan_my_referral_code');
    if (stored) {
      setMyCode(stored);
    } else {
      const code = generateReferralCode(user.name);
      setMyCode(code);
      localStorage.setItem('apnidukan_my_referral_code', code);
      registerReferralCode(code, user.email);
    }
  }, [user]);

  const myReferrals = referrals.filter(r => r.ownerEmail === user?.email);
  const successfulRefs = myReferrals.filter(r => r.rewarded).length;

  const handleSaveProfile = () => {
    if (!profileForm.name.trim()) { toast.error('Naam zaruri hai'); return; }
    const updated = { ...user, ...profileForm };
    localStorage.setItem('user', JSON.stringify(updated));
    toast.success('Profile update ho gayi! ✅');
    setEditing(false);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout ho gaya!');
    navigate('/');
    window.location.reload();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(myCode).then(() => toast.success('Code copied! 📋'));
  };

  const shareCode = () => {
    const msg = `🛒 Apni Dukan se fresh grocery order karo!\nKalpi ka apna online grocery store.\n\nPehli order par Rs.50 off — mera referral code use karo: *${myCode}*\n\nhttps://apnidukan.in`;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  };

  if (!user) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f9f6', padding: 20 }}>
      <div style={{ fontSize: 60, marginBottom: 14 }}>👤</div>
      <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#0a2e1a', marginBottom: 16 }}>Pehle login karo</h2>
      <Link to="/login" style={{ background: '#145530', color: '#fff', borderRadius: 50, padding: '13px 32px', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Login Karo →</Link>
    </div>
  );

  const tabBtn = (t) => ({
    flex: 1, padding: '10px 8px', border: 'none', background: activeTab === t ? '#145530' : 'transparent',
    color: activeTab === t ? '#fff' : '#6b8f71', borderRadius: 50, cursor: 'pointer', fontSize: 12,
    fontWeight: 700, fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s', position: 'relative'
  });

  const card = { background: '#fff', borderRadius: 18, border: '1.5px solid #e8f2ea', padding: '18px', marginBottom: 14 };
  const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #d0e8d8', borderRadius: 11, fontSize: 13, outline: 'none', marginBottom: 10, fontFamily: 'Poppins, sans-serif', background: '#f5f9f6', boxSizing: 'border-box' };

  const notifColors = { info: '#378ADD', offer: '#145530', alert: '#e24b4a', holiday: '#f07c2a' };

  return (
    <div style={{ background: '#f5f9f6', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a2e1a, #145530)', padding: '28px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: '#fff', fontWeight: 800, fontFamily: 'Baloo 2, cursive', flexShrink: 0, border: '3px solid rgba(255,255,255,0.4)' }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#fff' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: '#86efac', marginTop: 2 }}>{user.email}</div>
            {user.age && <div style={{ fontSize: 11, color: '#86efac', marginTop: 1 }}>Age: {user.age} years</div>}
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#fff' }}>Rs.{wallet}</div>
            <div style={{ fontSize: 10, color: '#86efac' }}>Wallet</div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#fff', padding: '8px', display: 'flex', gap: 4, borderBottom: '1.5px solid #e8f2ea', position: 'sticky', top: 0, zIndex: 10 }}>
        <button style={tabBtn('profile')} onClick={() => setActiveTab('profile')}>👤 Profile</button>
        <button style={tabBtn('notifications')} onClick={() => setActiveTab('notifications')}>
          🔔 Notifs
          {unreadCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#e24b4a', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{unreadCount}</span>}
        </button>
        <button style={tabBtn('referral')} onClick={() => setActiveTab('referral')}>🎁 Referral</button>
        <button style={tabBtn('addresses')} onClick={() => setActiveTab('addresses')}>📍 Address</button>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px' }}>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, color: '#0a2e1a', margin: 0 }}>Account Details</h3>
                <button onClick={() => setEditing(!editing)} style={{ background: '#e6f4ec', color: '#145530', border: '1.5px solid #b8dfc6', borderRadius: 50, padding: '6px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {editing ? 'Cancel' : '✏️ Edit'}
                </button>
              </div>

              {editing ? (
                <>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Naam</label>
                  <input style={inp} value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Phone</label>
                  <input style={inp} value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Age</label>
                  <input style={inp} type="number" value={profileForm.age} onChange={e => setProfileForm({ ...profileForm, age: e.target.value })} />
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Shehar / City</label>
                  <input style={inp} placeholder="Kalpi, Jalaun" value={profileForm.city} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} />
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 3 }}>Bio (optional)</label>
                  <textarea style={{ ...inp, resize: 'none' }} rows={2} placeholder="Apne baare mein kuch likho..." value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} />
                  <button onClick={handleSaveProfile} style={{ width: '100%', background: '#145530', color: '#fff', border: 'none', borderRadius: 50, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                    ✅ Save Profile
                  </button>
                </>
              ) : (
                <div>
                  {[['👤 Naam', user.name], ['📧 Email', user.email], ['📞 Phone', user.phone || 'Add karo'], ['🎂 Age', user.age ? user.age + ' years' : 'Add karo'], ['🏙️ City', user.city || 'Add karo'], ['📝 Bio', user.bio || 'Add karo']].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f7f2', fontSize: 13 }}>
                      <span style={{ color: '#6b8f71', fontWeight: 600 }}>{label}</span>
                      <span style={{ color: '#0a2e1a', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[['/orders', '📦', 'My Orders'], ['/support', '🤝', 'Help & Support']].map(([path, icon, label]) => (
                <Link key={path} to={path} style={{ ...card, textDecoration: 'none', textAlign: 'center', marginBottom: 0, display: 'block' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 13, fontWeight: 800, color: '#0a2e1a' }}>{label}</div>
                </Link>
              ))}
            </div>

            <button onClick={logout} style={{ width: '100%', background: '#fee2e2', color: '#e24b4a', border: '2px solid #fca5a5', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              Logout 👋
            </button>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>
              🔔 Notifications {unreadCount > 0 && <span style={{ background: '#e24b4a', color: '#fff', borderRadius: 50, padding: '2px 10px', fontSize: 11, marginLeft: 6 }}>{unreadCount} new</span>}
            </h3>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: 18 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
                <p style={{ color: '#6b8f71', fontSize: 14 }}>Abhi koi notification nahi hai</p>
              </div>
            ) : notifications.map(n => {
              const isRead = (n.readBy || []).includes(user.email);
              const color = notifColors[n.type] || '#378ADD';
              return (
                <div key={n.id} onClick={() => { if (!isRead) markNotifRead(n.id, user.email); }}
                  style={{ background: isRead ? '#fff' : '#f0f9f4', borderRadius: 14, border: '1.5px solid ' + (isRead ? '#e8f2ea' : color + '40'), padding: '14px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: color + '20', color }}>
                          {n.type === 'info' ? 'ℹ️ Info' : n.type === 'offer' ? '🎉 Offer' : n.type === 'alert' ? '⚠️ Alert' : '🎊 Festival'}
                        </span>
                        {!isRead && <span style={{ width: 8, height: 8, background: '#e24b4a', borderRadius: '50%', display: 'inline-block' }} />}
                      </div>
                      <p style={{ fontSize: 13, color: '#0a2e1a', lineHeight: 1.6, margin: 0, fontWeight: isRead ? 400 : 600 }}>{n.message}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#6b8f71', marginTop: 6 }}>
                    {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {isRead && <span style={{ marginLeft: 8, color: '#22c55e', fontWeight: 600 }}>✓ Read</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REFERRAL TAB */}
        {activeTab === 'referral' && (
          <div>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>🎁 Referral Program</h3>
            <p style={{ fontSize: 12, color: '#6b8f71', marginBottom: 16, lineHeight: 1.6 }}>
              Apna code share karo. Jab koi friend register karke apna <strong>pehla order complete</strong> karega, aapko <strong style={{ color: '#145530' }}>Rs.50 wallet</strong> mein milenge!
            </p>

            {/* Wallet balance */}
            <div style={{ background: 'linear-gradient(135deg, #0a2e1a, #145530)', borderRadius: 16, padding: '18px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#fff' }}>💰 Wallet Balance</div>
                <div style={{ fontSize: 11, color: '#86efac', marginTop: 2 }}>Checkout mein use kar sakte ho</div>
              </div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#fff' }}>Rs.{wallet}</div>
            </div>

            {/* Referral code */}
            <div style={{ ...card, background: 'linear-gradient(135deg, #e6f4ec, #c8e6d4)', border: '2px dashed #145530', textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: 11, color: '#6b8f71', fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>AAPKA REFERRAL CODE</div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 32, fontWeight: 800, color: '#145530', letterSpacing: 4, marginBottom: 8 }}>{myCode}</div>
              <div style={{ fontSize: 11, color: '#6b8f71' }}>Yeh code sirf aapka hai — unique!</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <button onClick={copyCode} style={{ background: '#e6f4ec', color: '#145530', border: '2px solid #b8dfc6', borderRadius: 50, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>📋 Copy Code</button>
              <button onClick={shareCode} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 50, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>💬 WhatsApp Share</button>
            </div>

            {/* Stats */}
            <div style={{ ...card }}>
              <h4 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#0a2e1a', marginBottom: 12 }}>Stats</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[['🔗', myReferrals.filter(r => r.usedBy).length, 'Registered'], ['✅', successfulRefs, 'Orders Done'], ['💰', 'Rs.' + successfulRefs * 50, 'Total Earned']].map(([icon, val, label]) => (
                  <div key={label} style={{ background: '#f5f9f6', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#145530' }}>{val}</div>
                    <div style={{ fontSize: 10, color: '#6b8f71' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SAVED ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0a2e1a', marginBottom: 14 }}>📍 Saved Addresses</h3>
            {savedAddresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: 18 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
                <p style={{ color: '#6b8f71', fontSize: 14 }}>Koi saved address nahi hai</p>
                <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>Order karne par address automatically save ho jaata hai</p>
              </div>
            ) : savedAddresses.map((addr, i) => (
              <div key={i} style={card}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#0a2e1a', marginBottom: 5 }}>{addr.name}</div>
                <div style={{ fontSize: 12, color: '#4a6b50', lineHeight: 1.7 }}>
                  {addr.street}{addr.landmark ? ', ' + addr.landmark : ''}<br />
                  {addr.city} — {addr.pincode}
                </div>
                <div style={{ fontSize: 12, color: '#145530', fontWeight: 700, marginTop: 4 }}>📞 {addr.phone}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}