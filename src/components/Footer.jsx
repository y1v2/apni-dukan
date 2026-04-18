import React from 'react';
export default function Footer() {
  return (
    <footer style={{ background: '#12200f', color: '#a8bfac', textAlign: 'center', padding: '24px', fontSize: 13, marginTop: 40 }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 8 }}>
        apni<span style={{ color: '#f07c2a' }}>dukan</span>
      </div>
      <p>Your town's own online grocery store. Fresh. Local. Fast.</p>
      <p style={{ marginTop: 8, fontSize: 11 }}>© 2025 Apni Dukan. All rights reserved.</p>
    </footer>
  );
}