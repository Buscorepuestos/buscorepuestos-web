'use client'
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'

const WhatsAppIcon: React.FC = () => {
	const pathname = usePathname()
	const hideOnPaths = ['/verificacion-pago', '/pago-exitoso']

	const { searchResults, loading } = useAppSelector(
		(state: RootState) => state.productSearch
	)

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
		let message = '' // Mensaje por defecto (vacío)

		// Lógica para el mensaje predeterminado en la página de producto
		if (pathname.startsWith('/producto')) {
			const currentUrl = window.location.href
			message = `Hola, me gustaría verificar si este repuesto es compatible con mi coche.\n\nEste es el repuesto que estoy viendo:\n${currentUrl}\n\nMi matrícula es: `
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
			{/* Contenedor de la burbuja de texto */}
			{copy && (
				<div className="relative mb-1">
					{/* El cuadro de texto con el color verde específico */}
					<div className="bg-[#29A71A] p-3 rounded-xl shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105">
						<p className="text-sm text-center text-white font-semibold whitespace-pre-line">
							{copy}
						</p>
					</div>
					{/* El puntero/flecha con el nuevo color */}
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
