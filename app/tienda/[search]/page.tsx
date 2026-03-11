import type { Metadata } from 'next'
import StoreClientParam from './StoreClientParam'

export const metadata: Metadata = {
    title: 'Tienda de Repuestos | Buscorepuestos',
    description: 'Compra repuestos de coche de segunda mano, reconstruidos y nuevos. Más de 15 millones de piezas disponibles con envío incluido y 2 años de garantía.',
    openGraph: {
        title: 'Tienda de Repuestos | Buscorepuestos',
        description: 'Compra repuestos de coche de segunda mano, reconstruidos y nuevos.',
    },
}

export default function Page(props: { params: Promise<{ search: string }> }) {
    return <StoreClientParam params={props.params} />
}