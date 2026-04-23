import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', referralCode:'' });
  const [forgotMethod, setForgotMethod] = useState('whatsapp');
  const [forgotContact, setForgotContact] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { addToWallet } = useCart();
  const { applyReferral, isBlocked } = useProducts();

  const inp = { width:'100%', padding:'12px 15px', border:'2px solid #d0e8d8', borderRadius:13, fontSize:14, outline:'none', marginBottom:13, fontFamily:'Poppins, sans-serif', color:'#0a2e1a', background:'#f5f9f6', boxSizing:'border-box' };

  const handleAuth = async () => {
    if (tab==='login') { if (!form.email||!form.password) { toast.error('Email aur password bharo'); return; } }
    else { if (!form.name||!form.email||!form.password) { toast.error('Sab fields bharo'); return; } if (form.password.length<6) { toast.error('Password 6+ characters ka hona chahiye'); return; } }
    if (isBlocked(form.email, form.phone)) { toast.error('Yeh account block kar diya gaya hai. Admin se contact karo.'); return; }
    setLoading(true);
    try {
      const url = 'http://localhost:5000/api/auth/'+(tab==='login'?'login':'register');
      const { data } = await axios.post(url, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (tab==='register' && form.referralCode) {
        const applied = applyReferral(form.referralCode, data.user.email);
        if (applied) {
          addToWallet(50);
          toast.success('Referral code valid! Rs.50 aapke wallet mein add ho gaya 🎉', { duration: 5000 });
        }
      }
      toast.success(tab==='login'?'Welcome back! 🎉':'Account ban gaya! 🎉');
      navigate('/');
    } catch (e) { toast.error(e.response?.data?.message || 'Kuch galat ho gaya'); }
    setLoading(false);
  };

  const sendOtp = () => {
    const contact = forgotContact.trim();
    if (!contact) { toast.error('Contact detail daalo'); return; }
    const code = Math.floor(100000 + Math.random()*900000).toString();
    setGeneratedOtp(code);
    setTab('otp');
    if (forgotMethod==='whatsapp') {
      const num = contact.replace(/\D/g,'');
      const waLink = 'https://wa.me/91'+num+'?text='+encodeURIComponent('Apni Dukan Password Reset OTP: '+code+'\n\nYeh OTP 10 minutes tak valid hai.');
      window.open(waLink, '_blank');
      toast.success('WhatsApp pe OTP bheja gaya! (Demo OTP: '+code+')', { duration:15000 });
    } else {
      toast.success('Email OTP (Demo: '+code+') — Real app mein email jayega.', { duration:15000 });
    }
    console.log('OTP:', code);
  };

  const verifyOtp = () => {
    if (otp.join('')===generatedOtp) { setTab('newpass'); toast.success('OTP verified! ✅'); }
    else { toast.error('Galat OTP!'); setOtp(['','','','','','']); otpRefs.current[0]?.focus(); }
  };

  const resetPassword = () => {
    if (!newPass||newPass.length<6) { toast.error('Password 6+ characters ka hona chahiye'); return; }
    if (newPass!==confirmPass) { toast.error('Passwords match nahi kar rahe'); return; }
    toast.success('Password reset ho gaya! Ab login karo ✅');
    setTab('login'); setForgotContact(''); setOtp(['','','','','','']);
  };

  const handleOtpChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const n=[...otp]; n[i]=val; setOtp(n);
    if (val&&i<5) otpRefs.current[i+1]?.focus();
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'linear-gradient(135deg,#0a2e1a,#145530)', alignItems:'center', justifyContent:'center', padding:16, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', width:300, height:300, background:'rgba(255,255,255,0.04)', borderRadius:'50%', top:-80, left:-80, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:200, height:200, background:'rgba(255,255,255,0.04)', borderRadius:'50%', bottom:-60, right:-60, pointerEvents:'none' }} />

      <div style={{ background:'#fff', borderRadius:24, padding:'30px 26px', width:'100%', maxWidth:420, position:'relative', zIndex:1, boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:22 }}>
          <div style={{ fontFamily:'Baloo 2, cursive', fontSize:26, fontWeight:800, color:'#145530' }}>apni<span style={{ color:'#f07c2a' }}>dukan</span></div>
          <p style={{ color:'#6b8f71', fontSize:11, marginTop:3, fontStyle:'italic' }}>"Agar chahiye ho fresh samaan, to best option hai Apni Dukan!"</p>
        </div>

        {(tab==='login'||tab==='register') && (
          <>
            <div style={{ display:'flex', background:'#f5f9f6', borderRadius:50, padding:3, marginBottom:20 }}>
              {[['login','Login'],['register','Sign Up']].map(([t,l])=>(
                <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:'10px', border:'none', borderRadius:50, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Poppins, sans-serif', background:tab===t?'#145530':'transparent', color:tab===t?'#fff':'#6b8f71', transition:'all 0.2s' }}>{l}</button>
              ))}
            </div>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:20, fontWeight:800, color:'#0a2e1a', marginBottom:4 }}>{tab==='login'?'Welcome Back! 👋':'Join Apni Dukan! 🛒'}</h2>
            <p style={{ color:'#6b8f71', fontSize:11, marginBottom:18 }}>{tab==='login'?'Apne account mein login karo':'Aaj apna free account banao'}</p>
            {tab==='register' && <>
              <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Poora Naam *</label>
              <input style={inp} placeholder="Apna poora naam" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            </>}
            <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Email *</label>
            <input style={inp} placeholder="aapki@email.com" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            {tab==='register' && <>
              <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Phone (unique) *</label>
              <input style={inp} placeholder="10 digit mobile" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} maxLength={10} />
            </>}
            <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Password *</label>
            <div style={{ position:'relative', marginBottom:13 }}>
              <input style={{ ...inp, marginBottom:0, paddingRight:46 }} type={showPass?'text':'password'} placeholder="Min 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>{ if(e.key==='Enter') handleAuth(); }} />
              <button onClick={()=>setShowPass(!showPass)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:15 }}>{showPass?'🙈':'👁️'}</button>
            </div>
            {tab==='register' && <>
              <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Referral Code (optional) — Rs.50 wallet mein</label>
              <input style={inp} placeholder="Friend ka referral code daalo" value={form.referralCode} onChange={e=>setForm({...form,referralCode:e.target.value.toUpperCase()})} />
            </>}
            {tab==='login' && (
              <div style={{ textAlign:'right', marginBottom:14, marginTop:-6 }}>
                <span onClick={()=>setTab('forgot')} style={{ fontSize:12, color:'#145530', fontWeight:700, cursor:'pointer' }}>Forgot Password?</span>
              </div>
            )}
            <button onClick={handleAuth} disabled={loading}
              style={{ width:'100%', background:loading?'#a8bfac':'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'13px', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'Poppins, sans-serif', boxShadow:'0 8px 20px rgba(20,85,48,0.28)', marginBottom:12 }}>
              {loading?'⏳ Please wait...':tab==='login'?'Login →':'Account Banao →'}
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ flex:1, height:1, background:'#e8f2ea' }} />
              <span style={{ fontSize:10, color:'#6b8f71' }}>YA</span>
              <div style={{ flex:1, height:1, background:'#e8f2ea' }} />
            </div>
            <a href="https://wa.me/917355691229?text=Mujhe order karna hai" target="_blank" rel="noreferrer"
              style={{ display:'block', textAlign:'center', background:'#25D366', color:'#fff', borderRadius:50, padding:'12px', fontSize:13, fontWeight:700, textDecoration:'none' }}>
              💬 WhatsApp se Order Karo
            </a>
          </>
        )}

        {tab==='forgot' && (
          <>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:20, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>Password Reset 🔑</h2>
            <p style={{ color:'#6b8f71', fontSize:12, marginBottom:16 }}>OTP ka tarika choose karo</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              {[['whatsapp','💬','WhatsApp OTP'],['email','📧','Email OTP']].map(([m,icon,label])=>(
                <div key={m} onClick={()=>setForgotMethod(m)}
                  style={{ border:'2px solid '+(forgotMethod===m?'#145530':'#e8f2ea'), borderRadius:13, padding:'13px 10px', cursor:'pointer', background:forgotMethod===m?'#e6f4ec':'#fff', textAlign:'center', transition:'all 0.2s' }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#0a2e1a' }}>{label}</div>
                  {forgotMethod===m && <div style={{ fontSize:9, color:'#145530', fontWeight:700, marginTop:3 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
            <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>
              {forgotMethod==='whatsapp'?'Registered Phone Number *':'Registered Email *'}
            </label>
            <input style={inp} type={forgotMethod==='whatsapp'?'tel':'email'} placeholder={forgotMethod==='whatsapp'?'10 digit mobile number':'aapki@email.com'}
              value={forgotContact} onChange={e=>setForgotContact(e.target.value)} />
            <div style={{ background:'#e6f4ec', borderRadius:11, padding:'10px 13px', marginBottom:14, fontSize:12, color:'#145530', fontWeight:500 }}>
              {forgotMethod==='whatsapp'?'📱 OTP aapke WhatsApp pe aayega — Real app mein SMS jayega':'📧 OTP aapki email pe jayega — Demo mein screen pe dikhega'}
            </div>
            <button onClick={sendOtp} style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:11 }}>
              {forgotMethod==='whatsapp'?'💬 WhatsApp pe OTP Bhejo':'📧 Email pe OTP Bhejo'}
            </button>
            <button onClick={()=>setTab('login')} style={{ width:'100%', background:'transparent', color:'#145530', border:'2px solid #145530', borderRadius:50, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer' }}>← Login par Wapas</button>
          </>
        )}

        {tab==='otp' && (
          <>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:20, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>OTP Verify 🔢</h2>
            <p style={{ color:'#6b8f71', fontSize:12, marginBottom:5 }}>6-digit OTP daalo:</p>
            <p style={{ color:'#145530', fontSize:12, fontWeight:700, marginBottom:18 }}>{forgotMethod==='whatsapp'?'💬':'📧'} {forgotContact}</p>
            <div style={{ display:'flex', gap:7, justifyContent:'center', marginBottom:20 }}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>otpRefs.current[i]=el} maxLength={1} value={d}
                  onChange={e=>handleOtpChange(e.target.value,i)}
                  onKeyDown={e=>{if(e.key==='Backspace'&&!d&&i>0)otpRefs.current[i-1]?.focus();}}
                  style={{ width:42, height:50, textAlign:'center', fontSize:20, fontWeight:800, border:'2px solid '+(d?'#145530':'#d0e8d8'), borderRadius:11, outline:'none', fontFamily:'Baloo 2, cursive', color:'#0a2e1a', background:'#f5f9f6' }} />
              ))}
            </div>
            <button onClick={verifyOtp} style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:10 }}>Verify OTP →</button>
            <button onClick={()=>{setTab('forgot');setOtp(['','','','','','']);}} style={{ width:'100%', background:'transparent', color:'#145530', border:'none', fontSize:12, cursor:'pointer', textDecoration:'underline' }}>OTP nahi mila? Dobara Bhejo</button>
            <div style={{ background:'#fff7ed', borderRadius:9, padding:'9px 12px', marginTop:12, fontSize:11, color:'#f07c2a', fontWeight:500 }}>
              💡 Demo mode mein OTP toast notification mein dikhta hai aur console mein bhi.
            </div>
          </>
        )}

        {tab==='newpass' && (
          <>
            <h2 style={{ fontFamily:'Baloo 2, cursive', fontSize:20, fontWeight:800, color:'#0a2e1a', marginBottom:6 }}>Naya Password 🔒</h2>
            <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Naya Password *</label>
            <input style={inp} type="password" placeholder="Min 6 characters" value={newPass} onChange={e=>setNewPass(e.target.value)} />
            <label style={{ fontSize:10, fontWeight:700, color:'#6b8f71', display:'block', marginBottom:4 }}>Confirm Password *</label>
            <input style={inp} type="password" placeholder="Dobara same password" value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} />
            {newPass&&confirmPass&&newPass!==confirmPass && <div style={{ background:'#fee2e2', borderRadius:9, padding:'8px 12px', marginBottom:11, fontSize:12, color:'#e24b4a', fontWeight:600 }}>❌ Passwords match nahi kar rahe!</div>}
            <button onClick={resetPassword} style={{ width:'100%', background:'linear-gradient(135deg,#145530,#1a6b3a)', color:'#fff', border:'none', borderRadius:50, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer' }}>Password Reset Karo ✅</button>
          </>
        )}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}