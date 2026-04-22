import { useState, useEffect, useRef, useCallback } from 'react';
import {
    getAutocomplete,
    AutocompleteResults,
    EMPTY_AUTOCOMPLETE,
} from '../services/products/products.service';

const STORAGE_KEY    = 'busco_recent_searches';
const MAX_RECENT     = 6;
const DEBOUNCE_SHORT = 150; // ms — query > 4 chars
const DEBOUNCE_LONG  = 300; // ms — query ≤ 4 chars

// ── Helpers de sessionStorage ─────────────────────────────────────────────────

function loadRecent(): string[] {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function saveRecent(list: string[]): void {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
        // sessionStorage no disponible (SSR, incógnito bloqueado, etc.)
    }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAutocomplete(query: string) {
    const [results, setResults]     = useState<AutocompleteResults>(EMPTY_AUTOCOMPLETE);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen]       = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Cargar recientes una sola vez en cliente
    useEffect(() => {
        setRecentSearches(loadRecent());
    }, []);

    // ── Fetch con debounce adaptativo ─────────────────────────────────────────
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const trimmed = query.trim();

        if (trimmed.length < 2) {
            setResults(EMPTY_AUTOCOMPLETE);
            setIsOpen(false);
            return;
        }

        // Debounce más corto para queries largas (el usuario ya sabe qué busca)
        const delay = trimmed.length > 4 ? DEBOUNCE_SHORT : DEBOUNCE_LONG;

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await getAutocomplete(trimmed);
                const hasResults =
                    data.parts.length > 0 ||
                    data.categories.length > 0 ||
                    data.brands.length > 0 ||
                    data.references.length > 0;

                setResults(data);
                setIsOpen(hasResults);
            } catch {
                setResults(EMPTY_AUTOCOMPLETE);
                setIsOpen(false);
            } finally {
                setIsLoading(false);
            }
        }, delay);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    // ── Gestión de búsquedas recientes ────────────────────────────────────────

    const addRecentSearch = useCallback((term: string) => {
        const cleaned = term.trim();
        if (!cleaned) return;

        setRecentSearches(prev => {
            // Mover al frente si ya existe, si no insertar
            const filtered = prev.filter(s => s.toLowerCase() !== cleaned.toLowerCase());
            const updated  = [cleaned, ...filtered].slice(0, MAX_RECENT);
            saveRecent(updated);
            return updated;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        saveRecent([]);
    }, []);

    const closeDropdown = useCallback(() => setIsOpen(false), []);

    // Reabre el dropdown si ya hay resultados cacheados.
    // Usado cuando el input recupera el foco tras un scroll que lo cerro.
    const openDropdown = useCallback(() => {
        const hasResults =
            results.parts.length > 0 ||
            results.categories.length > 0 ||
            results.brands.length > 0 ||
            results.references.length > 0;
        if (hasResults) setIsOpen(true);
    }, [results]);

    return {
        results,
        isLoading,
        isOpen,
        closeDropdown,
        openDropdown,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
    };
}