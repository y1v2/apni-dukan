import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { const s = localStorage.getItem('apnidukan_cart'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [wallet, setWallet] = useState(() => {
    try { return Number(localStorage.getItem('apnidukan_wallet') || '0'); }
    catch { return 0; }
  });

  useEffect(() => {
    try { localStorage.setItem('apnidukan_cart', JSON.stringify(cartItems)); } catch {}
  }, [cartItems]);

  useEffect(() => {
    try { localStorage.setItem('apnidukan_wallet', String(wallet)); } catch {}
  }, [wallet]);

  const getProducts = () => {
    try { const s = localStorage.getItem('apnidukan_products'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  };

  const addToCart = (product) => {
    const products = getProducts();
    const live = products.find(p => p._id === product._id);
    if (live && live.stock <= 0) return { success: false, message: 'Out of Stock!' };
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    return { success: true };
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i._id !== id));
  const updateQty = (id, qty) => { if (qty < 1) return removeFromCart(id); setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i)); };
  const clearCart = () => { setCartItems([]); localStorage.removeItem('apnidukan_cart'); };
  const addToWallet = (amount) => setWallet(prev => prev + amount);
  const deductFromWallet = (amount) => setWallet(prev => Math.max(0, prev - amount));

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const mrpTotal = cartItems.reduce((s, i) => s + (i.mrp || i.price) * i.qty, 0);
  const savings = mrpTotal - total;
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, total, mrpTotal, savings, count, wallet, addToWallet, deductFromWallet }}>
      {children}
    </CartContext.Provider>
  );
};