'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const WhatsAppIcon: React.FC = () => {
	const pathname = usePathname()
	const [isScrolled, setIsScrolled] = useState(false)

	const hideOnPaths = ['/verificacion-pago', '/pago-exitoso']

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true)
			} else {
				setIsScrolled(false) 
			}
		}
		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	if (hideOnPaths.includes(pathname)) {
		return null
	}

	const getWhatsAppCopy = (): string => {
		if (pathname === '/') {
			return 'Buscamos la referencia exacta que necesitas'
		}
		if (pathname.startsWith('/producto')) {
			return 'Verifica si este repuesto es válido\npara tu coche'
		}
		return ''
	}

	const copy = getWhatsAppCopy()

	const handleClick = () => {
		const phoneNumber = '34611537631'
		let message = ''

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
        // El onClick se mantiene en el padre para gestionar el clic de ambos hijos.
		<div
			style={{
				position: 'fixed',
				bottom: '20px',
				right: '20px',
				zIndex: 50,
			}}
            // <-- 1. El contenedor principal ignora los clics en su espacio vacío.
			className="flex flex-col items-end gap-2 group pointer-events-none" 
			onClick={handleClick}
		>
			{copy && (
				<div
                    // <-- 2. La burbuja de texto VUELVE a ser clickable.
					className={`
                        relative mb-1 transition-opacity duration-500 ease-in-out cursor-pointer pointer-events-auto
                        ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                        md:opacity-100
                    `}
				>
					{/* El cuadro de texto */}
					<div className="bg-[#29A71A] p-3 rounded-xl shadow-lg">
						<p className="text-sm text-center text-white font-semibold whitespace-pre-line">
							{copy}
						</p>
					</div>
					{/* El puntero/flecha */}
					<div
						className="absolute right-5 -bottom-2 w-0 h-0 
                            border-l-[8px] border-l-transparent
                            border-r-[8px] border-r-transparent
                            border-t-[8px] border-t-[#29A71A]"
					/>
				</div>
			)}

			{/* El icono de WhatsApp */}
			<Image
				src="/whatsapp-icon.svg"
				alt="WhatsApp"
				width={60}
				height={60}
                // <-- 3. El icono VUELVE a ser clickable y mantiene el cursor.
				className="drop-shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-110 cursor-pointer pointer-events-auto"
			/>
		</div>
	)
}

export default WhatsAppIcon
