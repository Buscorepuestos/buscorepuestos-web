import React from 'react'
import { expect, test, describe, afterEach, beforeEach, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import WhatsAppIcon from '../whatsapp/whatsapp'

describe('WhatsAppIcon Component', () => {
	// Limpiar después de cada prueba
	afterEach(() => {
		cleanup()
		vi.clearAllMocks()
	})

	test('renderiza correctamente el ícono de WhatsApp', () => {
		render(<WhatsAppIcon />)
		const imageElement = screen.getByAltText('WhatsApp')
		expect(imageElement).toBeDefined()

		// Verificar que el src del ícono es correcto
		expect(imageElement.getAttribute('src')).toBe('/whatsapp-icon.svg')
	})

	test('muestra el mensaje al hacer hover sobre el ícono', () => {
		render(<WhatsAppIcon />)
		const imageElement = screen.getByAltText('WhatsApp')

		// Verificamos que el mensaje no esté visible inicialmente
		expect(screen.queryByText('¡Envíanos cualquier consulta!')).toBeNull()

		// Simulamos el hover sobre el ícono
		fireEvent.mouseEnter(imageElement)

		// Ahora, el mensaje debería estar visible
		expect(screen.getByText('¡Envíanos cualquier consulta!')).toBeDefined()
	})

	test('oculta el mensaje al salir del hover', () => {
		render(<WhatsAppIcon />)
		const imageElement = screen.getByAltText('WhatsApp')

		// Simulamos el hover sobre el ícono
		fireEvent.mouseEnter(imageElement)

		// Simulamos salir del hover
		fireEvent.mouseLeave(imageElement)

		// El mensaje debería estar oculto nuevamente
		expect(screen.queryByText('¡Envíanos cualquier consulta!')).toBeNull()
	})

	test('abre WhatsApp en una nueva pestaña al hacer click', () => {
		render(<WhatsAppIcon />)
		const imageElement = screen.getByAltText('WhatsApp')

		// Mockeamos window.open para capturar la llamada
		const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

		// Simulamos el click en el ícono
		fireEvent.click(imageElement)

		// Verificamos que window.open haya sido llamada con la URL correcta
		const phoneNumber = '34611537631'
		const message = ''
		const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
		expect(openSpy).toHaveBeenCalledWith(whatsappURL, '_blank')
	})
})
