import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useOrders = (userRole?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!userProfile) return;

    let q;
    
    if (userProfile.role === 'admin') {
      q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
    } else if (userProfile.role === 'seller') {
      q = query(
        collection(db, 'orders'),
        where('sellerId', '==', userProfile.id),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'orders'),
        where('buyerId', '==', userProfile.id),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Order[];
        
        setOrders(ordersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching orders:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userProfile]);

  return { orders, loading, error };
};

export const useOrderOperations = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userProfile) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        buyerId: userProfile.id,
        buyerName: userProfile.displayName,
        status: 'pending',
        verificationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'seller')) {
      throw new Error('Insufficient permissions');
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    updateOrderStatus,
    loading
  };
};