import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Image from 'next/image';
import ButtonIcon from '../buttonIcon/buttonIcon';

//Simular el componente de Next.js Image
// vi.mock('next/image', () => ({
//     __esModule: true,
//     default: ({ src, alt, width, height }: { src: string, alt: string, width: number, height: number }) => {
//         return <Image src={src} alt={alt} width={width} height={height} />;
//     },
// }));

describe('ButtonIcon', () => {

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('debería renderizar el botón con la imagen y el label proporcionados', () => {
        render(
            <ButtonIcon
                iconSrc="/transferencia.svg"
                label="Test Label"
                isSelected={false}
                onClick={() => {}}
                imageWidth={50}
                imageHeight={50}
            />
        );

        // Verificar que el label está presente
        const labelElement = screen.getByText('Test Label');
        expect(labelElement).toBeTruthy();

        // Verificar que la imagen tiene el src correcto
        const imageElement = screen.getByAltText('Test Label') as HTMLImageElement;
        expect(imageElement.src).toContain('/transferencia.svg');
    });

    it('debería cambiar la imagen cuando el botón está seleccionado', () => {
        render(
            <ButtonIcon
                iconSrc="/tarjeta.svg"
                selectedIconSrc="/tarjeta-azul.svg"
                label="Test Label"
                isSelected={true}
                onClick={() => {}}
                imageWidth={50}
                imageHeight={50}
            />
        );

        // Verificar que la imagen tiene el src correcto
        const imageElement = screen.getByAltText('Test Label') as HTMLImageElement;
        expect(imageElement.src).toContain('/tarjeta-azul.svg');
    });
    
    it('debería usar iconSrc cuando selectedIconSrc no está definido', () => {
        render(
            <ButtonIcon
                iconSrc="tarjeta.svg"
                label="Test Label"
                isSelected={true}
                onClick={() => {}}
                imageWidth={50}
                imageHeight={50}
            />
        );

        // Verificar que la imagen tiene el src correcto
        const imageElement = screen.getByAltText('Test Label') as HTMLImageElement;
        expect(imageElement.src).toContain('/tarjeta.svg');
    });

    it('debería llamar a la función onClick cuando el botón es clickeado', () => {
        const handleClick = vi.fn();
        render(
            <ButtonIcon
                iconSrc="/transferencia.svg"
                label="Test Label"
                isSelected={false}
                onClick={handleClick}
                imageWidth={50}
                imageHeight={50}
            />
        );

        const buttonElement = screen.getByText('Test Label').parentElement;
        if (buttonElement) {
            fireEvent.click(buttonElement);
        }

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});