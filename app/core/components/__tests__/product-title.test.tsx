import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ProductTitle from '../productTitle/productTitle';

describe('ProductTitle', () => {
    afterEach(() => {
        cleanup();
    });

    const props = {
        title: 'Parachoques delantero Mitsubishi Evo VIII 2004',
        refNumber: '5FG8715S52SA',
        productName: 'MITSUBISHI EVO VIII 2004',
        imageSrc: '/COMPARTIR.svg',
    };

    it('renders the title correctly', () => {
        render(<ProductTitle {...props} />);
        const titleElement = screen.getByText(props.title);
        expect(titleElement).not.toBeNull();
    });

    it('renders the reference number correctly', () => {
        render(<ProductTitle {...props} />);
        const refElements = screen.getAllByText(props.refNumber);
        expect(refElements.length).toBeGreaterThan(0); // Verifica que hay al menos un elemento con el texto esperado
    });

    it('renders the product name correctly', () => {
        render(<ProductTitle {...props} />);
        const productNameElement = screen.getByText(props.productName);
        expect(productNameElement).not.toBeNull();
    });

    it('renders the image correctly', () => {
        render(<ProductTitle {...props} />);
        const imageElement = screen.getByAltText('compartir-desktop');
        expect(imageElement).not.toBeNull();
        expect((imageElement as HTMLImageElement).src).toContain(props.imageSrc);
    });

    it('renders the reference number and image in mobile version correctly', () => {
        render(<ProductTitle {...props} />);
        const refMobileElements = screen.getAllByRole('ref-mobile');
        expect(refMobileElements.length).toBeGreaterThan(0);
        const imageMobileElement = screen.getByAltText('compartir');
        expect(imageMobileElement).not.toBeNull();
    });
});
