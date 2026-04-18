import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();

  const handle = async () => {
    try {
      const url = `http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`;
      const { data } = await axios.post(url, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong');
    }
  };

  const inp = { width: '100%', padding: '12px 16px', border: '1.5px solid #d4e8d8', borderRadius: 12, fontSize: 14, outline: 'none', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #eaf2ec', padding: '40px 36px', width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p style={{ color: '#6b8f71', fontSize: 13, marginBottom: 28 }}>{isLogin ? 'Login to your Apni Dukan account' : 'Join Apni Dukan today'}</p>
        {!isLogin && <input style={inp} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}
        <input style={inp} placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        {!isLogin && <input style={inp} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />}
        <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handle} style={{ width: '100%', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 50, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 20, color: '#6b8f71' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#1a6b3a', fontWeight: 600, cursor: 'pointer' }}>{isLogin ? 'Sign Up' : 'Login'}</span>
        </p>
      </div>
    </div>
  );
}