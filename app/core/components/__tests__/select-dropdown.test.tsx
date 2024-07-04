import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import SelectDropdown from '../selectDropdown/selectDropdown';

describe('SelectDropdown', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders correctly with provided props', () => {
        const options = [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        ];
        const placeholder = 'Choose a country';
        const name = 'country';
        const handleChange = vi.fn();

        render(<SelectDropdown options={options} placeholder={placeholder} name={name} onChange={handleChange} />);

        // Verifica que el placeholder está presente
        expect(screen.getByText(placeholder)).toBeTruthy();
        // Verifica que las opciones están presentes
        options.forEach(option => {
        expect(screen.getByText(option.label)).toBeTruthy();
        });
    });

    it('calls onChange handler when an option is selected', () => {
        const options = [
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
        ];
        const placeholder = 'Choose a country';
        const name = 'country';
        const handleChange = vi.fn();
    
        render(<SelectDropdown options={options} placeholder={placeholder} name={name} onChange={handleChange} />);
    
        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: 'CA' } });
    
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({ value: 'CA' })
        }));
    });
    
    it('renders the arrow icon', () => {
        const options = [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        ];
        const placeholder = 'Choose a country';
        const name = 'country';
        const handleChange = vi.fn();

        render(<SelectDropdown options={options} placeholder={placeholder} name={name} onChange={handleChange} />);

        const arrowIcon = screen.getByAltText('arrow-down');
        expect(arrowIcon).toBeTruthy();
    });
});