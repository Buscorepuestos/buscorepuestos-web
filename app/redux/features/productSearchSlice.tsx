import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/api';

interface ProductSearchState {
    searchResults: any[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: ProductSearchState = {
    searchResults: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
};

export const fetchProducts = createAsyncThunk(
    'productSearch/fetchProducts',
    async ({ searchTerm, page, sortOrder }: { searchTerm?: string, page?: number, sortOrder?: 'asc' | 'desc' | null } = {}) => {
        const queryParams = new URLSearchParams();
        if (searchTerm) {
            queryParams.append('q', searchTerm);
        }
        if (page) {
            queryParams.append('page', String(page));
        }
        if (sortOrder) {
            queryParams.append('sortOrder', sortOrder);
        }

        const response = await api.get(`/products/search?${queryParams.toString()}`);
        return response.data;
    }
);

const productSearchSlice = createSlice({
    name: 'productSearch',
    initialState,
    reducers: {
        // Opcional: Reducer para limpiar los resultados (si lo usas en ProductSearch)
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.error = null;
            state.totalPages = 1;
            state.currentPage = 1;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.data;
                state.totalPages = action.payload.totalPages || 1;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error al buscar productos.';
                state.searchResults = [];
                state.totalPages = 1;
            });
    },
});

export const { clearSearchResults, setCurrentPage } = productSearchSlice.actions;
export default productSearchSlice.reducer;