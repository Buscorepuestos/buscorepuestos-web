// hooks/useAutocomplete.ts
import { useState, useEffect, useRef } from 'react';
import { getAutocomplete } from '../services/products/products.service';

export function useAutocomplete(query: string) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.trim().length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await getAutocomplete(query);
                setSuggestions(results);
                setIsOpen(results.length > 0);
            } catch {
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const closeDropdown = () => setIsOpen(false);

    return { suggestions, isLoading, isOpen, closeDropdown };
}
