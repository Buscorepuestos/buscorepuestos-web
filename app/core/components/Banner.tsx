import Image from 'next/image'
import React from 'react'

function getAligned(aligned: 'center' | 'left' | 'right' | undefined) {
	if (aligned === 'left') return 'flex-start'
	if (aligned === 'right') return 'flex-end'
	return 'center'
}

interface BannerStyle {
	height?: string
	justifyContent: string
	backgroundColor: string
}

export default function Banner(props: {
	height?: string
	color: string
	imgUrl?: string
	aligned?: 'center' | 'left' | 'right'
	children?: React.ReactNode
	position?: string
	extraCss?: string
}) {
	const styles: BannerStyle = {
		backgroundColor: props.color,
		height: props.height,
		justifyContent: getAligned(props.aligned),
	}

	return (
		<section
			className={`relative w-full mobile:w-[100vw] flex overflow-hidden ${props.position || ''} z-0 ${props.extraCss || ''}`}
			style={styles}
		>
			{/* Renderizamos la imagen con Next/Image optimizada */}
			{props.imgUrl && (
				<Image
					src={props.imgUrl}
					alt="Banner background"
					fill // Hace que la imagen ocupe todo el contenedor padre
					priority={true} // ESTA ES LA CLAVE: Forza la carga inmediata (LCP)
					className="object-cover object-center -z-10" // Se coloca detrás del contenido y cubre el área
					quality={85} // Opcional: Ajusta calidad para mejorar velocidad
				/>
			)}

			{/* El contenido debe estar por encima de la imagen */}
			{/* <div className="z-10 w-full flex h-full" style={{ justifyContent: getAligned(props.aligned) }}> */}
				{props.children}
			{/* </div> */}
		</section>
	)
}