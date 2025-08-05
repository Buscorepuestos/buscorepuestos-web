'use client'
import React, { useState, useEffect } from 'react' // 1. Importamos useState y useEffect
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const WhatsAppIcon: React.FC = () => {
	const pathname = usePathname()
	// 2. Estado para saber si el usuario ha hecho scroll
	const [isScrolled, setIsScrolled] = useState(false)

	const hideOnPaths = ['/verificacion-pago', '/pago-exitoso']

	// 3. useEffect para detectar el evento de scroll
	useEffect(() => {
		const handleScroll = () => {
			// Si el usuario ha bajado más de 50px, cambiamos el estado
			if (window.scrollY > 50) {
				setIsScrolled(true)
			} else {
				// Opcional: si quieres que se vuelva a ocultar al subir, mantén esta línea.
				// Si quieres que se quede visible una vez aparece, puedes eliminar el 'else'.
				setIsScrolled(false) 
			}
		}

		// Añadimos el listener cuando el componente se monta
		window.addEventListener('scroll', handleScroll)

		// Limpiamos el listener cuando el componente se desmonta para evitar fugas de memoria
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, []) // El array vacío [] asegura que el efecto se ejecute solo una vez

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
		<div
			style={{
				position: 'fixed',
				bottom: '20px',
				right: '20px',
				zIndex: 50,
			}}
			className="flex flex-col items-end gap-2 cursor-pointer group"
			onClick={handleClick}
		>
			{copy && (
				// 4. Aplicamos clases condicionales al contenedor de la burbuja
				<div
					className={`
            relative mb-1 transition-opacity duration-500 ease-in-out
            // Lógica para mobile: opacidad depende del scroll. Se oculta también a los clics.
            ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            // Lógica para desktop (md y superior): siempre visible.
            md:opacity-100 md:pointer-events-auto
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
				className="drop-shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
			/>
		</div>
	)
}

export default WhatsAppIcon
