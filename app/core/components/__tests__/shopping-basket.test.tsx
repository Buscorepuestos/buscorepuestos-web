import { render, screen, cleanup, within, RenderOptions } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach} from 'vitest'
import ShoppingBasket from '../shopping-cart/ShoppingBasket'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import shoppingCartReducer from '../../../redux/features/shoppingCartSlice';



describe('ShoppingBasket Component', () => {

    const mockProducts = [
        {
            images: ['/card-preview.webp'],
            title: 'Product 1',
            brand: 'Brand 1',
            articleModel: 'Model 1',
            mainReference: 'Ref1',
            buscorepuestosPrice: 100.01,
            isMobile: false,
            stock: true,
            _id: 'productId1',
        },
        {
            images: ['/card-preview.webp'],
            title: 'Product 2',
            brand: 'Brand 2',
            articleModel: 'Model 2',
            mainReference: 'Ref2',
            buscorepuestosPrice: 200.00,
            isMobile: true,
            stock: true,
            _id: 'productId2',
        }
    ];

    const renderWithProvider = (
        ui: React.ReactElement,
        {
            store,
            ...renderOptions
        }: {
            store: ReturnType<typeof configureStore>;
        } & Omit<RenderOptions, 'queries'> = {
            store: configureStore({
                reducer: { cart: shoppingCartReducer },
                preloadedState: { cart: { items: [] } },
            }),
        }
    ) => {
        const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
            <Provider store={store}>{children}</Provider>
        );
    
        return render(ui, { wrapper: Wrapper, ...renderOptions });
    };
    
    const renderComponent = (props = mockProducts) => {
        renderWithProvider(<ShoppingBasket products={props} isMobile />);
    };
    
    beforeEach(() => {
        renderComponent(mockProducts);
    });

    afterEach(() => {
        cleanup();
    });

    it('should render the header with correct text', () => {
        const headerElement = screen.getByText('Tu cesta');
        expect(headerElement).not.toBeNull(); 
    });

    it('should render the correct number of ProductCartInfo components', () => {
        const productElements = screen.getAllByTestId('product-cart-info');
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
                    return new RegExp(mockProduct.articleModel.toUpperCase(), 'i').test(content);
                }
                return false;
            });
            expect(modelElement).not.toBeNull();

            const refElement = getByText(new RegExp(`Ref. ${mockProduct.mainReference}`, 'i'));
            expect(refElement).not.toBeNull();

            const priceElement = getByText(new RegExp(`${mockProduct.buscorepuestosPrice.toFixed(2)}€`, 'i'));
            expect(priceElement).not.toBeNull(); 
        });
    });
});