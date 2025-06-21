import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDSlCYpUeGjcx4r_zwINKuwpbzps0iov0U",
  authDomain: "solana-portfolio-f1055.firebaseapp.com",
  projectId: "solana-portfolio-f1055",
  storageBucket: "solana-portfolio-f1055.firebasestorage.app",
  messagingSenderId: "1096140924182",
  appId: "1:1096140924182:web:7f0101150f212df12d9c37",
  measurementId: "G-LH97HT2250"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export const googleProvider = new GoogleAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

export default app;