import { render, screen, cleanup, within } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, afterAll} from 'vitest'
import ShoppingBasket from '../shopping-cart/ShoppingBasket'

describe('ShoppingBasket Component', () => {

    const mockProducts = [
        {
            image: '/card-preview.webp',
            title: 'Product 1',
            brand: 'Brand 1',
            model: 'Model 1',
            ref: 'Ref1',
            price: 100,
            isMobile: false,
            isAvailable: true,
        },
        {
            image: '/card-preview.webp',
            title: 'Product 2',
            brand: 'Brand 2',
            model: 'Model 2',
            ref: 'Ref2',
            price: 200,
            isMobile: true,
            isAvailable: true,
        }
    ];
    
    beforeEach(() => {
        render(<ShoppingBasket products={mockProducts} />);
    });

    afterEach(() => {
        cleanup();
    });

    afterAll(() => {
        cleanup();
    });
    
    it('should render the header with correct text', () => {
        const headerElement = screen.getByText('Tu cesta');
        expect(headerElement).not.toBeNull(); 
    });

    it('should render the correct number of ProductCartInfo components', () => {
        const productElements = screen.getAllByTestId('product-cart-info');
        console.log(productElements)
        expect(productElements.length).toBe(mockProducts.length); 
    });

    it('should render ProductCartInfo with correct content', () => {
        const productElements = screen.getAllByTestId('product-cart-info');
        expect(productElements.length).toBe(mockProducts.length);

        mockProducts.forEach((mockProduct, index) => {
            const productElement = productElements[index];
            const { getByText, queryByText } = within(productElement);

            const titleElement = getByText(mockProduct.title);
            expect(titleElement).not.toBeNull(); 

            const brandElement = queryByText((content, element) => {
                if (element && element.tagName.toLowerCase() === 'h2') {
                    return new RegExp(mockProduct.brand.toUpperCase(), 'i').test(content);
                }
                return false;
            });
            expect(brandElement).not.toBeNull();

            const modelElement = queryByText((content, element) => {
                if (element && element.tagName.toLowerCase() === 'h2') {
                    return new RegExp(mockProduct.model.toUpperCase(), 'i').test(content);
                }
                return false;
            });
            expect(modelElement).not.toBeNull();

            const refElement = getByText(new RegExp(`Ref. ${mockProduct.ref}`, 'i'));
            expect(refElement).not.toBeNull();

            const priceElement = getByText(new RegExp(`${mockProduct.price.toString().replace('.', ',')}€`, 'i'));
            expect(priceElement).not.toBeNull(); 
        });
    });
});