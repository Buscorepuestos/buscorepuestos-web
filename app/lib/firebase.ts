// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    signInAnonymously,
    signInWithCustomToken,
    updateEmail,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../environment/environment';

const firebaseConfig = environment.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { storage, auth, db, signInWithEmailAndPassword, signInAnonymously, signInWithCustomToken, updateEmail, onAuthStateChanged, doc, getDoc, setDoc, updateDoc };    
export type { User };

