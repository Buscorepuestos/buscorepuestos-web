'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'

const FacebookPixel = () => {
    const [loaded, setLoaded] = useState(false)
    const pathname = usePathname()

    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

    useEffect(() => {
        if (!pixelId) {
            console.warn("Facebook Pixel ID is not set in environment variables.");
            return;
        }
        // Asegúrate de que el script base se cargue solo una vez
        if (!loaded) {
            setLoaded(true)
        }
    }, [])

    // Rastrear cambios de ruta para enviar eventos de "Page View"
    useEffect(() => {
        if (!loaded || !pixelId) {
            return
        }
        
        // @ts-ignore
        window.fbq('track', 'PageView')
        
    }, [pathname, loaded, pixelId])

    if (!pixelId) {
        return null; // No renderizar nada si no hay ID
    }

    return (
        <>
            <Script
                id="fb-pixel"
                strategy="afterInteractive"
                onLoad={() => setLoaded(true)}
            >
                {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${pixelId}');
                    fbq('track', 'PageView');
                `}
            </Script>
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                />
            </noscript>
        </>
    )
}

export default FacebookPixel