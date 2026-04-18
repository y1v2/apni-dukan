import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const [address, setAddress] = useState({ street: '', city: '', pincode: '', phone: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const placeOrder = async () => {
    if (!token) { toast.error('Please login first'); return; }
    try {
      await axios.post('http://localhost:5000/api/orders', { items: cartItems, total, address }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch { toast.error('Failed to place order'); }
  };

  const inp = { width: '100%', padding: '12px 16px', border: '1.5px solid #d4e8d8', borderRadius: 12, fontSize: 14, outline: 'none', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Checkout</h1>
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #eaf2ec', padding: '24px', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', marginBottom: 16, fontSize: 16 }}>Delivery Address</h3>
        <input style={inp} placeholder="Street / Mohalla" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
        <input style={inp} placeholder="City / Town" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
        <input style={inp} placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
        <input style={inp} placeholder="Phone Number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
      </div>
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #eaf2ec', padding: '24px' }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', marginBottom: 12, fontSize: 16 }}>Order Summary</h3>
        {cartItems.map(i => (
          <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '0.5px solid #eaf2ec' }}>
            <span>{i.name} x{i.qty}</span><span style={{ color: '#1a6b3a', fontWeight: 600 }}>₹{i.price * i.qty}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17, marginTop: 16 }}>
          <span>Total</span><span style={{ color: '#1a6b3a' }}>₹{total}</span>
        </div>
        <button onClick={placeOrder} style={{ width: '100%', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 50, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 20, fontFamily: 'DM Sans, sans-serif' }}>
          Place Order (Cash on Delivery)
        </button>
      </div>
    </div>
  );
}