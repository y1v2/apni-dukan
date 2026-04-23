import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ADMIN_ID = 'Yash';
const ADMIN_PASS = 'Y@sh1234';
const ADMIN_EMAIL = 'yvishwakarma315@gmail.com';

export default function AdminLogin() {
  const [step, setStep] = useState('login'); // login | forgot | otp | newpass
  const [form, setForm] = useState({ id: '', password: '' });
  const [otp, setOtp] = useState(['','','','','','']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!form.id || !form.password) { toast.error('ID aur password dono bharo'); return; }
    if (form.id === ADMIN_ID && form.password === ADMIN_PASS) {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', Date.now().toString());
      toast.success('Welcome back, Yash! 👑');
      navigate('/admin');
    } else {
      toast.error('Galat ID ya Password!');
    }
  };

  const sendOtp = () => {
    const otp6 = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp6);
    setStep('otp');
    // Show OTP in toast since we can't actually send email without backend
    toast.success(`OTP: ${otp6}\n(Real app mein ${ADMIN_EMAIL} pe jayega)`, { duration: 10000 });
    console.log('OTP for testing:', otp6);
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered === generatedOtp) {
      setStep('newpass');
      toast.success('OTP verified! ✅');
    } else {
      toast.error('Galat OTP! Dobara check karo.');
    }
  };

  const resetPassword = () => {
    if (!newPass || newPass.length < 6) { toast.error('Password kam se kam 6 characters ka hona chahiye'); return; }
    if (newPass !== confirmPass) { toast.error('Dono passwords match nahi kar rahe'); return; }
    toast.success('Password reset ho gaya! (Demo mode mein actual change nahi hoga)');
    setStep('login');
  };

  const inp = {
    width: '100%', padding: '13px 18px', border: '2px solid #d0e8d8', borderRadius: 14,
    fontSize: 14, outline: 'none', marginBottom: 16, fontFamily: "'Poppins',sans-serif",
    color: '#0a2e1a', background: '#f5f9f6', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg,#0a2e1a,#145530)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', width: 400, height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: '50%', top: -100, left: -100 }} />
      <div style={{ position: 'absolute', width: 300, height: 300, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', bottom: -80, right: -80 }} />

      <div style={{ background: '#fff', borderRadius: 28, padding: '40px 36px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 30, fontWeight: 800, color: '#145530' }}>
            apni<span style={{ color: '#f07c2a' }}>dukan</span>
          </div>
          <div style={{ fontSize: 13, color: '#6b8f71', marginTop: 4 }}>Admin Panel</div>
        </div>

        {/* LOGIN */}
        {step === 'login' && (
          <>
            <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 26, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>Admin Login 👑</h2>
            <p style={{ fontSize: 13, color: '#6b8f71', marginBottom: 24 }}>Sirf authorized admin access kar sakta hai</p>

            <label style={{ fontSize: 12, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Admin ID</label>
            <input style={inp} placeholder="Admin ID daalo" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />

            <label style={{ fontSize: 12, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <input style={{ ...inp, marginBottom: 0, paddingRight: 50 }} type={showPass ? 'text' : 'password'}
                placeholder="Password daalo" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <span onClick={() => setStep('forgot')} style={{ fontSize: 13, color: '#145530', fontWeight: 700, cursor: 'pointer' }}>
                Forgot Password?
              </span>
            </div>

            <button onClick={handleLogin}
              style={{ width: '100%', background: 'linear-gradient(135deg,#145530,#1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", boxShadow: '0 8px 24px rgba(20,85,48,0.3)' }}>
              Login to Admin Panel →
            </button>

            <button onClick={() => navigate('/')}
              style={{ width: '100%', background: 'transparent', color: '#6b8f71', border: 'none', fontSize: 13, cursor: 'pointer', marginTop: 16, fontFamily: "'Poppins',sans-serif" }}>
              ← Website par Wapas Jao
            </button>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {step === 'forgot' && (
          <>
            <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 24, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>Forgot Password? 🔑</h2>
            <p style={{ fontSize: 13, color: '#6b8f71', marginBottom: 24 }}>
              OTP bheja jayega: <b style={{ color: '#145530' }}>{ADMIN_EMAIL}</b>
            </p>
            <div style={{ background: '#e6f4ec', borderRadius: 14, padding: '14px 18px', marginBottom: 20, fontSize: 13, color: '#145530', fontWeight: 500 }}>
              📧 OTP aapke registered email par bheja jayega. Check karo aur verify karo.
            </div>
            <button onClick={sendOtp}
              style={{ width: '100%', background: 'linear-gradient(135deg,#145530,#1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", marginBottom: 14 }}>
              📧 OTP Bhejo Email Par
            </button>
            <button onClick={() => setStep('login')}
              style={{ width: '100%', background: 'transparent', color: '#145530', border: '2px solid #145530', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
              ← Login par Wapas
            </button>
          </>
        )}

        {/* OTP VERIFY */}
        {step === 'otp' && (
          <>
            <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 24, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>OTP Verify Karo 🔢</h2>
            <p style={{ fontSize: 13, color: '#6b8f71', marginBottom: 24 }}>
              6-digit OTP daalo jo <b style={{ color: '#145530' }}>{ADMIN_EMAIL}</b> pe gaya hai
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
              {otp.map((digit, i) => (
                <input key={i} maxLength={1} value={digit}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    const newOtp = [...otp];
                    newOtp[i] = val;
                    setOtp(newOtp);
                    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
                  }}
                  onKeyDown={e => { if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                  id={`otp-${i}`}
                  style={{ width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 800, border: `2px solid ${otp[i]?'#145530':'#d0e8d8'}`, borderRadius: 14, outline: 'none', fontFamily: "'Baloo 2',cursive", color: '#0a2e1a', background: '#f5f9f6', transition: 'border-color 0.2s' }} />
              ))}
            </div>
            <button onClick={verifyOtp}
              style={{ width: '100%', background: 'linear-gradient(135deg,#145530,#1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", marginBottom: 12 }}>
              Verify OTP →
            </button>
            <button onClick={sendOtp}
              style={{ width: '100%', background: 'transparent', color: '#145530', border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
              OTP nahi mila? Resend Karo
            </button>
          </>
        )}

        {/* NEW PASSWORD */}
        {step === 'newpass' && (
          <>
            <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 24, fontWeight: 800, color: '#0a2e1a', marginBottom: 6 }}>Naya Password Banao 🔒</h2>
            <p style={{ fontSize: 13, color: '#6b8f71', marginBottom: 24 }}>Strong password likho</p>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Naya Password</label>
            <input style={inp} type="password" placeholder="Naya password" value={newPass} onChange={e => setNewPass(e.target.value)} />
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6b8f71', display: 'block', marginBottom: 6 }}>Confirm Password</label>
            <input style={inp} type="password" placeholder="Dobara likho" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
            <button onClick={resetPassword}
              style={{ width: '100%', background: 'linear-gradient(135deg,#145530,#1a6b3a)', color: '#fff', border: 'none', borderRadius: 50, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
              Password Reset Karo ✅
            </button>
          </>
        )}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}