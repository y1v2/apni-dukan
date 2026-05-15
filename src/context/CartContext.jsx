import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const load = (key, def) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => load('apnidukan_cart', []));
  const [wallet, setWallet] = useState(() => Number(localStorage.getItem('apnidukan_wallet') || '0'));

  useEffect(() => { save('apnidukan_cart', cartItems); }, [cartItems]);
  useEffect(() => { localStorage.setItem('apnidukan_wallet', String(wallet)); }, [wallet]);

  const getProducts = () => { try { const s = localStorage.getItem('apnidukan_products'); return s ? JSON.parse(s) : []; } catch { return []; } };

  const addToCart = (product) => {
    const prods = getProducts();
    const live = prods.find(p => p._id === product._id);
    if (live !== undefined && live.stock <= 0) return { success: false, message: 'Out of Stock!' };
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    return { success: true };
  };

  const removeFromCart = id => setCartItems(prev => prev.filter(i => i._id !== id));
  const updateQty = (id, qty) => { if (qty < 1) return removeFromCart(id); setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i)); };
  const clearCart = () => { setCartItems([]); localStorage.removeItem('apnidukan_cart'); };
  const addToWallet = amt => setWallet(p => p + amt);
  const deductFromWallet = amt => setWallet(p => Math.max(0, p - amt));

  // Saved addresses per user
  const getSavedAddresses = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return [];
    return load('apnidukan_addresses_' + user.email, []);
  };
  const saveAddress = (addr) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return;
    const key = 'apnidukan_addresses_' + user.email;
    const existing = load(key, []);
    const isDuplicate = existing.some(a => a.street === addr.street && a.phone === addr.phone);
    if (!isDuplicate) save(key, [addr, ...existing].slice(0, 5));
  };

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const mrpTotal = cartItems.reduce((s, i) => s + (i.mrp || i.price) * i.qty, 0);
  const savings = mrpTotal - total;
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, total, mrpTotal, savings, count, wallet, addToWallet, deductFromWallet, getSavedAddresses, saveAddress }}>
      {children}
    </CartContext.Provider>
  );
};