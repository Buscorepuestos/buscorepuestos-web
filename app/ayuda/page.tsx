import type { Metadata } from 'next'
import AyudaClient from './AyudaClient'

export const metadata: Metadata = {
	title: 'Ayuda y Preguntas Frecuentes | Buscorepuestos',
	description: 'Resuelve tus dudas sobre envíos, devoluciones, garantías y cómo funciona Buscorepuestos.',
}

export default function Page() {
	return <AyudaClient />
}