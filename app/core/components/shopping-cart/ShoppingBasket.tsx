import React from 'react';
import ProductCartInfo from './ProductCartInfo';
import styled from 'styled-components';

interface Product {
    images: string[];
    title: string;
    brand: string;
    articleModel: string;
    mainReference: string;
    buscorepuestosPrice: number;
    stock: boolean;
    _id: string;
}

interface ShoppingBasketProps {
    products: Product[];
    isMobile: boolean;
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

const ShoppingBasket: React.FC<ShoppingBasketProps> = ({ products, isMobile }) => {
    return (
        <div>
            <h1 className='font-tertiary-font font-semibold mb-8 text-[18px] pl-[20px]'>
                Tu cesta
            </h1>
            <BasketContainer>
                {products.map((product, index) => (
                    <ProductCartInfo
                        key={index}
                        images={product.images}
                        title={product.title}
                        brand={product.brand}
                        articleModel={product.articleModel}
                        mainReference={product.mainReference}
                        buscorepuestosPrice={product.buscorepuestosPrice}
                        isMobile={isMobile}
                        stock={product.stock}
                        _id={product._id}
                    />
                ))}
            </BasketContainer>
        </div>
    );
};

export default ShoppingBasket;
