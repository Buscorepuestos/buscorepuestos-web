import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./services/productService";
import shoppingCartReducer from "./features/shoppingCartSlice";
import { localStorageMiddleware } from "./middlewares/localStorageMiddleware";

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
		cart: shoppingCartReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware, localStorageMiddleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
