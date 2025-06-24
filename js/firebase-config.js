// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjMD1puDZnEt45xIGRXO2BGHmsDMZxK1g",
  authDomain: "cynexshop-cacef.firebaseapp.com",
  projectId: "cynexshop-cacef",
  storageBucket: "cynexshop-cacef.firebasestorage.app",
  messagingSenderId: "16356634788",
  appId: "1:16356634788:web:ef7e77a9bb84ba66b43631",
  measurementId: "G-J36RRJQ27L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };