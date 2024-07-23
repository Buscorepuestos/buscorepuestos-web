import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./services/productService";
import shoppingCartReducer from "./features/shoppingCartSlice";
import { localStorageMiddleware } from "./middlewares/localStorageMiddleware";

export const makeStore = () => {
    return configureStore({
        reducer: {
            [productsApi.reducerPath]: productsApi.reducer,
            cart: shoppingCartReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware, localStorageMiddleware),
    });
};

// setupListeners(store.dispatch);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

