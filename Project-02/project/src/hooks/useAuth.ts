import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider, twitterProvider } from '../config/firebase';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Successfully signed in with Google!');
      return result.user;
    } catch (error: any) {
      toast.error('Failed to sign in with Google');
      throw error;
    }
  };

  const signInWithTwitter = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      toast.success('Successfully signed in with Twitter!');
      return result.user;
    } catch (error: any) {
      toast.error('Failed to sign in with Twitter');
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully signed in!');
      return result.user;
    } catch (error: any) {
      toast.error('Failed to sign in');
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      return result.user;
    } catch (error: any) {
      toast.error('Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error('Failed to sign out');
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithTwitter,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
};