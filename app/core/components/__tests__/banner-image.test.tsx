import { expect, test, describe, afterEach, beforeEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import BannerImage from '../BannerImage'

const mockUrl = 'https://picsum.photos/200/300'
const mockHeight = '300'

describe('Banner image component', () => {
	afterEach(() => {
		cleanup()
	})
	test('Background url renders', () => {
		const { container } = render(<BannerImage imgUrl={mockUrl} height={mockHeight}>
			<h1>Test</h1>
		</BannerImage>)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.backgroundImage).toBe(`url(${mockUrl})`)
	})
	test('Passing align left', () => {
		const { container } = render(<BannerImage imgUrl={mockUrl} height={mockHeight} aligned={'left'}>
			<h1>Test</h1>
		</BannerImage>)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.justifyContent).toBe(`flex-start`)
	})
	test('Passing align right', () => {
		const { container } = render(<BannerImage imgUrl={mockUrl} height={mockHeight} aligned={'right'}>
			<h1>Test</h1>
		</BannerImage>)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.justifyContent).toBe(`flex-end`)
	})
})