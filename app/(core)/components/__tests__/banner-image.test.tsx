import { expect, test, describe, afterEach, beforeEach } from 'vitest'
import {render, screen } from '@testing-library/react'
import BannerImage from '../BannerImage'


describe('Banner image component', () => {
	test('Background url renders', () => {
		const mockUrl = 'https://picsum.photos/200/300'
		const mockHeight = '300'
		const { container } = render(<BannerImage imgUrl={mockUrl} height={mockHeight}>
			<h1>Test</h1>
		</BannerImage>)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.backgroundImage).toBe(`url(${mockUrl})`)
	})
	test('Passing element as a children', () => {
		expect(screen.getByRole('heading', { level: 1, name: 'Test' })).toBeDefined()
	})
})