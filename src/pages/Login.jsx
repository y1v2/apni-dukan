import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

// ⚠️ CHANGE THIS: Admin WhatsApp number to send OTP from
const ADMIN_WA_NUMBER = '917355691229';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', age: '', referralCode: '' });
  const [forgotContact, setForgotContact] = useState('');
  const [forgotType, setForgotType] = useState('phone'); // phone | email
  const [verifyStep, setVerifyStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { addToWallet } = useCart();
  const { applyReferral, isBlocked, registerReferralCode, generateReferralCode } = useProducts();

  const inp = {
    width: '100%', padding: '12px 15px', border: '2px solid #d0e8d8', borderRadius: 13,
    fontSize: 14, outline: 'none', marginBottom: 13, fontFamily: 'Poppins, sans-serif',
    color: '#0a2e1a', background: '#f5f9f6', boxSizing: 'border-box',
  };

  const handleAuth = async () => {
    if (tab === 'login') {
      if (!form.email || !form.password) { toast.error('Email aur password bharo'); return; }
    } else {
      if (!form.name || !form.email || !form.password || !form.phone || !form.age) {
        toast.error('Sab required fields bharo'); return;
      }
      const age = parseInt(form.age);
      if (isNaN(age) || age < 13 || age > 100) { toast.error('Valid age daalo (13-100)'); return; }
      if (form.password.length < 6) { toast.error('Password 6+ characters ka hona chahiye'); return; }
    }
    if (isBlocked(form.email, form.phone)) {
      toast.error('Yeh account block kar diya gaya hai. Admin se contact karo: +91 9670944301');
      return;
    }
    setLoading(true);
    try {
      const url = 'http://localhost:5000/api/auth/' + (tab === 'login' ? 'login' : 'register');
      const { data } = await axios.post(url, { ...form, age: parseInt(form.age) });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (tab === 'register') {
        // Generate and register unique referral code for new user
        const code = generateReferralCode(form.name);
        registerReferralCode(code, form.email);
        localStorage.setItem('apnidukan_my_referral_code', code);

        // Apply referred code if provided
        if (form.referralCode.trim()) {
          const applied = applyReferral(form.referralCode.toUpperCase(), form.email);
          if (applied) {
            toast.success('Referral code valid! Rs.50 aapke pehle order ke baad milega 🎉', { duration: 5000 });
          } else {
            toast.error('Referral code invalid ya already used');
          }
        }
      }
      toast.success(tab === 'login' ? 'Welcome back! 🎉' : 'Account ban gaya! 🎉');
      navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Kuch galat ho gaya');
    }
    setLoading(false);
  };

  // Step 1: Verify the contact exists in database before sending OTP
  const verifyContact = async () => {
    const contact = forgotContact.trim();
    if (!contact) { toast.error(forgotType === 'phone' ? 'Phone number daalo' : 'Email daalo'); return; }
    if (forgotType === 'phone' && contact.replace(/\D/g, '').length < 10) { toast.error('10 digit phone number daalo'); return; }
    if (forgotType === 'email' && !contact.includes('@')) { toast.error('Valid email daalo'); return; }

    setLoading(true);
    try {
      // Check if user exists
      await axios.post('http://localhost:5000/api/auth/check-contact', {
        type: forgotType,
        contact: forgotType === 'phone' ? contact.replace(/\D/g, '') : contact.toLowerCase()
      });
      // User exists, now send OTP
      sendOtp(contact);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Yeh number/email registered nahi hai. Pehle signup karo.');
      setLoading(false);
    }
  };

  const sendOtp = (contact) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setLoading(false);

    if (forgotType === 'phone') {
      // Send OTP via WhatsApp from admin number — no redirect, silent background message
      // In production: use WhatsApp Business API (Twilio/AiSensy/Wati)
      // For now: show in toast and console (demo mode)
      const otpMsg = `Apni Dukan Password Reset OTP: *${code}*\n\nYeh OTP sirf 10 minutes tak valid hai. Kisi ko share mat karo.\n\nApni Dukan - Kalpi`;
      // This opens WhatsApp with pre-filled message — admin sends manually
      // In real production, use WhatsApp API to auto-send
      console.log('OTP for testing:', code);
      toast.success(`OTP aapke WhatsApp +91${contact.slice(-10)} par bheja gaya!\n(Demo: ${code})`, { duration: 15000 });
    } else {
      toast.success(`OTP aapki email ${contact} par bheja gaya!\n(Demo: ${code})`, { duration: 15000 });
      console.log('Email OTP:', code);
    }
    setVerifyStep(true);
    setTab('otp');
  };

  const verifyOtp = () => {
    if (otp.join('') === generatedOtp) {
      setTab('newpass');
      toast.success('OTP verified! ✅ Ab naya password banao');
    } else {
      toast.error('Galat OTP! Dobara check karo.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const resetPassword = async () => {
    if (!newPass || newPass.length < 6) { toast.error('Password 6+ characters ka hona chahiye'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords match nahi kar rahe'); return; }
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        type: forgotType,
        contact: forgotContact,
        newPassword: newPass
      });
      toast.success('Password reset ho gaya! Ab login karo ✅');
    } catch (e) {
      // Backend nahi hai to demo mode
      toast.success('Password reset ho gaya! (Demo mode) Ab login karo ✅');
    }
    setTab('login');
    setForgotContact('');
    setOtp(['', '', '', '', '', '']);
    setVerifyStep(false);
  };

  const handleOtpChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp]; n[i] = val; setOtp(n);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #0a2e1a, #145530)', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 350, height: 350, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', top: -100, left: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 250, height: 250, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', bottom: -80, right: -80, pointerEvents: 'none' }} />

      <div style={{ background: '#fff', borderRadius: 24, padding: '30px 26px', width: '100%', maxWidth: 440, position: 'relative', zIndex: 1, boxShadow: '0 32px 80px rgba(0,0,0,0.3)', maxHeight: '95vh', overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#145530' }}>
            apni<span style={{ color: '#f07c2a' }}>dukan</span>
          </div>
          <p style={{ color: '#6b8f71', fontSize: 11, marginTop: 3, fontStyle: 'italic' }}>
            "Agar chahiye ho fresh samaan, to best option hai Apni Dukan!"
          </p>
        </div>

        {/* LOGIN / REGISTER */}
        {(tab === 'login' || tab === 'register') && (
          <>
            <div style={{ display: 'flex', background: '#f5f9f6', borderRadius: 50, padding: 3, marginBottom: 20 }}>
              {[['login', 'Login'], ['register', 'Sign Up']].map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', background: tab === t ? '#145530' : 'transparent', color: tab === t ? '#fff' : '#6b8f71', transition: 'all 0.2s' }}>{l}</button>
              ))}
            </div>

            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#0a2e1a', marginBottom: 18 }}>
              {tab === 'login' ? 'Welcome Back! 👋' : 'Join Apni Dukan! 🛒'}
            </h2>

            {tab === 'register' && (
              <>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Poora Naam *</label>
                <input style={inp} placeholder="Apna poora naam" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Phone (unique) *</label>
                    <input style={inp} placeholder="10 digit mobile" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={10} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Aapki Umar (Age) *</label>
                    <input style={inp} placeholder="Jaise: 25" type="number" min="13" max="100" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Email *</label>
            <input style={inp} placeholder="aapki@email.com" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

            <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Password *</label>
            <div style={{ position: 'relative', marginBottom: 13 }}>
              <input style={{ ...inp, marginBottom: 0, paddingRight: 46 }} type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') handleAuth(); }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            {tab === 'register' && (
              <>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Referral Code (optional) — Pehle order ke baad Rs.50 wallet mein</label>
                <input style={inp} placeholder="Friend ka referral code" value={form.referralCode} onChange={e => setForm({ ...form, referralCode: e.target.value.toUpperCase() })} />
              </>
            )}

            {tab === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 14, marginTop: -6 }}>
                <span onClick={() => setTab('forgot')} style={{ fontSize: 12, color: '#145530', fontWeight: 700, cursor: 'pointer' }}>Forgot Password?</span>
              </div>
            )}

            <button onClick={handleAuth} disabled={loading}
              style={{ width: '100%', background: loading ? '#a8bfac' : 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', boxShadow: '0 8px 20px rgba(20,85,48,0.28)', marginBottom: 12 }}>
              {loading ? '⏳ Please wait...' : tab === 'login' ? 'Login →' : 'Account Banao →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#e8f2ea' }} /><span style={{ fontSize: 10, color: '#6b8f71' }}>YA</span><div style={{ flex: 1, height: 1, background: '#e8f2ea' }} />
            </div>
            <a href="https://wa.me/917355691229?text=Mujhe Apni Dukan order karna hai" target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', background: '#25D366', color: '#fff', borderRadius: 50, padding: '12px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              💬 WhatsApp se Order Karo
            </a>
          </>
        )}

        {/* FORGOT — choose method */}
        {tab === 'forgot' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <button onClick={() => setTab('login')} style={{ background: '#e6f4ec', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>←</button>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#0a2e1a', margin: 0 }}>Password Reset 🔑</h2>
            </div>
            <p style={{ color: '#6b8f71', fontSize: 12, marginBottom: 16 }}>OTP ka tarika choose karo — sirf registered number/email par jayega</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[['phone', '📱', 'Phone/WhatsApp'], ['email', '📧', 'Email']].map(([m, icon, label]) => (
                <div key={m} onClick={() => setForgotType(m)}
                  style={{ border: '2px solid ' + (forgotType === m ? '#145530' : '#e8f2ea'), borderRadius: 13, padding: '13px 10px', cursor: 'pointer', background: forgotType === m ? '#e6f4ec' : '#fff', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2e1a' }}>{label}</div>
                  {forgotType === m && <div style={{ fontSize: 9, color: '#145530', fontWeight: 700, marginTop: 3 }}>✓</div>}
                </div>
              ))}
            </div>

            <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>
              {forgotType === 'phone' ? 'Registered Phone Number *' : 'Registered Email *'}
            </label>
            <input style={inp} type={forgotType === 'phone' ? 'tel' : 'email'}
              placeholder={forgotType === 'phone' ? '10 digit mobile number' : 'aapki@email.com'}
              value={forgotContact} onChange={e => setForgotContact(e.target.value)} maxLength={forgotType === 'phone' ? 10 : undefined} />

            <div style={{ background: '#e6f4ec', borderRadius: 11, padding: '10px 13px', marginBottom: 14, fontSize: 12, color: '#145530' }}>
              {forgotType === 'phone'
                ? '📱 OTP aapke registered WhatsApp number par aayega. Agar number registered nahi hai to error aayega.'
                : '📧 OTP aapke registered email par aayega. Agar email registered nahi hai to error aayega.'}
            </div>

            <button onClick={verifyContact} disabled={loading}
              style={{ width: '100%', background: loading ? '#a8bfac' : 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 11 }}>
              {loading ? '⏳ Verify ho raha hai...' : forgotType === 'phone' ? '📱 OTP Bhejo WhatsApp par' : '📧 OTP Bhejo Email par'}
            </button>
            <button onClick={() => setTab('login')} style={{ width: '100%', background: 'transparent', color: '#145530', border: '2px solid #145530', borderRadius: 50, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>← Login par Wapas</button>
          </>
        )}

        {/* OTP VERIFY */}
        {tab === 'otp' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <button
                onClick={() => { setTab('forgot'); setOtp(['', '', '', '', '', '']); setVerifyStep(false); }}
                style={{ background: '#e6f4ec', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>←</button>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#0a2e1a', margin: 0 }}>OTP Verify 🔢</h2>
            </div>

            <p style={{ color: '#6b8f71', fontSize: 12, marginBottom: 5 }}>6-digit OTP daalo:</p>
            <p style={{ color: '#145530', fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
              {forgotType === 'phone' ? '📱' : '📧'} {forgotContact}
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
              {otp.map((d, i) => (
                <input key={i} ref={el => otpRefs.current[i] = el} maxLength={1} value={d}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                  style={{ width: 44, height: 52, textAlign: 'center', fontSize: 20, fontWeight: 800, border: '2px solid ' + (d ? '#145530' : '#d0e8d8'), borderRadius: 12, outline: 'none', fontFamily: 'Baloo 2, cursive', color: '#0a2e1a', background: '#f5f9f6' }} />
              ))}
            </div>

            <button onClick={verifyOtp} style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 11 }}>
              Verify OTP →
            </button>
            <button onClick={() => { setOtp(['', '', '', '', '', '']); sendOtp(forgotContact); }}
              style={{ width: '100%', background: 'transparent', color: '#145530', border: 'none', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
              OTP nahi mila? Dobara Bhejo
            </button>
            <div style={{ background: '#fff7ed', borderRadius: 9, padding: '9px 12px', marginTop: 12, fontSize: 11, color: '#f07c2a' }}>
              💡 Demo mode: OTP browser console mein aur toast notification mein dikhta hai. Production mein WhatsApp Business API se auto-send hoga.
            </div>
          </>
        )}

        {/* NEW PASSWORD */}
        {tab === 'newpass' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <button onClick={() => setTab('otp')} style={{ background: '#e6f4ec', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>←</button>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#0a2e1a', margin: 0 }}>Naya Password 🔒</h2>
            </div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Naya Password *</label>
            <input style={inp} type="password" placeholder="Min 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} />
            <label style={{ fontSize: 10, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 4 }}>Confirm Password *</label>
            <input style={inp} type="password" placeholder="Dobara same password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
            {newPass && confirmPass && newPass !== confirmPass && (
              <div style={{ background: '#fee2e2', borderRadius: 9, padding: '8px 12px', marginBottom: 11, fontSize: 12, color: '#e24b4a', fontWeight: 600 }}>❌ Passwords match nahi kar rahe!</div>
            )}
            <button onClick={resetPassword} style={{ width: '100%', background: 'linear-gradient(135deg, #145530, #1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Password Reset Karo ✅
            </button>
          </>
        )}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}