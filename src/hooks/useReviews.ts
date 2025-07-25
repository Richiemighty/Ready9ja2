import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  addDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Review } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useReviews = (productId?: string, sellerId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q;
    
    if (productId) {
      q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
    } else if (sellerId) {
      q = query(
        collection(db, 'reviews'),
        where('sellerId', '==', sellerId),
        orderBy('createdAt', 'desc')
      );
    } else {
      return;
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Review[];
        
        setReviews(reviewsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching reviews:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [productId, sellerId]);

  return { reviews, loading, error };
};

export const useReviewOperations = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const createReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    if (!userProfile) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        buyerId: userProfile.id,
        createdAt: new Date()
      });
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSellerRating = async (sellerId: string) => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('sellerId', '==', sellerId)
      );
      
      const snapshot = await getDocs(q);
      const reviews = snapshot.docs.map(doc => doc.data() as Review);
      
      if (reviews.length === 0) return 0;
      
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / reviews.length;
    } catch (error) {
      console.error('Error calculating seller rating:', error);
      return 0;
    }
  };

  return {
    createReview,
    getSellerRating,
    loading
  };
};