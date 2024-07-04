import { expect, test, describe, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Button from '../Button'


describe('Button component', () => {
	afterEach(() => {
		cleanup()
	})
	test('Default primary button', () => {
		render(<Button />)
		const button = screen.getByRole('button', { name: 'Comprar' });
		expect(button).toBeDefined();
		expect(button.className).toContain('bg-primary-blue');
		expect(button.className).toContain('hover:bg-primary-lila');
		expect(button.className).toContain('hover:text-white');
	})
	test('Custom styles for primary button', () => {
		render(
			<Button
				bg="bg-blue-700"
				hoverBg="hover:bg-blue-900"
				hoverText="hover:text-yellow-300"
			/>
		);
		const button = screen.getByRole('button', { name: 'Comprar' });
		expect(button.className).toContain('bg-blue-700');
		expect(button.className).toContain('hover:bg-blue-900');
		expect(button.className).toContain('hover:text-yellow-300');
	});
	test('Secondary button', () => {
		render(<Button type="secondary" />)
		const button = screen.getByRole('button', { name: 'Añadir a la cesta' });
		expect(button).toBeDefined();
		expect(button.className).toContain('bg-secondary-blue');
		expect(button.className).toContain('hover:bg-custom-white');
		expect(button.className).toContain('hover:text-secondary-blue');
		expect(button.className).toContain('border-secondary-blue');
	})
	test('Custom styles for secondary button', () => {
		render(
			<Button
				type="secondary"
				bg="bg-red-500"
				hoverBg="hover:bg-green-500"
				hoverText="hover:text-black"
				borderColor="border-yellow-500"
			/>
		);
		const button = screen.getByRole('button', { name: 'Añadir a la cesta' });
		expect(button.className).toContain('bg-red-500');
		expect(button.className).toContain('hover:bg-green-500');
		expect(button.className).toContain('hover:text-black');
		expect(button.className).toContain('border-yellow-500');
	});
	test('Tertiary button', () => {
		render(<Button type="tertiary" />);
		const button = screen.getByRole('button', { name: 'Siguiente' });
		expect(button).toBeDefined();
		expect(button.className).toContain('bg-secondary-blue');
		expect(button.className).toContain('hover:bg-custom-white');
		expect(button.className).toContain('hover:text-secondary-blue');
		expect(button.className).toContain('border-secondary-blue');
	});
	test('Custom styles for tertiary button', () => {
		render(
			<Button
				type="tertiary"
				bg="bg-purple-500"
				hoverBg="hover:bg-orange-500"
				hoverText="hover:text-gray-700"
				borderColor="border-pink-500"
			/>
		);
		const button = screen.getByRole('button', { name: 'Siguiente' });
		expect(button.className).toContain('bg-purple-500');
		expect(button.className).toContain('hover:bg-orange-500');
		expect(button.className).toContain('hover:text-gray-700');
		expect(button.className).toContain('border-pink-500');
	});
	test('Passing a label name', () => {
		render(<Button labelName="prueba" type="secondary" />)
		expect(screen.getByRole('button', { name: 'prueba' })).toBeDefined()
	})
})
