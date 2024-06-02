import { expect, test, describe, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Slider from '../Slider'


describe('Slidera component', () => {
	afterEach(() => {
		cleanup()
	})
	test('Slider content elements', () => {
		render(<Slider>
			<div>Slide 1</div>
			<div>Slide 2</div>
			<div>Slide 3</div>
		</Slider>)
		expect(screen.getByText('Slide 1')).toBeDefined()
		expect(screen.getByText('Slide 2')).toBeDefined()
		expect(screen.getByText('Slide 3')).toBeDefined()
	})
})