import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PaymentMethods from '../../components/paymentMethod/paymentMethod'

const paymentOptions = [
	{
		src: '/path/to/image1.jpg',
		alt: 'Alt text 1',
		subtitle: 'Subtitle 1',
		width: 100,
		height: 100,
	},
	{
		src: '/path/to/image2.jpg',
		alt: 'Alt text 2',
		subtitle: 'Subtitle 2',
		width: 100,
		height: 100,
	},
	{
		src: '/path/to/image3.jpg',
		alt: 'Alt text 3',
		subtitle: 'Subtitle 3',
		width: 100,
		height: 100,
	},
	{
		src: '/path/to/image4.jpg',
		alt: 'Alt text 4',
		subtitle: 'Subtitle 4',
		width: 100,
		height: 100,
	}
]

describe('PaymentMethods Component', () => {
	it('renders the component with payment options', () => {
		render(<PaymentMethods paymentOptions={paymentOptions} />)

		// Check for the main text
		expect(screen.getByText('Paga con la mayor comodidad')).toBeTruthy()

		// Check for the subtitles
		paymentOptions.forEach((option) => {
			const elements = screen.getAllByText(option.subtitle)
			expect(elements.length).toBeGreaterThan(0)
		})

		// Check for the alt text of images
		paymentOptions.forEach((option) => {
			const elements = screen.getAllByAltText(option.alt)
			expect(elements.length).toBeGreaterThan(0)
		})

		// Check for the src attribute of images
		paymentOptions.forEach((option) => {
			const imgElements = screen.getAllByAltText(option.alt)
			imgElements.forEach((img) => {
				const imgSrc = (img as HTMLImageElement).src
				expect(imgSrc).toContain(encodeURIComponent(option.src))
			})
		})
	})
})
