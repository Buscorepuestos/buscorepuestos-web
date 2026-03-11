import type { Metadata } from 'next'
import ContactoClient from './ContactoClient'

export const metadata: Metadata = {
    title: 'Contacta con Nosotros | Buscorepuestos',
    description: 'Ponte en contacto con el equipo de Buscorepuestos por WhatsApp, teléfono o correo. Estamos encantados de ayudarte a encontrar tu repuesto.',
}

export default function Page() {
    return <ContactoClient />
}