import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Checkbox from '../checkbox/checkbox';

describe('Checkbox Component', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render checkbox with correct label', () => {
        render(
            <Checkbox
                name="test-checkbox"
                value="test-value"
                onChange={() => {}}
                label="Test Label"
            />
        );
        expect(screen.queryByText('Test Label')).not.toBeNull();
    });

    it('should handle checkbox state change', () => {

        const handleChange = vi.fn();

        render(
            <Checkbox
                name="test-checkbox"
                value="test-value"
                onChange={handleChange}
                label="Test Label"
            />
        );

        const checkboxElement = screen.getByRole('checkbox') as HTMLInputElement;

        expect(checkboxElement.checked).toBe(false);

        fireEvent.click(checkboxElement);

        expect(handleChange).toHaveBeenCalled();

        expect(checkboxElement.checked).toBe(true);

        fireEvent.click(checkboxElement);

        expect(checkboxElement.checked).toBe(false);
    });

    it('should always display the checkmark image', () => {
        render(
            <Checkbox
                name="test-checkbox"
                value="test-value"
                onChange={() => {}}
                label="Test Label"
            />
        );

        // Obtén el ícono del checkmark
        const checkmarkImage = screen.getByAltText('Checkmark');

        // Verifica que el ícono está presente en el DOM
        expect(checkmarkImage).not.toBeNull();
    });
});