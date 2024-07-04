import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Input from '../input/input'; // Ajusta la ruta según la ubicación de tu componente

describe('Input Component', () => {
    afterEach(() => {
        cleanup();
    });
    
    it('should render the input field with the correct placeholder', () => {
        render(<Input placeholder="Nombre y apellidos" />);
        const inputElement = screen.getByPlaceholderText('Nombre y apellidos') as HTMLInputElement;
        expect(inputElement).not.toBeNull();
    });

    it('should render the input field with the correct value', () => {
        render(<Input value="Test value" placeholder="Nombre y apellidos" />);
        const inputElement = screen.getByPlaceholderText('Nombre y apellidos') as HTMLInputElement;
        expect(inputElement.value).toBe('Test value');
    });

    it('should call onChange handler when input value changes', () => {
        const handleChange = vi.fn();
        render(<Input placeholder="Nombre y apellidos" onChange={handleChange} />);
        const inputElement = screen.getByPlaceholderText('Nombre y apellidos') as HTMLInputElement;

        fireEvent.change(inputElement, { target: { value: 'New value' } });
        expect(handleChange).toHaveBeenCalled();
    });
});