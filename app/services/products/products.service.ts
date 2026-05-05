import api from '../../api/api'
import { AxiosResponse } from 'axios'

export interface AutocompletePart {
	title: string;
	subcategory: string;
	brand: string;
	year: number | null;
	count: number;
}

export interface AutocompleteCategory {
	name: string;
	count: number;
}

export interface AutocompleteBrand {
	name: string;
	count: number;
}

export interface AutocompleteResults {
	parts: AutocompletePart[];
	categories: AutocompleteCategory[];
	brands: AutocompleteBrand[];
	references: string[];
}

export const EMPTY_AUTOCOMPLETE: AutocompleteResults = {
	parts: [],
	categories: [],
	brands: [],
	references: [],
};

export interface RelatedProduct {
	_id: string;
	title: string;
	buscorepuestosPrice: number;
	images: string[];
	brand: string;
	articleModel: string;
	subcategory: string;
}

export const getProducts = async (size: number = 16, sort: string = 'created', order: string = 'desc'): Promise<AxiosResponse<any>> => {
	try {
		return await api.get(`/products/store?size=${size}&sort=${sort}&order=${order}`)
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}

export const updateMetasyncProduct = async (id: string, data: any): Promise<AxiosResponse<any>> => {
	try {
		return await api.patch(`/products/metasyncStock/${id}`, data)
	} catch (error) {
		console.error('Error updating metasync product:', error)
		throw error
	}
}

export const getAutocomplete = async (query: string): Promise<AutocompleteResults> => {
	if (query.trim().length < 2) return EMPTY_AUTOCOMPLETE;
	try {
		const res = await api.get(`/products/autocomplete?q=${encodeURIComponent(query)}`);
		return res.data ?? EMPTY_AUTOCOMPLETE;
	} catch {
		return EMPTY_AUTOCOMPLETE;
	}
};


export const getCatalogCount = async (): Promise<number> => {
	try {
		const res = await api.get('products/catalog-count');
		return res.data?.count ?? 0;
	} catch {
		return 0;
	}
};

export const getRelatedProducts = async (
	productId: string,
	limit: number = 8
): Promise<RelatedProduct[]> => {
	try {
		const res = await api.get(`/products/related/${productId}?limit=${limit}`);
		return res.data?.data || [];
	} catch (error) {
		console.error('Error fetching related products:', error);
		return [];
	}
};

