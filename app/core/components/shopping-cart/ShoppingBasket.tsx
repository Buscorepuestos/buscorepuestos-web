import React from 'react';
import ProductCartInfo from './ProductCartInfo';
import styled from 'styled-components';

interface Product {
    image: string;
    title: string;
    brand: string;
    model: string;
    ref: string;
    price: number;
    isMobile: boolean;
    isAvailable: boolean;
}

interface ShoppingBasketProps {
    products: Product[];
}

const BasketContainer = styled.div`
    max-height: 340px;
    padding-right: 20px;
    padding-left: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scrollbar-width: thin; 
    scrollbar-color: #888 #f0f0f0;
`;

const ShoppingBasket: React.FC<ShoppingBasketProps> = ({ products }) => {
    return (
        <div>
            <h1 className='font-tertiary-font font-semibold mb-8 text-[18px] pl-[20px]'>
                Tu cesta
            </h1>
            <BasketContainer>
                {products.map((product, index) => (
                    <ProductCartInfo
                        key={index}
                        image={product.image}
                        title={product.title}
                        brand={product.brand}
                        model={product.model}
                        ref={product.ref}
                        price={product.price}
                        isMobile={product.isMobile}
                        isAvailable={product.isAvailable}
                    />
                ))}
            </BasketContainer>
        </div>
    );
};

export default ShoppingBasket;
