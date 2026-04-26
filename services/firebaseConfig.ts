// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl2NamPIBKWaaSkysZYuOIHq-VJwuX1Z8",
  authDomain: "restore-marketplace.firebaseapp.com",
  projectId: "restore-marketplace",
  storageBucket: "restore-marketplace.firebasestorage.app",
  messagingSenderId: "484404186674",
  appId: "1:484404186674:web:3979ec76c349dc9f15362b",
  measurementId: "G-CJB1ZM7YCE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);