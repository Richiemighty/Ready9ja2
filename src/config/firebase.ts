import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBpwdIV2qpxlqgrWicegZ_E7yMExRdZF_w",
  authDomain: "vendeer-3fc02.firebaseapp.com",
  projectId: "vendeer-3fc02",
  storageBucket: "vendeer-3fc02.firebasestorage.app",
  messagingSenderId: "940950448203",
  appId: "1:940950448203:web:e1ddc00d7fd0a6e71745ce",
  measurementId: "G-E9QM71L2R8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;