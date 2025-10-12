// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ9dtWUKjl2LdOMsOC6UfzY_nv41bJ_WU",
  authDomain: "expense-tracker-61bc1.firebaseapp.com",
  projectId: "expense-tracker-61bc1",
  storageBucket: "expense-tracker-61bc1.firebasestorage.app",
  messagingSenderId: "870229192499",
  appId: "1:870229192499:web:b11e079c97e42a25b51846",
  measurementId: "G-C3JM8K1M2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;