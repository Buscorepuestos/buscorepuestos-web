import React from 'react'
import { expect, test, describe, afterEach, beforeEach, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import ShareButton from '../shareButton/shareButton'

describe('ShareButton Component', () => {
	beforeEach(() => {
		// Mock de window.alert para evitar el error "Not implemented"
		vi.spyOn(window, 'alert').mockImplementation(() => {})
	})

	afterEach(() => {
		cleanup()
		vi.restoreAllMocks()
	})

	// Test para verificar que el componente se renderiza correctamente
	test('renders ShareButton component', () => {
		render(
			<ShareButton
				imageSrc="/share-icon.png"
				productName="Test Product"
				title="Test Title"
			/>
		)
		const image = screen.getByAltText('compartir')
		expect(image).toBeDefined()
	})

	// Definir navigator.share manualmente para la prueba
	test('calls navigator.share on click if available', async () => {
		// Simulamos la existencia de navigator.share
		Object.defineProperty(navigator, 'share', {
			value: vi.fn(() => Promise.resolve()),
			writable: true,
		})

		render(
			<ShareButton
				imageSrc="/share-icon.png"
				productName="Test Product"
				title="Test Title"
			/>
		)

		const image = screen.getByAltText('compartir')
		await fireEvent.click(image)

		expect(navigator.share).toHaveBeenCalledWith({
			title: 'Test Product',
			text: `Mira este producto: Test Title\nMás información en: ${window.location.href}`,
		})
	})

	// Test para verificar que se copia al portapapeles si navigator.share no está disponible
	test('copies link to clipboard if navigator.share is not available', async () => {
		// Simulamos que navigator.share no existe
		Object.defineProperty(navigator, 'share', {
			value: undefined,
			writable: true,
		})

		// Asegurarse de que navigator.clipboard existe
		if (!navigator.clipboard) {
			;(navigator as any).clipboard = {}
		}

		// Simulamos la existencia de navigator.clipboard.writeText
		Object.defineProperty(navigator.clipboard, 'writeText', {
			value: vi.fn(() => Promise.resolve()),
			writable: true,
		})

		render(
			<ShareButton
				imageSrc="/share-icon.png"
				productName="Test Product"
				title="Test Title"
			/>
		)

		const image = screen.getByAltText('compartir')
		await fireEvent.click(image)

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			`Test Title - ${window.location.href}`
		)
	})
})
