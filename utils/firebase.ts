import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1mTNxjT87TO9Hk72d0XUrj0ybsAgedt8",
  authDomain: "mi-web-cinco.firebaseapp.com",
  projectId: "mi-web-cinco",
  storageBucket: "mi-web-cinco.firebasestorage.app",
  messagingSenderId: "957613590926",
  appId: "1:957613590926:web:d538ee44106ec218093cdf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
