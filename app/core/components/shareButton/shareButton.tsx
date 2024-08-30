'use client'

import React from 'react'
import Image from 'next/image'

interface ShareButtonProps {
	imageSrc: string
	productName: string
	title: string
}

const ShareButton: React.FC<ShareButtonProps> = ({
	imageSrc,
	productName,
	title,
}) => {

	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: productName,
					text: `Mira este producto: ${title}\nMás información en: ${window.location.href}`,
					url: window.location.href,
				})
				.catch((error) => console.error('Error al compartir:', error))
		} else {
			navigator.clipboard.writeText(`${title} - ${window.location.href}`)
			alert('¡Enlace copiado al portapapeles!')
		}
	}

	return (
		<Image
			src={imageSrc}
			alt="compartir"
			width={34}
			height={34}
			className="cursor-pointer"
			onClick={handleShare}
		/>
	)
}

export default ShareButton
