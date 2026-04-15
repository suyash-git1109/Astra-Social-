// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKUcl2KwjNLi3klPR5ij1YRh0NG8-kyIs",
  authDomain: "astra-social-7dfd1.firebaseapp.com",
  projectId: "astra-social-7dfd1",
  storageBucket: "astra-social-7dfd1.firebasestorage.app",
  messagingSenderId: "226070790602",
  appId: "1:226070790602:web:1a7ae39363eaccbfddcf33",
  measurementId: "G-2S2F0FF9KX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);