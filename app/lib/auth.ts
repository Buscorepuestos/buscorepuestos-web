// lib/auth.ts
import { signInWithEmailAndPassword, signInAnonymously, signInWithCustomToken, updateEmail, auth } from './firebase';

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const signAnonymously = async () => {
    try {
        console.log('Signing in anonymously');
        const userCredential = await signInAnonymously(auth);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const updateFirebaseUserEmail = async (email: string) => {
    try {
        const user = auth.currentUser;
        if (user) {
            await updateEmail(user, email);
        }
    } catch (error) {
        throw error;
    }
};
