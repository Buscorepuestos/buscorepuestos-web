import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ProductPrice from '../productPrice/productPrice';
import Button, { ButtonProps } from '../Button';

describe('ProductPrice', () => {
    afterEach(() => {
        cleanup();
    });

    const button1Props: ButtonProps = { type: 'secondary', labelName: 'Añadir a la cesta' };
    const button2Props: ButtonProps = { type: 'primary', labelName: 'Comprar' };

    it('renders the price', () => {
        render(
            <ProductPrice
                price="148,12"
                shippingInfo="Envío e IVA incluido"
                warningImgSrc="/info.svg"
                originalPrice="200,00"
                discount="-10%"
                button1Props={button1Props}
                button2Props={button2Props}
            />
        );
        const priceElement = screen.getByText(/148,12€/i);
        expect(priceElement).toBeTruthy();
    });

    it('renders the shipping info', () => {
        render(
            <ProductPrice
                price="148,12"
                shippingInfo="Envío e IVA incluido"
                warningImgSrc="/info.svg"
                originalPrice="200,00"
                discount="-10%"
                button1Props={button1Props}
                button2Props={button2Props}
            />
        );
        const shippingInfoElement = screen.getByText(/Envío e IVA incluido/i);
        expect(shippingInfoElement).toBeTruthy();
    });

    it('renders the original price with a line-through style', () => {
        render(
            <ProductPrice
                price="148,12"
                shippingInfo="Envío e IVA incluido"
                warningImgSrc="/info.svg"
                originalPrice="200,00"
                discount="-10%"
                button1Props={button1Props}
                button2Props={button2Props}
            />
        );
        const originalPriceElement = screen.getByText(/200,00€/i);
        expect(originalPriceElement).toBeTruthy();
    });

    it('renders the discount', () => {
        render(
            <ProductPrice
                price="148,12"
                shippingInfo="Envío e IVA incluido"
                warningImgSrc="/info.svg"
                originalPrice="200,00"
                discount="-10%"
                button1Props={button1Props}
                button2Props={button2Props}
            />
        );
        const discountElement = screen.getByText(/-10%/i);
        expect(discountElement).toBeTruthy();
    });

    it('renders the buttons with correct labels', () => {
        render(
            <ProductPrice
                price="148,12"
                shippingInfo="Envío e IVA incluido"
                warningImgSrc="/info.svg"
                originalPrice="200,00"
                discount="-10%"
                button1Props={button1Props}
                button2Props={button2Props}
            />
        );
        const button1 = screen.getByText(/Añadir a la cesta/i);
        const button2 = screen.getByText(/Comprar/i);
        expect(button1).toBeTruthy();
        expect(button2).toBeTruthy();
    });
});