import { configureStore } from "@reduxjs/toolkit";
import shoppingCartReducer from "./features/shoppingCartSlice";
import firebaseUserReducer from "./features/firebaseUserSlice";
import airtableUserSlice from "./features/airtableUserSlice";
import { localStorageMiddleware } from "./middlewares/localStorageMiddleware";
import { authMiddleware } from "./middlewares/userMiddleware";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: shoppingCartReducer,
            firebaseUser: firebaseUserReducer,
            airtableUser: airtableUserSlice,
        },
        middleware: (getDefaultMiddleware) => 
            getDefaultMiddleware()
            .concat(localStorageMiddleware)
            .concat(authMiddleware),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

