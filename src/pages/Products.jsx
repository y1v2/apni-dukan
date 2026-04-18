import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const CATEGORIES = ['All', 'vegetables', 'fruits', 'dairy', 'grains', 'oil', 'snacks'];

export default function Products() {
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
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#12200f' }}>All Products</h1>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #d4e8d8', borderRadius: 50, padding: '10px 20px', gap: 12, marginBottom: 20 }}>
        <span>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', fontFamily: 'DM Sans, sans-serif' }}
        />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ background: category === cat ? '#1a6b3a' : '#fff', color: category === cat ? '#fff' : '#1e3a20', border: '1.5px solid', borderColor: category === cat ? '#1a6b3a' : '#e0ede3', borderRadius: 50, padding: '7px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <p style={{ color: '#6b8f71', textAlign: 'center', padding: '60px 0', fontSize: 15 }}>
          No products found. Add products from the admin panel!
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {filtered.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}