// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCV8_eo9fFJVyeh5FjI-qCa6JgQtecOfKY",
  authDomain: "devconnect-fbb9f.firebaseapp.com",
  projectId: "devconnect-fbb9f",
  storageBucket: "devconnect-fbb9f.firebasestorage.app",
  messagingSenderId: "933809413549",
  appId: "1:933809413549:web:d660fb4d08392a27a29524",
  measurementId: "G-1S2HR14620"
};

// Initialize Firebase

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);