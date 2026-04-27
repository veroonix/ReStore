import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { Ad } from '../types';

const COLLECTION = 'user_ads';

export const fetchUserAds = async (): Promise<Ad[]> => {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Ad));
};

export const addUserAd = async (ad: Omit<Ad, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), ad);
  return docRef.id;
};

export const updateUserAd = async (id: string, ad: Partial<Ad>) => {
  await updateDoc(doc(db, COLLECTION, id), ad);
};

export const deleteUserAd = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id));
};

// ***** НОВАЯ ФУНКЦИЯ ДЛЯ REAL‑TIME *****
export const subscribeToUserAds = (callback: (ads: Ad[]) => void): () => void => {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
    const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Ad));
    callback(ads);
  }, (error) => {
    console.error('Firestore subscription error:', error);
  });
  return unsubscribe;
};