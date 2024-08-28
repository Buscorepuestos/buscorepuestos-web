import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import StoreProvider from './redux/provider'
import WhatsAppIcon from './core/components/whatsapp/whatsapp'
import './globals.css'

import { Header } from '@/app/core/components/global/header'
import { Footer } from '@/app/core/components/global/footer'

const workSans = localFont({
	src: './fonts/WorkSans_wght.ttf',
	variable: '--font-work-sans',
})

const bebasNeue = localFont({
	src: './fonts/BebasNeue-Regular.ttf',
	variable: '--font-bebas-neue',
})

const popins = localFont({
	src: './fonts/Poppins-Regular.ttf',
	variable: '--font-family-popins',
})

export const metadata: Metadata = {
	title: 'BUSCOREPUESTOS - tienda online de recambios con gran variedad de piezas de coche recuperada, reconstruidas y nuevas',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${bebasNeue.variable} ${workSans.variable} ${popins.variable} flex flex-col justify-center min-h-screen`}
			>
				<link rel="icon" href="/buscorepuestos.svg" />
				<StoreProvider>
					<Analytics/>
					<Header />
					<main className="flex-1">
						{children}
					</main>
					<WhatsAppIcon />
					<Footer />
					<SpeedInsights/>
				</StoreProvider>
			</body>
		</html>
	)
}
