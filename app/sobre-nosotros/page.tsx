import type { Metadata } from 'next'
import SobreNosotrosClient from './SobreNosotrosClient'

export const metadata: Metadata = {
	title: 'Sobre Nosotros | Buscorepuestos',
	description: 'Conoce al equipo de Buscorepuestos. Ayudamos a encontrar repuestos de coche de forma rápida y con los mejores precios de España.',
}

export default function Page() {
	return <SobreNosotrosClient />
}