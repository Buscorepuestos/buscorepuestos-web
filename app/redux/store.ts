import { configureStore } from "@reduxjs/toolkit";
import shoppingCartReducer from "./features/shoppingCartSlice";
import { localStorageMiddleware } from "./middlewares/localStorageMiddleware";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: shoppingCartReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

