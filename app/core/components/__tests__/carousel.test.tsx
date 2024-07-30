import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Carousel from '../../components/carousel/carousel' // Adjust the import path as necessary

describe('Carousel', () => {
	afterEach(() => {
		cleanup()
	})

	const images = [
		{ image: '/image1.jpg' },
		{ image: '/image2.jpg' },
		{ image: '/image3.jpg' },
	]

	it('renders the main images', () => {
		render(<Carousel images={images} />)

		const mainImages = screen.getAllByAltText(/Main Carousel Image/i)
		expect(mainImages.length).toBe(images.length)

		mainImages.forEach((imageElement, index) => {
			const src = (imageElement as HTMLImageElement).src
			expect(src).toContain(images[index].image.split('/').pop())
		})
	})

	it('renders the thumbnail images', () => {
		render(<Carousel images={images} />)

		const thumbnailImages = screen.getAllByAltText(
			/Thumbnail Carousel Image/i
		)
		const filteredThumbnailImages = thumbnailImages.filter(
			(img) =>
				(img as HTMLImageElement).className === 'carousel-thumb-images'
		)

		expect(filteredThumbnailImages.length).toBe(images.length)

		filteredThumbnailImages.forEach((imageElement, index) => {
			const src = (imageElement as HTMLImageElement).src
			expect(src).toContain(images[index].image.split('/').pop())
		})
	})
})
