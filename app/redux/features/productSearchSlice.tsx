import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

interface ProductSearchState {
    searchResults: any[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    hasCompletedSearch: boolean;
    currentRequestId: string | null;
}

const initialState: ProductSearchState = {
    searchResults: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    status: 'idle',
    hasCompletedSearch: false,
    currentRequestId: null,
};

interface FetchProductsParams {
    searchTerm?: string;
    page?: number;
    sortOrder?: 'asc' | 'desc' | 'proximity' | null;
    userProvince?: string | null; // Para ordenar por proximidad
    subcategory?: string | null;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
}

export const fetchProducts = createAsyncThunk(
    'productSearch/fetchProducts',
    async (params: FetchProductsParams = {}, { signal }) => {
        const { searchTerm, page, sortOrder, subcategory, brand, model, year, userProvince } = params;
        const queryParams = new URLSearchParams();

        if (searchTerm) queryParams.append('q', searchTerm);
        if (page) queryParams.append('page', String(page));
        if (sortOrder) queryParams.append('sortOrder', sortOrder);

        if (sortOrder === 'proximity' && userProvince) {
            queryParams.append('userProvince', userProvince);
        }

        // Añadir los nuevos filtros a la URL
        if (subcategory) queryParams.append('subcategory', subcategory);
        if (brand) queryParams.append('brand', brand);
        if (model) queryParams.append('model', model);
        if (year) queryParams.append('year', String(year));

        const response = await api.get(`/products/search?${queryParams.toString()}`, { signal });
        return response.data;
    }
);

const isExplicitSearch = (params: FetchProductsParams = {}) => Boolean(
    params.searchTerm?.trim() ||
    params.subcategory ||
    params.brand ||
    params.model ||
    params.year
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
            state.status = 'idle';
            state.hasCompletedSearch = false;
            state.currentRequestId = null;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        restoreSearchResults: (state, action) => {
            state.searchResults = action.payload.results;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
            state.loading = false;
            state.status = 'succeeded';
            state.hasCompletedSearch = Boolean(action.payload.hasCompletedSearch);
            state.currentRequestId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
                state.hasCompletedSearch = false;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                state.loading = false;
                state.searchResults = action.payload.data;
                state.totalPages = action.payload.totalPages || 1;
                state.status = 'succeeded';
                state.hasCompletedSearch = isExplicitSearch(action.meta.arg);
                state.currentRequestId = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;

                state.loading = false;
                state.currentRequestId = null;

                if (action.meta.aborted) {
                    state.status = 'idle';
                    return;
                }

                state.error = action.error.message || 'Error al buscar productos.';
                state.searchResults = [];
                state.totalPages = 1;
                state.status = 'failed';
                state.hasCompletedSearch = false;
            });
    },
});

export const { clearSearchResults, setCurrentPage, restoreSearchResults } = productSearchSlice.actions;
export default productSearchSlice.reducer;
