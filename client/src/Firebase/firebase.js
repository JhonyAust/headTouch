// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoIfeJBsgqGBMNZyG8KRX83wox-1fEq24",
    authDomain: "headtouch.firebaseapp.com",
    projectId: "headtouch",
    storageBucket: "headtouch.firebasestorage.app",
    messagingSenderId: "888587619480",
    appId: "1:888587619480:web:368b9e2ba309a13f9cd4ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth + provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();