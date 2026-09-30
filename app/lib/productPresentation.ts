interface VehicleDescriptionInput {
    brand?: string | null;
    model?: string | null;
    year?: string | number | null;
}

export function formatVehicleDescription({ brand, model, year }: VehicleDescriptionInput): string {
    return [brand, model, year]
        .map(value => typeof value === 'string' ? value.trim() : value)
        .filter(value => value !== undefined && value !== null && value !== '')
        .join(' · ');
}

export function getProductCondition(isNewProduct?: boolean): string {
    if (isNewProduct === true) return 'Nuevo';
    if (isNewProduct === false) return 'Segunda mano';
    return 'Estado por confirmar';
}

export function getProductAvailability(stock?: boolean): string {
    if (stock === true) return 'Disponible';
    if (stock === false) return 'No disponible';
    return 'Consultar disponibilidad';
}
