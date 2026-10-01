import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import CardPrice from '../cards/CardPrice'

const renderCard = () => render(
    <CardPrice
        id="product-1"
        title="Alternador"
        description="Audi · A4 · 2018"
        reference="06H903017"
        price={500}
        condition="Segunda mano"
        availability="Disponible"
        location="Madrid"
        image="/alternador.jpg"
    />
)

describe('CardPrice component', () => {
    afterEach(cleanup)

    test('shows the information needed to identify a compatible product', () => {
        renderCard()

        expect(screen.getByRole('heading', { level: 4, name: 'Alternador' })).toBeDefined()
        expect(screen.getByText('Audi · A4 · 2018')).toBeDefined()
        expect(screen.getByText('06H903017')).toBeDefined()
        expect(screen.getByText('500,00€')).toBeDefined()
        expect(screen.getByText('Segunda mano')).toBeDefined()
        expect(screen.getByText('Disponible')).toBeDefined()
        expect(screen.getByText('Madrid')).toBeDefined()
    })

    test('links the complete card to the product', () => {
        renderCard()

        expect(screen.getByRole('link', { name: 'Ver Alternador' }).getAttribute('href')).toBe('/producto/product-1')
        expect(screen.getByRole('img', { name: 'Fotografía de Alternador' })).toBeDefined()
        expect(screen.getByRole('button', { name: 'Ver producto' })).toBeDefined()
    })

    test('always shows a location row when the backend has no province', () => {
        render(<CardPrice title="Alternador" reference="06H903017" price={500} image="/alternador.jpg" />)

        expect(screen.getByText('Ubicación por confirmar')).toBeDefined()
    })

    test('preserves the familiar card order while adding status information', () => {
        const { container } = renderCard()
        const content = container.textContent || ''

        const orderedValues = ['Alternador', '06H903017', 'Audi · A4 · 2018', 'Segunda mano', 'Disponible', 'Madrid', '500,00€']
        const positions = orderedValues.map(value => content.indexOf(value))

        expect(positions.every(position => position >= 0)).toBe(true)
        expect(positions).toEqual([...positions].sort((a, b) => a - b))
    })
})
