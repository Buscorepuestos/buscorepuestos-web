import { expect, test, describe, afterEach, beforeEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Banner from '../Banner'

const mockUrl = 'https://picsum.photos/200/300'
const mockHeight = '300'
const mockColor = 'grey'

describe('Banner image component', () => {
	afterEach(() => {
		cleanup()
	})
	test('Background url renders', () => {
		const { container } = render(<Banner imgUrl={mockUrl} height={mockHeight} color={mockColor}>
			<h1>Test</h1>
		</Banner>)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.backgroundImage).toBe(`url(${mockUrl})`)
	})
	test('Passing align left', () => {
		const { container } = render(<Banner imgUrl={mockUrl} height={mockHeight} aligned={'left'} color={mockColor}>
			<h1>Test</h1>
		</Banner>)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.justifyContent).toBe(`flex-start`)
	})
	test('Passing align right', () => {
		const { container } = render(<Banner imgUrl={mockUrl} height={mockHeight} aligned={'right'} color={mockColor}>
			<h1>Test</h1>
		</Banner>)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.justifyContent).toBe(`flex-end`)
	})
	test('Passing blue color as background', () => {
		const { container } = render(<Banner imgUrl={mockUrl} height={mockHeight} aligned={'right'} color={'blue'}>
			<h1>Test</h1>
		</Banner>)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.backgroundColor).toBe(`blue`)
	})
})
