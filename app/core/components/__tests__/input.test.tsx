import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Input from '../input/input'; // Ajusta la ruta según la ubicación de tu componente

describe('Input Component', () => {
    afterEach(() => {
        cleanup();
    });

    // Prueba para verificar que se muestra el error al perder el foco y el campo está vacío
    it('should display error message when input loses focus and value is empty', () => {
        render(<Input placeholder="Nombre y apellidos" value="" />);
        const inputElement = screen.getByPlaceholderText('Nombre y apellidos') as HTMLInputElement;

        fireEvent.blur(inputElement); // Simula el evento onBlur

        const errorMessage = screen.queryByText('Campo requerido');
        expect(errorMessage).not.toBeNull(); // Verifica que el mensaje de error está presente
    });

    // Prueba para verificar que no se muestra el error si el valor no está vacío
    it('should not display error message when input loses focus and value is not empty', () => {
        render(<Input placeholder="Nombre y apellidos" value="John Doe" />);
        const inputElement = screen.getByPlaceholderText('Nombre y apellidos') as HTMLInputElement;

        fireEvent.blur(inputElement); // Simula el evento onBlur

        const errorMessage = screen.queryByText('Campo requerido');
        expect(errorMessage).toBeNull(); // Verifica que el mensaje de error no está presente
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