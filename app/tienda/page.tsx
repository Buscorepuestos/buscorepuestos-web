import type { Metadata } from 'next'
import StoreClient from './StoreClient'

export const metadata: Metadata = {
	title: 'Tienda de Repuestos | Buscorepuestos',
	description: 'Compra repuestos de coche de segunda mano, reconstruidos y nuevos. Más de 15 millones de piezas disponibles con envío incluido y 2 años de garantía.',
	openGraph: {
		title: 'Tienda de Repuestos | Buscorepuestos',
		description: 'Compra repuestos de coche de segunda mano, reconstruidos y nuevos.',
	},
}

export default function Page() {
	return <StoreClient />
}