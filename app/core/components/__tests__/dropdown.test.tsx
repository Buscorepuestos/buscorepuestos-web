import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import Dropdown from '../Dropdown';

describe('Dropdown component', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the "Ver más" text and icon', () => {
        render(<Dropdown />);
        expect(screen.getByText('Ver más')).toBeDefined();
        expect(screen.getByAltText('dropdown icon')).toBeDefined();
    });

    it('toggles content visibility when clicking the icon', () => {
        render(<Dropdown content={<div>Dropdown Content</div>} />);
        
        expect(screen.queryByText('Dropdown Content')).toBeNull();
        fireEvent.click(screen.getByAltText('dropdown icon'));

        expect(screen.getByText('Dropdown Content')).toBeDefined();
        fireEvent.click(screen.getByAltText('dropdown icon'));

        expect(screen.queryByText('Dropdown Content')).toBeNull();
    });

    it('hides "Ver más" text when the dropdown is open', () => {
        render(<Dropdown content={<div>Dropdown Content</div>} />);
        
        expect(screen.getByText('Ver más')).toBeDefined();
        fireEvent.click(screen.getByAltText('dropdown icon'));
        expect(screen.queryByText('Ver más')).toBeNull();
    });
});