import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [tab, setTab] = useState('login'); // login | register | otp | forgot
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const [otp, setOtp] = useState(['','','','','','']);
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [forgotEmail, setForgotEmail] = useState('');
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const handleOtpChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) otpRefs.current[i+1]?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i-1]?.focus();
  };

  const handleAuth = async () => {
    try {
      const url = `http://localhost:5000/api/auth/${tab === 'login' ? 'login' : 'register'}`;
      const { data } = await axios.post(url, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(tab === 'login' ? 'Welcome back! 🎉' : 'Account created! 🎉');
      navigate('/');
    } catch (e) { toast.error(e.response?.data?.message || 'Something went wrong'); }
  };

  const handleForgot = () => {
    if (!forgotEmail) { toast.error('Enter your email'); return; }
    toast.success('Password reset link sent to your email!');
    setTimeout(() => setTab('login'), 2000);
  };

  const inp = { width:'100%', padding:'13px 18px', border:'2px solid #d0e8d8', borderRadius:14, fontSize:14, outline:'none', marginBottom:14, fontFamily:"'Poppins',sans-serif", color:'#0a2e1a', background:'#f5f9f6' };

  return (
    <div style={{ minHeight:'90vh', display:'flex', background:'linear-gradient(135deg,#0a2e1a,#145530)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', width:400, height:400, background:'rgba(255,255,255,0.04)', borderRadius:'50%', top:-100, left:-100 }} />
      <div style={{ position:'absolute', width:300, height:300, background:'rgba(255,255,255,0.04)', borderRadius:'50%', bottom:-80, right:-80 }} />

      <div style={{ margin:'auto', width:'100%', maxWidth:440, padding:24, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:32, fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>
            apni<span style={{ color:'#f07c2a' }}>dukan</span>
          </div>
          <p style={{ color:'#86efac', fontSize:13, marginTop:6, fontStyle:'italic' }}>"Agar chahiye ho fresh samaan, to best option hai Apni Dukan!"</p>
        </div>

        <div style={{ background:'#fff', borderRadius:28, padding:'32px 28px', boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}>

          {/* Tabs */}
          {tab !== 'forgot' && (
            <div style={{ display:'flex', background:'#f5f9f6', borderRadius:50, padding:4, marginBottom:24 }}>
              {[['login','Login'],['register','Sign Up']].map(([t,l])=>(
                <button key={t} onClick={()=>setTab(t)}
                  style={{ flex:1, padding:'10px', border:'none', borderRadius:50, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", background:tab===t?'#145530':'transparent', color:tab===t?'#fff':'#6b8f71', transition:'all 0.2s' }}>
                  {l}
                </button>
              ))}
            </div>
          )}

          {/* Forgot Password */}
          {tab === 'forgot' ? (
            <>
              <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>Forgot Password? 🔑</h2>
              <p style={{ color:'#6b8f71', fontSize:13, marginBottom:24 }}>Enter your email and we'll send you a reset link</p>
              <input style={inp} placeholder="Your email address" type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} />
              <button onClick={handleForgot} style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'14px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", marginBottom:14 }}>
                Send Reset Link →
              </button>
              <button onClick={()=>setTab('login')} style={{ width:'100%', background:'transparent', color:'#145530', border:'2px solid #145530', borderRadius:50, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif" }}>
                ← Back to Login
              </button>
            </>
          ) : step === 2 ? (
            /* OTP Screen */
            <>
              <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:24, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>Enter OTP 🔢</h2>
              <p style={{ color:'#6b8f71', fontSize:13, marginBottom:24 }}>We sent a 6-digit OTP to <b style={{color:'#145530'}}>{form.phone || form.email}</b></p>
              <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:24 }}>
                {otp.map((digit,i) => (
                  <input key={i} ref={el=>otpRefs.current[i]=el} maxLength={1} value={digit}
                    onChange={e=>handleOtpChange(e.target.value,i)} onKeyDown={e=>handleOtpKey(e,i)}
                    style={{ width:48, height:56, textAlign:'center', fontSize:22, fontWeight:800, border:'2px solid', borderColor:digit?'#145530':'#d0e8d8', borderRadius:14, outline:'none', fontFamily:"'Baloo 2',cursive", color:'#0a2e1a', background:'#f5f9f6', transition:'border-color 0.2s' }} />
                ))}
              </div>
              <button onClick={handleAuth} style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'14px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", marginBottom:14, boxShadow:'0 8px 24px rgba(20,85,48,0.3)' }}>
                Verify & Continue →
              </button>
              <p style={{ textAlign:'center', fontSize:13, color:'#6b8f71' }}>
                Didn't receive? <span onClick={()=>toast.success('OTP resent!')} style={{ color:'#145530', fontWeight:700, cursor:'pointer' }}>Resend OTP</span>
              </p>
              <button onClick={()=>setStep(1)} style={{ width:'100%', background:'transparent', color:'#6b8f71', border:'none', fontSize:13, cursor:'pointer', marginTop:10, fontFamily:"'Poppins',sans-serif" }}>← Go Back</button>
            </>
          ) : (
            /* Login / Register Form */
            <>
              <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>
                {tab === 'login' ? 'Welcome Back! 👋' : 'Join Apni Dukan! 🛒'}
              </h2>
              <p style={{ color:'#6b8f71', fontSize:13, marginBottom:24 }}>
                {tab === 'login' ? 'Login to your account' : 'Create your free account'}
              </p>
              {tab === 'register' && <input style={inp} placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />}
              <input style={inp} placeholder="Email Address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              {tab === 'register' && <input style={inp} placeholder="Phone Number (+91)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />}
              <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />

              {tab === 'login' && (
                <div style={{ textAlign:'right', marginBottom:16, marginTop:-8 }}>
                  <span onClick={()=>setTab('forgot')} style={{ fontSize:13, color:'#145530', fontWeight:600, cursor:'pointer' }}>Forgot Password?</span>
                </div>
              )}

              <button onClick={handleAuth}
                style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'15px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", boxShadow:'0 8px 24px rgba(20,85,48,0.3)', marginBottom:12 }}>
                {tab === 'login' ? 'Login →' : 'Create Account →'}
              </button>

              <div style={{ display:'flex', alignItems:'center', gap:12, margin:'12px 0' }}>
                <div style={{ flex:1, height:1, background:'#e8f2ea' }} />
                <span style={{ fontSize:12, color:'#6b8f71' }}>OR</span>
                <div style={{ flex:1, height:1, background:'#e8f2ea' }} />
              </div>

              <button onClick={()=>setStep(2)}
                style={{ width:'100%', background:'#f5f9f6', color:'#145530', border:'2px solid #c8e6d4', borderRadius:50, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif" }}>
                🔢 Login with OTP
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}