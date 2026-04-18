import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const CATEGORIES = ['All', 'vegetables', 'fruits', 'dairy', 'grains', 'oil', 'snacks'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]));
  }, []);

  const filtered = products.filter(p =>
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 380, background: '#fff' }}>
        <div style={{ padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e8f5ee', color: '#1a6b3a', fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 50, marginBottom: 20, width: 'fit-content' }}>
            <span style={{ width: 7, height: 7, background: '#2d9653', borderRadius: '50%', display: 'inline-block' }} /> Now delivering near you
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 42, fontWeight: 800, lineHeight: 1.1, color: '#12200f', marginBottom: 16 }}>
            Fresh Grocery<br />at Your <span style={{ color: '#1a6b3a' }}>Doorstep</span>
          </h1>
          <p style={{ fontSize: 15, color: '#6b8f71', lineHeight: 1.7, maxWidth: 360, marginBottom: 28 }}>
            Order from Apni Dukan — your town's own online grocery store. Fresh items, honest prices, fast delivery.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/products" style={{ background: '#1a6b3a', color: '#fff', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Shop Now</Link>
            <Link to="/products" style={{ color: '#1a6b3a', border: '1.5px solid #1a6b3a', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>View Categories</Link>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg,#e8f5ee,#d4edda)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,80px)', gap: 12 }}>
            {[['🥛','Milk','₹58'],['🍅','Tomato','₹35'],['🧅','Onion','₹28'],['🫙','Dal','₹120'],['🍚','Rice','₹65'],['🧴','Oil','₹145']].map(([e,n,p]) => (
              <div key={n} style={{ background: '#fff', borderRadius: 16, padding: '14px 10px', textAlign: 'center', boxShadow: '0 4px 20px rgba(26,107,58,0.1)' }}>
                <div style={{ fontSize: 28 }}>{e}</div>
                <div style={{ fontSize: 10, color: '#6b8f71', fontWeight: 500 }}>{n}</div>
                <div style={{ fontSize: 11, color: '#f07c2a', fontWeight: 700 }}>{p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #d4e8d8', borderRadius: 50, padding: '10px 20px', gap: 12 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for rice, dal, oil..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent' }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 32px 20px', display: 'flex', gap: 10, overflowX: 'auto' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ background: category === cat ? '#1a6b3a' : '#fff', color: category === cat ? '#fff' : '#1e3a20', border: '1.5px solid', borderColor: category === cat ? '#1a6b3a' : '#e0ede3', borderRadius: 50, padding: '7px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Products */}
      <div style={{ padding: '0 32px 40px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#12200f' }}>
          {category === 'All' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>
        {filtered.length === 0 ? (
          <p style={{ color: '#6b8f71', textAlign: 'center', padding: '40px 0' }}>No products found. Add some from the admin panel!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}