import { describe, expect, test } from 'vitest'
import { isReferenceSearch, normalizeSearchQuery } from '../../../lib/searchQuery'

describe('reference query detection', () => {
    test.each([
        '8200299173',
        '8200 299 173',
        '8200-299-173',
        '8200.299.173',
        'DG3004433',
        'dg3004433',
        'DG 3004 433',
        'DG-3004-433',
    ])('detects %s as a reference without changing it', (query) => {
        expect(isReferenceSearch(query)).toBe(true)
    })

    test.each([
        'faro BMW E87',
        'alternador Audi A4 2.0 TDI',
        'motor Peugeot 308',
        'BMW E87',
        'faro',
    ])('does not classify %s as a reference', (query) => {
        expect(isReferenceSearch(query)).toBe(false)
    })
})

describe('reference query normalization', () => {
    test.each([
        ['SLV7700110484', 'SLV7700110484'],
        ['SLV77 00110 484', 'SLV7700110484'],
        ['SLV77-00110-484', 'SLV7700110484'],
        ['8200 667 606', '8200667606'],
        ['8200.667.606', '8200667606'],
    ])('normalizes %s internally as %s', (query, expected) => {
        expect(normalizeSearchQuery(query)).toBe(expected)
    })

    test.each([
        ['faro BMW E87', 'faro bmw e87'],
        ['alternador Audi A4 2.0 TDI', 'alternador audi a4 2.0 tdi'],
        ['mo.tor BMW', 'motor bmw'],
        ['  MOTOR---BMW  ', 'motor bmw'],
        ['válvula / presión', 'valvula presion'],
        ['motor,,, BMW!!!', 'motor bmw'],
        ['motor___BMW', 'motor bmw'],
    ])('normalizes text search %s as %s', (query, expected) => {
        expect(normalizeSearchQuery(query)).toBe(expected)
    })
})
