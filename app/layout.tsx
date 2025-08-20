import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import StoreProvider from './redux/provider'
import WhatsAppIcon from './core/components/whatsapp/whatsapp'
import './globals.css'

import { Header } from '@/app/core/components/global/header'
import { Footer } from '@/app/core/components/global/footer'
import Script from 'next/script'
import FacebookPixel from './core/components/facebookPixel/FacebookPixel'
import CookieConsentModalWrapper from './core/components/cookieConsentModal/CookieConsentModalWrapper'

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
			<head>
				{/* Google Tag Manager Script */}
				<Script
					id="gtm-script"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
				})(window,document,'script','dataLayer','GTM-TPCVDD8');`,
					}}
				/>
			</head>
			<body
				className={`${bebasNeue.variable} ${workSans.variable} ${popins.variable} flex flex-col justify-center min-h-screen`}
			>
				{/* Google Tag Manager noscript (para casos donde JS está deshabilitado) */}
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-TPCVDD8"
						height="0"
						width="0"
						style={{ display: 'none', visibility: 'hidden' }}
					></iframe>
				</noscript>

				<link rel="icon" href="/buscorepuestos.svg" />
				<StoreProvider>
					<Analytics />
					<Header />
					<main className="flex-1">{children}</main>
					<WhatsAppIcon />
					<Footer />
					<SpeedInsights />

					{/* Envoltorio del modal */}
					<CookieConsentModalWrapper />
					<FacebookPixel />
				</StoreProvider>
			</body>
		</html>
	)
}

