import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import PaymentMethods from '../paymentMethod/paymentMethod';

describe('PaymentMethods component', () => {
    afterEach(() => {
        cleanup();
    });

    const paymentOptions = [
        { src: '/image1.png', alt: 'Image 1', subtitle: 'Option 1', width: 50, height: 50 },
        { src: '/image2.png', alt: 'Image 2', subtitle: 'Option 2', width: 50, height: 50 },
        { src: '/image3.png', alt: 'Image 3', subtitle: 'Option 3', width: 50, height: 50 },
        { src: '/image4.png', alt: 'Image 4', subtitle: 'Option 4', width: 50, height: 50 },
        { src: '/image5.png', alt: 'Image 5', subtitle: 'Option 5', width: 50, height: 50 }
    ];

    it('should render the component with payment options', () => {
        render(<PaymentMethods isWideScreen={true} paymentOptions={paymentOptions} />);

        const option1 = screen.getByAltText('Image 1');
        const option2 = screen.getByAltText('Image 2');
        const option3 = screen.getByAltText('Image 3');
        const option4 = screen.getByAltText('Image 4');
        const option5 = screen.getByAltText('Image 5');

        expect(option1).toBeDefined();
        expect(option2).toBeDefined();
        expect(option3).toBeDefined();
        expect(option4).toBeDefined();
        expect(option5).toBeDefined();

        const subtitle1 = screen.getByText('Option 1');
        const subtitle2 = screen.getByText('Option 2');
        const subtitle3 = screen.getByText('Option 3');
        const subtitle4 = screen.getByText('Option 4');
        const subtitle5 = screen.getByText('Option 5');

        expect(subtitle1).toBeDefined();
        expect(subtitle2).toBeDefined();
        expect(subtitle3).toBeDefined();
        expect(subtitle4).toBeDefined();
        expect(subtitle5).toBeDefined();
    });

    it('should conditionally render elements based on isWideScreen prop', () => {
        const { rerender, container } = render(<PaymentMethods isWideScreen={true} paymentOptions={paymentOptions} />);

        // Verificamos si los separadores condicionales se renderizan
        let separators = container.querySelectorAll('.separator');
        expect(separators.length).toBe(3);

        rerender(<PaymentMethods isWideScreen={false} paymentOptions={paymentOptions} />);

        // Verificamos que los separadores no se renderizan en pantalla pequeña
        separators = container.querySelectorAll('.separator');
        expect(separators.length).toBe(1);

        const mobileOption5 = screen.getByAltText('Image 5');
        expect(mobileOption5).toBeDefined();
    });
});