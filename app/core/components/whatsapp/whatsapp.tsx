'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const WhatsAppIcon: React.FC = () => {
	const pathname = usePathname()
	const [showBubble, setShowBubble] = useState(false)
	
	// Refs para la lógica de la tienda
	const hasShownStoreBubble = useRef(false)
	const storeTimerRef = useRef<NodeJS.Timeout | null>(null)

	const hideOnPaths = ['/verificacion-pago', '/pago-exitoso']

	// Reiniciar estados al cambiar de página
	useEffect(() => {
		setShowBubble(false)
		hasShownStoreBubble.current = false
		if (storeTimerRef.current) clearTimeout(storeTimerRef.current)
	}, [pathname])

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY

			// --- HOME ---
			if (pathname === '/') {
				if (scrollY > 50) {
					setShowBubble(true)
				} else {
					setShowBubble(false)
				}
			}

			// --- TIENDA ---
			else if (pathname.startsWith('/tienda')) {
				// Scroll > 500px (aprox 4-5 tarjetas de producto en desktop, o un par en móvil)
				if (scrollY > 500 && !hasShownStoreBubble.current) {
					hasShownStoreBubble.current = true
					setShowBubble(true)

					// Desaparecer a los 5 segundos
					storeTimerRef.current = setTimeout(() => {
						setShowBubble(false)
					}, 5000)
				}
			}
			
			// --- PRODUCTO ---
			// Se mantiene oculto visualmente (showBubble = false por defecto)
		}

		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
			if (storeTimerRef.current) clearTimeout(storeTimerRef.current)
		}
	}, [pathname])

	if (hideOnPaths.includes(pathname)) {
		return null
	}

	const getWhatsAppCopy = (): string => {
		if (pathname === '/') {
			return 'Buscamos la referencia exacta que necesitas'
		}
		if (pathname.startsWith('/tienda')) {
			return 'Evita devoluciones encontrando la referencia correcta'
		}
		// En producto retornamos vacío para que no se renderice el globo
		return ''
	}

	const copy = getWhatsAppCopy()

	const handleClick = () => {
		const phoneNumber = '34611537631'
		let message = ''

		// Mantenemos la funcionalidad de capturar URL en producto aunque no haya texto visual
		if (pathname.startsWith('/producto')) {
			const currentUrl = window.location.href
			message = `${currentUrl}\n\nHola, estoy viendo este producto en la tienda`
		}

		const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
			message
		)}`
		window.open(whatsappURL, '_blank')
	}

	return (
		<div
			style={{
				position: 'fixed',
				bottom: '20px',
				right: '20px',
				zIndex: 50,
			}}
			className="flex flex-col items-end gap-2 group pointer-events-none"
			onClick={handleClick}
		>
			{copy && (
				<div
					className={`
                        relative mb-1 transition-opacity duration-500 ease-in-out cursor-pointer pointer-events-auto
                        ${showBubble ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
					// Controlamos la opacidad directamente con inline style para asegurar que funciona en móvil y desktop
					style={{ opacity: showBubble ? 1 : 0 }} 
				>
					{/* 
                        CAMBIOS RESPONSIVE AQUÍ:
                        1. mobile:p-2 -> Reduce el relleno en móvil.
                        2. mobile:text-xs -> Reduce la fuente en móvil.
                        3. mobile:max-w-[160px] -> Fuerza a que el texto haga salto de línea si es muy largo.
                        4. leading-tight -> Mejora el espaciado entre líneas en textos largos.
                    */}
					<div className="bg-[#29A71A] p-3 mobile:p-2 rounded-xl shadow-lg">
						<p className="
                            text-sm mobile:text-xs 
                            text-center text-white font-semibold 
                            whitespace-pre-line 
                            mobile:max-w-[160px] leading-tight
                        ">
							{copy}
						</p>
					</div>
					<div
						className="absolute right-5 -bottom-2 w-0 h-0 
                            border-l-[8px] border-l-transparent
                            border-r-[8px] border-r-transparent
                            border-t-[8px] border-t-[#29A71A]"
					/>
				</div>
			)}

			<Image
				src="/whatsapp-icon.svg"
				alt="WhatsApp"
				width={60}
				height={60}
				className="drop-shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-110 cursor-pointer pointer-events-auto"
			/>
		</div>
	)
}

export default WhatsAppIcon