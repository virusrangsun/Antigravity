// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDiD65LGguaQrTNF4XGjdG0lbLAQ8q9mqs",
    authDomain: "antigravity-c7f41.firebaseapp.com",
    projectId: "antigravity-c7f41",
    storageBucket: "antigravity-c7f41.firebasestorage.app",
    messagingSenderId: "8017093116",
    appId: "1:8017093116:web:f742c810d235c55cfb5279",
    measurementId: "G-25E00YR39N"
};

// Initialize Firebase
// Use getApps() to prevent initializing the app multiple times on hot-reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Optional: Initialize Analytics only in browser environment
let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

// Initialize Firestore for database operations
const db = getFirestore(app);

export { app, analytics, db };
