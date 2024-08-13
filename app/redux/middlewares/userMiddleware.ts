import { Middleware } from 'redux';
import { signAnonymously } from '../../lib/auth'; // Configuración de Firebase
import { setCurrentFirebaseUser } from '../../redux/features/firebaseUserSlice';
import { setCurrentAirtableUser } from '../..//redux/features/airtableUserSlice';
import { userService } from '../../services/user/userService';

export const authMiddleware: Middleware = ({ dispatch }) => next => async (action: any) => {

    next(action);

    if (action.type === 'auth/checkUserStatus') {
        try {

            const user = await signAnonymously();
            if (user) {

                const userData = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                    isAnonymous: user.isAnonymous,
                    phoneNumber: user.phoneNumber,
                    providerId: user.providerId,
                    refreshToken: user.refreshToken,
                    metadata: {
                        createdAt: user.metadata.creationTime,
                        lastLoginAt: user.metadata.lastSignInTime,
                        lastSignInTime: user.metadata.lastSignInTime,
                        creationTime: user.metadata.creationTime,
                    },
                    providerData: user.providerData,
                    tenantId: user.tenantId,
                };

                // Setear el usuario en el estado de Redux
                dispatch(setCurrentFirebaseUser(userData));

                // Buscar usuario en Airtable por UID de Firebase
                const airtableResponse = await userService.getUserByUid(user.uid);

                if (airtableResponse.data && airtableResponse.data.length > 0) {
                    // Si existe el usuario en Airtable, setearlo en el estado de Redux
                    localStorage.setItem('airtableUserId', airtableResponse.data[0].fields.id);
                    dispatch(setCurrentAirtableUser(airtableResponse));
                }
                else {
                    // Si no existe, crear un usuario anónimo en Airtable
                    const newAirtableUser = {
                        uid: user.uid,
                        Rol: 'Anonimo',
                    };

                    const createdUser = await userService.createAnonymousAirtableUser(newAirtableUser);

                    localStorage.setItem('airtableUserId', createdUser.data![0].id!);

                    // Setear el usuario recién creado en el estado de Redux
                    dispatch(setCurrentAirtableUser(createdUser));
                }
                    
            }
        } catch (error) {
            console.error('Error en el middleware de autenticación de Firebase:', error);
        }
    }
};
