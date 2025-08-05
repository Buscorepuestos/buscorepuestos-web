// src/hooks/useUserLocation.ts
import { useState } from 'react';

// Interfaz para la respuesta de la API de geocodificación (ejemplo con Nominatim)
interface GeocodingResponse {
    address: {
        state: string;      // Suele ser la Comunidad Autónoma (ej: "Catalonia")
        county: string;     // Suele ser la Provincia/Comarca (ej: "Barcelona", "Barcelonés")
        city: string;       // La ciudad (ej: "Barcelona")
        country_code: string; // El código del país (ej: "es", "cl")
    };
}

export function useUserLocation() {
    const [province, setProvince] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getProvinceFromCoords = async (latitude: number, longitude: number) => {
        setLoading(true);
        try {
            // AÑADIMOS 'accept-language=es' PARA PRIORIZAR RESULTADOS EN ESPAÑOL
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`
            );
            if (!response.ok) {
                throw new Error('No se pudo obtener la provincia.');
            }
            const data: GeocodingResponse = await response.json();

            // === LÓGICA DE NORMALIZACIÓN MEJORADA ===
            let finalProvince: string | null = null;
            const address = data.address;
            console.log("Datos de dirección recibidos:", address);

            if (address.country_code === 'es') {
                // Para España, priorizamos 'county' y luego 'city' si es una provincia grande, antes que 'state'.
                // 'county' puede ser "Barcelonés", "Madrid", etc.
                // 'city' puede ser "Barcelona", "Madrid".
                // 'state' puede ser "Catalonia", "Community of Madrid".
                finalProvince = address.city || address.county || address.state || null;
            } else {
                finalProvince = address.county || address.state || address.city || null;
            }

            // // === CONSOLE LOGS MEJORADOS PARA DEPURACIÓN ===
            // console.log("--- DEBUG GEOLOCALIZACIÓN v2 ---");
            // console.log("Coordenadas:", { latitude, longitude });
            // console.log("Respuesta Nominatim (en español):", data);
            // console.log("Valores candidatos:", { state: address.state, county: address.county, city: address.city });
            // console.log("Provincia final seleccionada:", finalProvince);
            // console.log("---------------------------------");
            // // === FIN DE LOGS ===

            setProvince(finalProvince); 
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al contactar el servicio de geolocalización.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError('La geolocalización no es soportada por este navegador.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // console.log("Posición obtenida de navigator.geolocation:", position);
                getProvinceFromCoords(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setError('Permiso de ubicación denegado. No se puede ordenar por proximidad.');
            }
        );
    };

    return { province, error, loading, requestLocation };
}