import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductMongoInterface } from '../interfaces/product.interface';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { savePurchase, deletePurchase } from '../../services/purchase/purchase';

interface SavePurchasePayload {
    product: ProductMongoInterface;
    userId: string;
}

interface RemovePurchasePayload {
    productId: string;
    purchaseId: string;
}

export const savePurchaseAsync = createAsyncThunk(
    'cart/savePurchaseAsync',
    async (payload: SavePurchasePayload) => {
        const { product, userId } = payload;
        console.log('Saving purchase', product, userId);
        const response = await savePurchase(product, userId);
        return { productId: product._id, purchaseId: response.purchaseId };
    }
);

export const removePurchaseAsync = createAsyncThunk(
    'cart/removePurchaseAsync',
    async (payload: RemovePurchasePayload) => {
        const { purchaseId, productId } = payload;
        await deletePurchase(purchaseId);
        return productId
    }
);
export interface CartItem {
    productName: string;
    title: string;
    mainReference: string;
    buscorepuestosPrice: number;
    brand: string;
    articleModel: string;
    images: string[];
    _id: string;
    quantity: number;
    stock: boolean;
    airtableId: string;
    purchaseId?: string;
    refLocal?: string;
    idEmpresa?: string;
    isMetasync?: boolean;
}

export interface CartState {
    items: CartItem[];
}

export const loadStateFromLocalStorage = (): CartItem[] => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return [];
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return [];
    }
};

export const getInitialState = (): CartState => ({
    items: typeof window !== 'undefined' ? loadStateFromLocalStorage() : [],
});

const initialState = getInitialState();

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (
            state,
            action: PayloadAction<ProductMongoInterface>
        ) => {
            const existingItem = state.items.find(
                (item) => item._id === action.payload._id
            );
            if (existingItem) {
                return;
            } else {
                const newItem: CartItem = {
                    ...selectProductProperties(action.payload),
                    quantity: 1,
                    airtableId: action.payload.airtableId || '',
                    refLocal: action.payload.refLocal || '',
                    idEmpresa: action.payload.idEmpresa || '',
                    isMetasync: action.payload.isMetasync || false,
                };
                state.items.push(newItem);
            }
        },
        removeItemFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (item) => item._id !== action.payload
            );
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(savePurchaseAsync.fulfilled, (state, action: PayloadAction<{ productId: string; purchaseId: string }>) => {
                // Encuentra el item que se ha añadido al carrito y actualiza su `purchaseId`
                const { productId, purchaseId } = action.payload;
                const item = state.items.find((item) => item._id === productId);
                if (item) {
                    item.purchaseId = purchaseId;
                }
            })
            .addCase(savePurchaseAsync.rejected, (state, action) => {
                console.error('Failed to save purchase');
            })
            .addCase(removePurchaseAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    },
});

export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectProductProperties = (product: ProductMongoInterface) => ({
    productName: product.productName,
    title: product.title,
    mainReference: product.mainReference,
    buscorepuestosPrice: product.buscorepuestosPrice,
    brand: product.brand,
    articleModel: product.articleModel,
    images: product.images,
    _id: product._id,
    stock: product.stock,
    airtableId: product.airtableId,
    refLocal: product.refLocal,
    idEmpresa: product.idEmpresa,
    isMetasync: product.isMetasync,
});

