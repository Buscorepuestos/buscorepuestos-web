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
        expect(titleElement).toBeTruthy();
    });

    it('renders the reference number correctly', () => {
        render(<ProductTitle {...props} />);
        const refElement = screen.getByText(`${props.refNumber}`);
        expect(refElement).toBeTruthy();
    });

    it('renders the product name correctly', () => {
        render(<ProductTitle {...props} />);
        const productNameElement = screen.getByText(props.productName);
        expect(productNameElement).toBeTruthy();
    });

    it('renders the image correctly', () => {
        render(<ProductTitle {...props} />);
        const imageElement = screen.getByAltText('compartir-desktop');
        expect(imageElement).toBeTruthy();
        expect(imageElement.getAttribute('src')).toBe(props.imageSrc);
    });

    it('render the reference number and image mobile version when isWideScreen is true', () => {
        render(<ProductTitle {...props} isWideScreen={true} />);
        expect(screen.getAllByRole('ref-mobile')).toBeTruthy();
        expect(screen.queryByAltText('compartir')).toBeTruthy();
    });

    it('renders the reference number and image when isWideScreen is false', () => {
        render(<ProductTitle {...props} isWideScreen={false} />);
        const refElement = screen.getByText(`${props.refNumber}`);
        const imageElement = screen.getByAltText('compartir-desktop');

        expect(refElement).toBeTruthy();
        expect(imageElement).toBeTruthy();
    });
});