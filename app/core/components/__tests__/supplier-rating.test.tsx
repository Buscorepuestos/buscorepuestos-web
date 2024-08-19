import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import SupplierRating from '../supplierRating/supplierRating';

// Mock para el componente Star
vi.mock('../svg/star', () => ({
    default: ({ isFilled, className }: { isFilled: boolean, className: string }) => (
        <div data-testid="star" className={className}>{isFilled ? '★' : '☆'}</div>
    ),
}));

// Mock para el componente Image de next/image
vi.mock('next/image', () => ({
    default: ({ src, alt, width, height, className }: { src: string, alt: string, width: number, height: number, className: string }) => (
        <div data-testid="image" className={className}>
        <span>{src}</span>
        <span>{alt}</span>
        </div>
    ),
}));

describe('SupplierRating Component', () => {

    afterEach(() => {
        cleanup();
    });

    it('renders the title correctly', () => {
        render(<SupplierRating valoration={3} location="Huelva" title="Valoración del Proveedor" />);
        expect(screen.getByText('Valoración del Proveedor')).toBeDefined();
    });

    it('renders the location correctly', () => {
        render(<SupplierRating valoration={3} location="Huelva" title="Valoración del Proveedor" />);
        expect(screen.getByText('Huelva')).toBeDefined();
    });

    it('renders the correct number of stars filled based on valoration', () => {
        render(<SupplierRating valoration={3} location="Huelva" title="Valoración del Proveedor" />);
        const stars = screen.getAllByTestId('star');
        expect(stars.length).toBe(5);
        expect(stars.filter(star => star.textContent === '★').length).toBe(3);
        expect(stars.filter(star => star.textContent === '☆').length).toBe(2);
    });

    it('renders the location icon correctly', () => {
        render(<SupplierRating valoration={3} location="Huelva" title="Valoración del Proveedor" />);
        const image = screen.getByTestId('image');
        expect(image).toBeDefined();
        expect(image.textContent).toContain('/ubication.svg');
        expect(image.textContent).toContain('ubication');
    });
});