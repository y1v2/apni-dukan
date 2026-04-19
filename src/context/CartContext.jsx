import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const mrpTotal = cartItems.reduce((sum, i) => sum + (i.mrp || i.price) * i.qty, 0);
  const savings = mrpTotal - total;
  const count = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, total, mrpTotal, savings, count }}>
      {children}
    </CartContext.Provider>
  );
};