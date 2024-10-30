'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const WhatsAppIcon: React.FC = () => {
	const [isHovered, setIsHovered] = useState(false)
	const pathname = usePathname()
	const hideOnPaths = ['/verificacion-pago'] // Agrega aquí otras rutas en las que deseas ocultar el ícono

	// Verifica si la ruta actual está en la lista de rutas a ocultar
	if (hideOnPaths.includes(pathname)) {
		return null
	}

	const handleClick = () => {
		const phoneNumber = '34611537631' // Número de teléfono de WhatsApp
		const message = '' // Mensaje predeterminado
		const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
		window.open(whatsappURL, '_blank')
	}

	return (
		<div
			style={{
				position: 'fixed',
				bottom: '20px',
				right: '20px',
				zIndex: 5,
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={handleClick}
		>
			<Image
				src="/whatsapp-icon.svg"
				alt="WhatsApp"
				style={{
					width: '60px',
					height: '60px',
					cursor: 'pointer',
				}}
				width={60}
				height={60}
			/>
			{isHovered && (
				<div
					style={{
						position: 'absolute',
						bottom: '70px',
						right: '0',
						backgroundColor: 'rgba(0, 0, 0, 0.7)',
						color: 'white',
						padding: '5px 10px',
						borderRadius: '5px',
						whiteSpace: 'nowrap',
					}}
				>
					¡Envíanos cualquier consulta!
				</div>
			)}
		</div>
	)
}

export default WhatsAppIcon
