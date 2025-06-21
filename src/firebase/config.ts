import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
// You can get this from your Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDSlCYpUeGjcx4r_zwINKuwpbzps0iov0U",
  authDomain: "solana-portfolio-f1055.firebaseapp.com",
  projectId: "solana-portfolio-f1055",
  storageBucket: "solana-portfolio-f1055.firebasestorage.app",
  messagingSenderId: "1096140924182",
  appId: "1:1096140924182:web:7f0101150f212df12d9c37",
  measurementId: "G-LH97HT2250"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;