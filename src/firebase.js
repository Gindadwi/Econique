// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCr1QmpIUfenOfCZcwoml0j2VQ4eLYZN-c",
    authDomain: "econique-perhutani.firebaseapp.com",
    projectId: "econique-perhutani",
    storageBucket: "econique-perhutani.appspot.com",
    messagingSenderId: "1073491479075",
    appId: "1:1073491479075:web:6eac0feac4ed613cf13f96",
    measurementId: "G-6Y5087KSMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, googleProvider, db };