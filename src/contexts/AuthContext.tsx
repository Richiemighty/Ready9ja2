import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const profileRef = doc(db, 'profiles', currentUser.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const profileData = profileSnap.data() as User;
        setUserProfile(profileData);
        console.log('Profile refreshed:', profileData);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  }, [currentUser]);

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, {
        displayName: userData.displayName
      });

      const userDoc: User = {
        id: user.uid,
        email: user.email!,
        displayName: userData.displayName || '',
        role: userData.role || 'buyer',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        businessName: userData.businessName || '',
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'profiles', user.uid), userDoc);
      setUserProfile(userDoc);
      console.log('User created and profile set:', userDoc);
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      setCurrentUser(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out");
      setCurrentUser(user);

      if (user) {
        try {
          await refreshUserProfile();
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
      console.log("Auth listener cleaned up");
    };
  }, [refreshUserProfile]);

  const value = {
    currentUser,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};