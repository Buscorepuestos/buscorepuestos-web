import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

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
    async (params: FetchProductsParams = {}) => {
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