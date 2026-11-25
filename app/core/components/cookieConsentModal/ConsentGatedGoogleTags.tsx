'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { CONSENT_CHANGED_EVENT, CONSENT_STORAGE_KEY } from './CookieConsentModalWrapper'

export default function ConsentGatedGoogleTags() {
	const [hasConsent, setHasConsent] = useState(false)

	useEffect(() => {
		const updateConsent = () => setHasConsent(localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted')
		updateConsent()
		window.addEventListener(CONSENT_CHANGED_EVENT, updateConsent)
		return () => window.removeEventListener(CONSENT_CHANGED_EVENT, updateConsent)
	}, [])

	if (!hasConsent) return null

	return <>
		<Script id="gtm-script" strategy="afterInteractive">
			{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TPCVDD8');`}
		</Script>
		<Script src="https://www.googletagmanager.com/gtag/js?id=AW-16784645628" strategy="afterInteractive" />
		<Script id="google-ads-tag" strategy="afterInteractive">
			{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','AW-16784645628');`}
		</Script>
	</>
}
