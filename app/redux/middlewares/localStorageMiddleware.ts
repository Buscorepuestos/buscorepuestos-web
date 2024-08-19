
import { Middleware } from 'redux';
import { RootState } from '../store';

export const localStorageMiddleware: Middleware = (store: { getState: () => { (): any; new(): any; cart: { (): any; new(): any; items: any; }; }; }) => (next: (arg0: any) => any) => (action: any) => {
    const result = next(action);
    if (["cart/addItemToCart", "cart/removeItemFromCart", "cart/clearCart", "cart/savePurchaseAsync/fulfilled"].includes(action.type)) {
        const state = store.getState();
        const cartItems = (state as unknown as RootState).cart.items;
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    return result;
};