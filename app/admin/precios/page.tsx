import type { Metadata } from 'next'
import PriceAdminClient from './PriceAdminClient'

export const metadata: Metadata = {
	title: 'Administración de precios | Buscorepuestos',
	robots: { index: false, follow: false },
}

export default function AdminPricesPage() {
	return <PriceAdminClient />
}
