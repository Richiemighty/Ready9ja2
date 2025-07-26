// src/contexts/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const fetchCart = async () => {
    if (!currentUser) return;

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        setCartItems(cartSnap.data().items || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (product: Product) => {
    if (!currentUser) return;

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const cartSnap = await getDoc(cartRef);
      const cartData = cartSnap.exists() ? cartSnap.data().items || [] : [];

      // Prevent duplicates by checking for existing product ID
      const alreadyInCart = cartData.some((item: Product) => item.id === product.id);
      if (alreadyInCart) return;

      const updatedCart = [...cartData, { ...product, addedAt: new Date().toISOString() }];
      await setDoc(cartRef, { items: updatedCart });

      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
