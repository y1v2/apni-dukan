import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [forgotMethod, setForgotMethod] = useState('email');
  const [forgotContact, setForgotContact] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const inp = {
    width: '100%', padding: '13px 16px', border: '2px solid #d0e8d8', borderRadius: 14,
    fontSize: 14, outline: 'none', marginBottom: 14, fontFamily: 'Poppins, sans-serif',
    color: '#0a2e1a', background: '#f5f9f6', boxSizing: 'border-box', transition: 'border-color 0.2s'
  };

  const handleAuth = async () => {
    if (tab === 'login') {
      if (!form.email || !form.password) { toast.error('Email aur password bharo'); return; }
    } else {
      if (!form.name || !form.email || !form.password) { toast.error('Sab fields bharo'); return; }
      if (form.password.length < 6) { toast.error('Password kam se kam 6 characters ka hona chahiye'); return; }
    }
    setLoading(true);
    try {
      const url = 'http://localhost:5000/api/auth/' + (tab === 'login' ? 'login' : 'register');
      const { data } = await axios.post(url, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(tab === 'login' ? 'Welcome back! 🎉' : 'Account ban gaya! 🎉');
      navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Kuch galat ho gaya');
    }
    setLoading(false);
  };

  const sendOtp = () => {
    if (!forgotContact.trim()) { toast.error(forgotMethod === 'email' ? 'Email daalo' : 'Phone number daalo'); return; }
    if (forgotMethod === 'email' && !forgotContact.includes('@')) { toast.error('Sahi email daalo'); return; }
    if (forgotMethod === 'phone' && forgotContact.replace(/\D/g, '').length < 10) { toast.error('10 digit phone number daalo'); return; }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setTab('otp');

    if (forgotMethod === 'email') {
      toast.success('OTP bheja gaya! (Demo: ' + code + ')', { duration: 15000 });
    } else {
      toast.success('OTP bheja gaya SMS se! (Demo: ' + code + ')', { duration: 15000 });
    }
    console.log('Demo OTP:', code);
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 6) { toast.error('6 digit OTP daalo'); return; }
    if (entered === generatedOtp) {
      setTab('newpass');
      toast.success('OTP verified! ✅ Ab naya password banao');
    } else {
      toast.error('Galat OTP! Dobara check karo.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const resetPassword = () => {
    if (!newPass || newPass.length < 6) { toast.error('Password kam se kam 6 characters ka hona chahiye'); return; }
    if (newPass !== confirmPass) { toast.error('Dono passwords match nahi kar rahe'); return; }
    toast.success('Password reset ho gaya! Ab login karo. ✅');
    setTab('login');
    setForgotContact('');
    setOtp(['', '', '', '', '', '']);
    setOtpSent(false);
  };

  const handleOtpChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #0a2e1a, #145530)', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 300, height: 300, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', top: -80, left: -80, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', bottom: -60, right: -60, pointerEvents: 'none' }} />

      <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#145530' }}>
            apni<span style={{ color: '#f07c2a' }}>dukan</span>
          </div>
          <p style={{ color: '#6b8f71', fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
            "Agar chahiye ho fresh samaan, to best option hai Apni Dukan!"
          </p>
        </div>

        {/* LOGIN / REGISTER */}
        {(tab === 'login' || tab === 'register') && (
          <>
            {/* Tab switcher */}
            <div style={{ display: 'flex', background: '#f5f9f6', borderRadius: 50, padding: 4, marginBottom: 22 }}>
              {[['login', 'Login'], ['register', 'Sign Up']].map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', background: tab === t ? '#145530' : 'transparent', color: tab === t ? '#fff' : '#6b8f71', transition: 'all 0.2s' }}>
                  {l}
                </button>
              ))}
            </div>

            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0a2e1a', marginBottom: 4 }}>
              {tab === 'login' ? 'Welcome Back! 👋' : 'Join Apni Dukan! 🛒'}
            </h2>
            <p style={{ color: '#6b8f71', fontSize: 12, marginBottom: 20 }}>
              {tab === 'login' ? 'Apne account mein login karo' : 'Aaj apna free account banao'}
            </p>

            {tab === 'register' && (
              <>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Poora Naam *</label>
                <input style={inp} placeholder="Apna poora naam" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </>
            )}

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Email Address *</label>
            <input style={inp} placeholder="aapki@email.com" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

            {tab === 'register' && (
              <>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Phone Number (unique) *</label>
                <input style={inp} placeholder="10 digit mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={10} />
              </>
            )}

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Password *</label>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <input style={{ ...inp, marginBottom: 0, paddingRight: 48 }} type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') handleAuth(); }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            {tab === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -6 }}>
                <span onClick={() => setTab('forgot')} style={{ fontSize: 12, color: '#145530', fontWeight: 700, cursor: 'pointer' }}>Forgot Password?</span>
              </div>
            )}

            <button onClick={handleAuth} disabled={loading}
              style={{ width: '100%', background: loading ? '#a8bfac' : 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', boxShadow: '0 8px 20px rgba(20,85,48,0.28)', marginBottom: 14 }}>
              {loading ? '⏳ Please wait...' : tab === 'login' ? 'Login →' : 'Account Banao →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: '#e8f2ea' }} />
              <span style={{ fontSize: 11, color: '#6b8f71' }}>YA</span>
              <div style={{ flex: 1, height: 1, background: '#e8f2ea' }} />
            </div>

            <a href="https://wa.me/917355691229?text=Mujhe Apni Dukan pe account banana hai" target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', background: '#25D366', color: '#fff', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, textDecoration: 'none', marginBottom: 14 }}>
              💬 WhatsApp se Order Karo
            </a>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {tab === 'forgot' && (
          <>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>Password Reset 🔑</h2>
            <p style={{ color: '#6b8f71', fontSize: 12, marginBottom: 20 }}>OTP bhejne ka tarika choose karo</p>

            {/* Method selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[['email', '📧', 'Email se OTP'], ['phone', '📱', 'SMS se OTP']].map(([m, icon, label]) => (
                <div key={m} onClick={() => setForgotMethod(m)}
                  style={{ border: '2px solid ' + (forgotMethod === m ? '#145530' : '#e8f2ea'), borderRadius: 14, padding: '14px 12px', cursor: 'pointer', background: forgotMethod === m ? '#e6f4ec' : '#fff', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2e1a' }}>{label}</div>
                  {forgotMethod === m && <div style={{ fontSize: 10, color: '#145530', fontWeight: 700, marginTop: 4 }}>✓ Selected</div>}
                </div>
              ))}
            </div>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>
              {forgotMethod === 'email' ? 'Registered Email *' : 'Registered Phone Number *'}
            </label>
            <input style={inp} type={forgotMethod === 'email' ? 'email' : 'tel'}
              placeholder={forgotMethod === 'email' ? 'aapki@email.com' : '10 digit mobile number'}
              value={forgotContact} onChange={e => setForgotContact(e.target.value)} maxLength={forgotMethod === 'phone' ? 10 : undefined} />

            <div style={{ background: '#e6f4ec', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#145530', fontWeight: 500 }}>
              {forgotMethod === 'email'
                ? '📧 OTP aapke email par bheja jayega (Demo mein screen pe dikhega)'
                : '📱 OTP SMS se aayega aapke number par (Demo mein screen pe dikhega)'}
            </div>

            <button onClick={sendOtp}
              style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', marginBottom: 12 }}>
              {forgotMethod === 'email' ? '📧 Email par OTP Bhejo' : '📱 SMS se OTP Bhejo'}
            </button>

            <button onClick={() => setTab('login')}
              style={{ width: '100%', background: 'transparent', color: '#145530', border: '2px solid #145530', borderRadius: 50, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              ← Login par Wapas
            </button>
          </>
        )}

        {/* OTP VERIFY */}
        {tab === 'otp' && (
          <>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>OTP Verify Karo 🔢</h2>
            <p style={{ color: '#6b8f71', fontSize: 12, marginBottom: 6 }}>
              6-digit OTP bheja gaya {forgotMethod === 'email' ? 'email' : 'SMS'} se:
            </p>
            <p style={{ color: '#145530', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
              {forgotMethod === 'email' ? '📧 ' : '📱 '}{forgotContact}
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 22 }}>
              {otp.map((digit, i) => (
                <input key={i}
                  ref={el => otpRefs.current[i] = el}
                  maxLength={1} value={digit}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  onKeyDown={e => handleOtpKey(e, i)}
                  style={{ width: 44, height: 52, textAlign: 'center', fontSize: 20, fontWeight: 800, border: '2px solid ' + (digit ? '#145530' : '#d0e8d8'), borderRadius: 12, outline: 'none', fontFamily: 'Baloo 2, cursive', color: '#0a2e1a', background: '#f5f9f6', transition: 'border-color 0.2s' }} />
              ))}
            </div>

            <button onClick={verifyOtp}
              style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', marginBottom: 12 }}>
              Verify OTP →
            </button>

            <button onClick={() => { setOtpSent(false); setTab('forgot'); }}
              style={{ width: '100%', background: 'transparent', color: '#145530', border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', textDecoration: 'underline' }}>
              OTP nahi mila? Dobara Bhejo
            </button>

            <div style={{ background: '#fff7ed', borderRadius: 10, padding: '10px 12px', marginTop: 14, fontSize: 12, color: '#f07c2a', fontWeight: 500 }}>
              💡 Demo mode mein OTP screen pe toast notification mein dikhta hai (top mein). Real app mein email/SMS jayega.
            </div>
          </>
        )}

        {/* NEW PASSWORD */}
        {tab === 'newpass' && (
          <>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>Naya Password 🔒</h2>
            <p style={{ color: '#6b8f71', fontSize: 12, marginBottom: 20 }}>Strong password banao</p>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Naya Password *</label>
            <input style={inp} type="password" placeholder="Min 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} />

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 5 }}>Confirm Password *</label>
            <input style={inp} type="password" placeholder="Dobara same password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />

            {newPass && confirmPass && newPass !== confirmPass && (
              <div style={{ background: '#fee2e2', borderRadius: 10, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#e24b4a', fontWeight: 600 }}>
                ❌ Passwords match nahi kar rahe!
              </div>
            )}

            <button onClick={resetPassword}
              style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              Password Reset Karo ✅
            </button>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');
        @media (max-width: 480px) {
          div[style*="padding: 32px 28px"] { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}