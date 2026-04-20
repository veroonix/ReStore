// firestoreService.ts
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
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


/*export const getUserAdById = async (id: string): Promise<Ad | null> => {
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as unknown as Ad;
  }
  return null;
} */