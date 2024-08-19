import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import TagBanner from '../tags/TagBanner'

const mockTitle = 'Prueba'
const mockHeight = '300'
const mockWidth = '500'
const mockColor = 'grey'
const mockAlign = 'center'
const mockFlexDir = 'flex-col'
const mockPadding = 'p-2'
const mockFontColor = 'white'
const mockRadius = 'rounded-tl-3xl rounded-bl-3xl'
const mockPosition = 'absolute'
const mockIndex = 'z-0'
const mockAxis = 'bottom-9'

describe('Tag Banner component', () => {
	afterEach(() => {
		cleanup()
	})
	test('gray background color render', () => {
		const { container } = render(
			<TagBanner
				title={mockTitle}
				flexDir={mockFlexDir}
				height={mockHeight}
				width={mockWidth}
				color={mockColor}
				align={mockAlign}
				padding={mockPadding}
				alignSelf={mockAlign}
				fontColor={mockFontColor}
				alignItems={mockAlign}
				radius={mockRadius}
				position={mockPosition}
				zIndex={mockIndex}
				axis={mockAxis}
			>
				<p>Test</p>
			</TagBanner>
		)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.backgroundColor).toBe(mockColor)
	})
	test('Passing justify to left', () => {
		const { container } = render(
			<TagBanner
				title={mockTitle}
				flexDir={mockFlexDir}
				height={mockHeight}
				width={mockWidth}
				color={mockColor}
				align={'left'}
				padding={mockPadding}
				alignSelf={mockAlign}
				fontColor={mockFontColor}
				alignItems={mockAlign}
				radius={mockRadius}
				position={mockPosition}
				zIndex={mockIndex}
				axis={mockAxis}
			>
				<p>Test</p>
			</TagBanner>
		)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.justifyContent).toBe(`flex-start`)
	})
	test('Passing justify to right', () => {
		const { container } = render(
			<TagBanner
				title={mockTitle}
				flexDir={mockFlexDir}
				height={mockHeight}
				width={mockWidth}
				color={mockColor}
				align={'right'}
				padding={mockPadding}
				alignSelf={mockAlign}
				fontColor={mockFontColor}
				alignItems={mockAlign}
				radius={mockRadius}
				position={mockPosition}
				zIndex={mockIndex}
				axis={mockAxis}
			>
				<p>Test</p>
			</TagBanner>
		)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.justifyContent).toBe(`flex-end`)
	})
	test('Passing align items to left', () => {
		const { container } = render(
			<TagBanner
				title={mockTitle}
				flexDir={mockFlexDir}
				height={mockHeight}
				width={mockWidth}
				color={mockColor}
				align={mockAlign}
				padding={mockPadding}
				alignSelf={mockAlign}
				fontColor={mockFontColor}
				alignItems={'left'}
				radius={mockRadius}
				position={mockPosition}
				zIndex={mockIndex}
				axis={mockAxis}
			>
				<p>Test</p>
			</TagBanner>
		)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.alignItems).toBe(`flex-start`)
	})
	test('Passing align items to right', () => {
		const { container } = render(
			<TagBanner
				title={mockTitle}
				flexDir={mockFlexDir}
				height={mockHeight}
				width={mockWidth}
				color={mockColor}
				align={mockAlign}
				padding={mockPadding}
				alignSelf={mockAlign}
				fontColor={mockFontColor}
				alignItems={'right'}
				radius={mockRadius}
				position={mockPosition}
				zIndex={mockIndex}
				axis={mockAxis}
			>
				<p>Test</p>
			</TagBanner>
		)
		const sectionElement = container.firstChild as HTMLElement
		expect(sectionElement.style.alignItems).toBe(`flex-end`)
	})
})
