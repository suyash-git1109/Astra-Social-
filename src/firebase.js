import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKUcl2KwjNLi3klPR...", // Ye aapka wahi rehne dena jo screenshot mein hai
  authDomain: "astra-social-7dfd1.firebaseapp.com",
  projectId: "astra-social-7dfd1",
  storageBucket: "astra-social-7dfd1.appspot.com",
  messagingSenderId: "226070790602",
  appId: "1:226070790602:web:1a7ae...",
  measurementId: "G-2S2F0FF9KK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);