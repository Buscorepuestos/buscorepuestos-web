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

const toAutocompleteText = (value: unknown): string => {
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'bigint') return String(value);
	return '';
};

const toAutocompleteCount = (value: unknown): number => {
	const count = Number(value);
	return Number.isFinite(count) ? count : 0;
};

export const normalizeAutocompleteResults = (value: unknown): AutocompleteResults => {
	const data = value && typeof value === 'object'
		? value as Record<string, unknown>
		: {};
	const parts = Array.isArray(data.parts) ? data.parts : [];
	const categories = Array.isArray(data.categories) ? data.categories : [];
	const brands = Array.isArray(data.brands) ? data.brands : [];
	const references = Array.isArray(data.references) ? data.references : [];

	return {
		parts: parts.map((part) => {
			const item = part && typeof part === 'object'
				? part as Record<string, unknown>
				: {};
			return {
				title: toAutocompleteText(item.title),
				subcategory: toAutocompleteText(item.subcategory),
				brand: toAutocompleteText(item.brand),
				year: typeof item.year === 'number' ? item.year : null,
				count: toAutocompleteCount(item.count),
			};
		}).filter((part) => part.title),
		categories: categories.map((category) => {
			const item = category && typeof category === 'object'
				? category as Record<string, unknown>
				: {};
			return {
				name: toAutocompleteText(item.name),
				count: toAutocompleteCount(item.count),
			};
		}).filter((category) => category.name),
		brands: brands.map((brand) => {
			const item = brand && typeof brand === 'object'
				? brand as Record<string, unknown>
				: {};
			return {
				name: toAutocompleteText(item.name),
				count: toAutocompleteCount(item.count),
			};
		}).filter((brand) => brand.name),
		references: references.map(toAutocompleteText).filter(Boolean),
	};
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

export const getAutocomplete = async (
	query: string,
	signal?: AbortSignal
): Promise<AutocompleteResults> => {
	if (query.trim().length < 2) return EMPTY_AUTOCOMPLETE;
	try {
		const res = await api.get(`/products/autocomplete?q=${encodeURIComponent(query)}`, {
			signal,
		});
		return normalizeAutocompleteResults(res.data);
	} catch (error) {
		if (signal?.aborted) throw error;
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

