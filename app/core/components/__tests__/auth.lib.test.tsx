import { describe, it, expect, vi } from 'vitest';
import { signInWithEmailAndPassword, signInAnonymously, updateEmail, auth } from '../../../lib/firebase';
import { login, signAnonymously, updateFirebaseUserEmail } from '../../../lib/auth';

vi.mock('../../../lib/firebase', () => ({
    signInWithEmailAndPassword: vi.fn(),
    signInAnonymously: vi.fn(),
    updateEmail: vi.fn(),
    auth: {
        currentUser: {
            email: 'test@example.com',
        },
    },
}));

describe('auth functions', () => {
    it('login should sign in user with email and password', async () => {
        const mockUser = { uid: '123' };
        (signInWithEmailAndPassword as vi.Mock).mockResolvedValueOnce({ user: mockUser });

        const user = await login('test@example.com', 'password123');
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
        expect(user).toEqual(mockUser);
    });

    it('login should throw an error if signInWithEmailAndPassword fails', async () => {
        const mockError = new Error('Login failed');
        (signInWithEmailAndPassword as vi.Mock).mockRejectedValueOnce(mockError);

        await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Login failed');
    });

    it('signAnonymously should sign in anonymously', async () => {
        const mockUser = { uid: 'anonymous123' };
        (signInAnonymously as vi.Mock).mockResolvedValueOnce({ user: mockUser });

        const user = await signAnonymously();
        expect(signInAnonymously).toHaveBeenCalledWith(auth);
        expect(user).toEqual(mockUser);
    });

    it('signAnonymously should throw an error if signInAnonymously fails', async () => {
        const mockError = new Error('Anonymous login failed');
        (signInAnonymously as vi.Mock).mockRejectedValueOnce(mockError);

        await expect(signAnonymously()).rejects.toThrow('Anonymous login failed');
    });

    it('updateFirebaseUserEmail should update the user email', async () => {
        const mockUser = { uid: '123' };
        auth.currentUser = mockUser;
        (updateEmail as vi.Mock).mockResolvedValueOnce(undefined);

        await updateFirebaseUserEmail('newemail@example.com');
        expect(updateEmail).toHaveBeenCalledWith(mockUser, 'newemail@example.com');
    });

    // it('updateFirebaseUserEmail should not call updateEmail if no user is logged in', async () => {
    //     auth.currentUser = null;

    //     await updateFirebaseUserEmail('newemail@example.com');
    //     expect(updateEmail).not.toHaveBeenCalled();
    // });

    it('updateFirebaseUserEmail should throw an error if updateEmail fails', async () => {
        const mockError = new Error('Update email failed');
        const mockUser = { uid: '123' };
        auth.currentUser = mockUser;
        (updateEmail as vi.Mock).mockRejectedValueOnce(mockError);

        await expect(updateFirebaseUserEmail('newemail@example.com')).rejects.toThrow('Update email failed');
    });
});
