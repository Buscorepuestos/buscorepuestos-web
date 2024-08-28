'use client'
import React, { useEffect, useState } from 'react';

const appID = 'DSKGGHHS58';
const usageApiKey = '31d110b4ce0bf37f67c75083acae22f0';

// Función para obtener las fechas de inicio y fin para un día específico
function getDateRangeForDay(day: number) {
    const startDate = new Date(2024, 7, day, 0, 0, 0).toISOString(); // 26 de agosto de 2024, 00:00:00
    const endDate = new Date(2024, 7, day, 23, 59, 59).toISOString(); // 26 de agosto de 2024, 23:59:59
    return { startDate, endDate };
}

function getDateRangeForToday() {
    const today = new Date(); // Obtiene la fecha actual
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString(); // Inicio del día
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()).toISOString(); // Hora actual
    return { startDate, endDate };
}

async function fetchAlgoliaUsage(startDate: string, endDate: string) {
    try {
        const response = await fetch(`https://usage.algolia.com/1/usage/search_operations?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'X-Algolia-API-Key': usageApiKey,
                'X-Algolia-Application-Id': appID,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener el uso de Algolia');
        }

        const data = await response.json();
        console.log('Usage data:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener el uso de Algolia:', error);
        throw new Error('Error al obtener el uso de Algolia');
    }
}

export default function AlgoliaUsageMonitor() {
    const [usageData, setUsageData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUsageData = async () => {
            const { startDate, endDate } = getDateRangeForDay(27); // Cambia el número aquí para el día deseado
            try {
                const data = await fetchAlgoliaUsage(startDate, endDate);
                setUsageData(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        getUsageData();
    }, []);

    return (
        <div>
            <h2>Algolia Usage Monitor</h2>
            {error && <p>Error: {error}</p>}
            {usageData ? (
                <pre>{JSON.stringify(usageData, null, 2)}</pre>
            ) : (
                <p>Loading usage data...</p>
            )}
        </div>
    );
}
