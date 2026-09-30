import { describe, expect, test } from 'vitest'
import { formatVehicleDescription, getProductAvailability, getProductCondition } from '../../../lib/productPresentation'

describe('product presentation helpers', () => {
    test('formats vehicle data without undefined separators', () => {
        expect(formatVehicleDescription({ brand: 'Audi', model: 'A4', year: 2018 })).toBe('Audi · A4 · 2018')
        expect(formatVehicleDescription({ brand: 'Audi', model: null, year: undefined })).toBe('Audi')
    })

    test('maps condition and availability without inventing missing data', () => {
        expect(getProductCondition(true)).toBe('Nuevo')
        expect(getProductCondition(false)).toBe('Segunda mano')
        expect(getProductCondition()).toBe('Estado por confirmar')
        expect(getProductAvailability(true)).toBe('Disponible')
        expect(getProductAvailability(false)).toBe('No disponible')
        expect(getProductAvailability()).toBe('Consultar disponibilidad')
    })
})
