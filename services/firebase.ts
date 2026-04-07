
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZYRPGWon2PUjoWzapsTXeHIfZnX2-vPU",
  authDomain: "fitness-53a09.firebaseapp.com",
  projectId: "fitness-53a09",
  storageBucket: "fitness-53a09.firebasestorage.app",
  messagingSenderId: "1064916232970",
  appId: "1:1064916232970:web:ac79192140aa133e8f68f3"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app);