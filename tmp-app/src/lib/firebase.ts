// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8HQl5EHq7y1udVKwbB1V1olQ-j504hdc",
    authDomain: "antigravity-d339a.firebaseapp.com",
    projectId: "antigravity-d339a",
    storageBucket: "antigravity-d339a.firebasestorage.app",
    messagingSenderId: "98857956438",
    appId: "1:98857956438:web:61c13fbe82e29c0ace77f7",
    measurementId: "G-DFFVVLPR82"
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
