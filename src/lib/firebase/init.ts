// Import the functions you need from the SDKs you need
import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAT0_fPmvJhyz9N371mPIAAOLdhg9U-ios",
  authDomain: "seoit-ec267.firebaseapp.com",
  projectId: "seoit-ec267",
  storageBucket: "seoit-ec267.appspot.com",
  messagingSenderId: "299562574266",
  appId: "1:299562574266:web:839887916c7905f9253d83",
  measurementId: "G-WTCNWS2CNF",
  databaseURL:
    "https://seoit-ec267-default-rtdb.asia-southeast1.firebasedatabase.app/",
} satisfies FirebaseOptions;

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const firebaseAuth = getAuth(app);
export const realtimeDb = getDatabase(app);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app);
