import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import StoreProvider from './redux/provider'
import WhatsAppIcon from './core/components/whatsapp/whatsapp'
import './globals.css'

import { Header } from '@/app/core/components/global/header'
import { Footer } from '@/app/core/components/global/footer'
import FacebookPixel from './core/components/facebookPixel/FacebookPixel'
import CookieConsentModalWrapper from './core/components/cookieConsentModal/CookieConsentModalWrapper'
import ConsentGatedGoogleTags from './core/components/cookieConsentModal/ConsentGatedGoogleTags'

const workSans = localFont({
	src: './fonts/WorkSans_wght.ttf',
	variable: '--font-work-sans',
	weight: '100 900',
	display: 'swap',
	preload: true,
})

// Bebas Neue suele ser solo Regular (400)
const bebasNeue = localFont({
	src: './fonts/BebasNeue-Regular.ttf',
	variable: '--font-bebas-neue',
	weight: '400',
	display: 'swap',
	preload: true,
})

// Poppins Regular es peso 400
const popins = localFont({
	src: './fonts/Poppins-Regular.ttf',
	variable: '--font-family-popins',
	weight: '400',
	display: 'swap',
	preload: true,
})

export const metadata: Metadata = {
	title: 'BUSCOREPUESTOS - Tienda Online de Repuestos de Coche',
	description: 'Ponemos a tu alcance la mayor variedad de piezas de coche recuperadas, reconstruidas y nuevas. Busca repuestos en cientos de tiendas y compara precios. Envío incluido.',
	openGraph: {
		title: 'BUSCOREPUESTOS - Tienda Online de Repuestos de Coche',
		description: 'Tienda online de recambios con gran variedad de piezas de coche recuperada, reconstruidas y nuevas',
		url: 'https://www.buscorepuestos.com',
		siteName: 'Buscorepuestos',
		type: 'website',
	},
	metadataBase: new URL('https://www.buscorepuestos.com'),
	robots: { index: true, follow: true },
	icons: {
		icon: '/icon.svg',
		shortcut: '/buscorepuestos.svg',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="es">
			<head />
			<body
				className={`${bebasNeue.variable} ${workSans.variable} ${popins.variable} flex flex-col justify-center min-h-screen font-primary-font`}
			>

				<StoreProvider>
					<Analytics />
					<Header />
					<main className="flex-1">{children}</main>
					<WhatsAppIcon />
					<Footer />
					<SpeedInsights />

					{/* Envoltorio del modal */}
					<CookieConsentModalWrapper />
					<ConsentGatedGoogleTags />
					<FacebookPixel />
				</StoreProvider>
			</body>
		</html>
	)
}

