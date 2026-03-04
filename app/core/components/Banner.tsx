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
	overflowX: 'hidden'
	overflowY: 'visible'
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
		overflowX: 'hidden',   // corta la imagen horizontalmente
		overflowY: 'visible',  // deja salir el dropdown hacia abajo
	}

	return (
		<section
			className={`relative w-full mobile:w-[100vw] flex overflow-hidden ${props.position || ''} z-0 ${props.extraCss || ''}`}
			style={styles}
		>
			{props.imgUrl && (
				<Image
					src={props.imgUrl}
					alt="Banner background"
					fill
					priority={true}
					className="object-cover object-center"
					quality={85}
					style={{ zIndex: 0 }}
				/>
			)}
			{/* Sin z-index, sin wrapper extra — el contenido va directo */}
			<div className="w-full flex" style={{ justifyContent: getAligned(props.aligned), position: 'relative', zIndex: 1 }}>
				{props.children}
			</div>
		</section>
	)
}
