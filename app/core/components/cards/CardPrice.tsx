// import Image from 'next/image'
// import Button from '../Button'
// import Link from 'next/link'
// import Star from '../svg/star'
// import noDisponible from '../../../../public/nodisponible.png'
// import { useState } from 'react'

// function PriceView(props: { price: string }) {
// 	return (
// 		<p className="text-title-3 font-bold text-primary-blue">
// 			{props.price}€
// 		</p>
// 	)
// }

// const MAX_VALORATION = 5

// export default function CardPrice(props: {
// 	title: string
// 	reference: string
// 	description: string
// 	price: number
// 	image?: string
// 	handle?: () => void
// 	id?: string
// 	loading?: boolean
// 	location?: string
// }) {
// 	const { image, loading } = props

// 	const [imgSrc, setImgSrc] = useState(image || noDisponible.src);

// 	// 2. Función que se dispara si la imagen principal falla al cargar
// 	const handleImageError = () => {
// 		// Si hay un error, cambia la fuente a la imagen de fallback.
// 		setImgSrc(noDisponible.src);
// 	};
// 	return (
// 		<Link href={`/producto/${props.id}`}>
// 			<div
// 				className="max-w-[207px]
// 					flex flex-col justify-between pb-[23px] m-6 gap-4 shadow-md bg-custom-white rounded-[23px] hover:shadow-2xl
// 					transition duration-300 ease-in-out"
// 			>
// 				<Image
// 					unoptimized={true}
// 					src={imgSrc}
// 					alt="card image"
// 					width={205}
// 					height={140}
// 					className="rounded-t-[23px] w-[100%] h-[140px] mobile:h-[132px]"
// 					loading={'lazy'}
// 					onError={handleImageError}
// 				/>
// 				<div className="flex flex-col items-start px-[0.5vw] mobile:px-4 w-full">
// 					<div className="w-full h-auto mobile:h-auto">
// 						<h4 className="text-base text-dark-grey font-bold line-clamp-2 hover:underline">
// 							{props.title}
// 						</h4>
// 						<p className="text-sm">
// 							<span className="font-bold">Ref. </span>
// 							{props.reference}
// 						</p>
// 						<p className="text-sm mobile:text-[1.2rem] truncate overflow-ellipsis whitespace-nowrap max-w-[150px]">
// 							{props.description}
// 						</p>
// 					</div>
// 					<p className="mt-2 text-sm mobile:text-[2.9vw] font-tertiary-font text-primary-blue font-extrabold">
// 						Valoración del proveedor
// 					</p>
// 					<div className="flex w-full justify-center items-center flex-row gap-2 mobile:gap-3">
// 						<Image
// 							src="/ubication.svg"
// 							alt="ubication"
// 							width={22}
// 							height={22}
// 							className="xl:w-[0.7vw] md:w-[1.7vw] md:h-[1.7vw] sm:w-[1.5vw] sm:h-[1.5vw] mobile:w-[3.5vw] mobile:h-[3.5vw]"
// 						/>
// 						<span className="text-sm mobile:text-[2.9vw] font-tertiary-font text-secondary-blue font-semibold">
// 							{props.location || 'Sin ubicación'}
// 						</span>
// 					</div>
// 					<div className="flex w-[100%] justify-center flex-row gap-4 mobile:gap-3 mt-2 mb-2">
// 						{Array.from({ length: MAX_VALORATION }, (_, index) => (
// 							<Star
// 								key={index}
// 								isFilled={true}
// 								className="
// 									xl:w-[1vw] xl:h-[1vw]
// 									lg:w-[1.4vw] lg:h-[1.4vw]
// 									md:w-[1.4vw] md:h-[1.4vw]
// 									sm:w-[1.6vw] sm:h-[1.6vw]
// 									mobile:w-[3.3vw] mobile:h-[3.3vw]
// 								"
// 							/>
// 						))}
// 					</div>
// 					<div className="flex justify-center w-[100%] ">
// 						<PriceView
// 							price={props.price.toFixed(2).replace('.', ',')}
// 						/>
// 					</div>
// 					<div className="flex justify-center w-[100%] mt-4 mobile:mb-0">
// 						{loading ? (
// 							<div className="flex justify-center my-4">
// 								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
// 							</div>
// 						) : (
// 							<Button
// 								labelName="Ver producto"
// 								onClick={props.handle}
// 							/>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</Link>
// 	)
// }
import Image from 'next/image'
import Button from '../Button'
import Link from 'next/link'
import Star from '../svg/star'
import noDisponible from '../../../../public/nodisponible.png'
import { useState } from 'react'

// Componente simple para el icono de check verde
const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-5 h-5 text-green-600"
	>
		<path
			fillRule="evenodd"
			d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
			clipRule="evenodd"
		/>
	</svg>
)

function PriceView(props: { price: string }) {
	return (
		<p className="text-title-3 font-bold text-dark-grey text-2xl">
			{props.price}€
		</p>
	)
}

const MAX_VALORATION = 5

export default function CardPrice(props: {
	title: string
	reference: string
	description: string
	price: number
	image?: string
	handle?: () => void
	id?: string
	loading?: boolean
	location?: string
	shippingIncluded?: boolean // Nueva prop para activar el modo de la segunda imagen
}) {
	const { image, loading, shippingIncluded } = props

	const [imgSrc, setImgSrc] = useState(image || noDisponible.src)

	const handleImageError = () => {
		setImgSrc(noDisponible.src)
	}

	// Calculamos el precio de la cuota (dividiendo por 3)
	const installmentPrice = (props.price / 3).toFixed(2).replace('.', ',')

	return (
		<Link href={`/producto/${props.id}`}>
			<div
				className="max-w-[207px]
                    flex flex-col justify-between pb-[23px] m-6 gap-2 shadow-md bg-custom-white rounded-[23px] hover:shadow-2xl
                    transition duration-300 ease-in-out border border-gray-100"
			>
				<Image
					unoptimized={true}
					src={imgSrc}
					alt="card image"
					width={205}
					height={140}
					className="rounded-t-[23px] w-[100%] h-[140px] mobile:h-[132px]"
					loading={'lazy'}
					onError={handleImageError}
				/>
				<div className="flex flex-col items-start px-[0.5vw] mobile:px-4 w-full h-full justify-between">
					<div className="w-full h-auto mobile:h-auto mb-2">
						<h4 className="text-base text-dark-grey font-bold line-clamp-2 hover:underline uppercase">
							{props.title}
						</h4>
						<p className="text-sm text-gray-600">
							<span className="font-bold">Ref. </span>
							{props.reference}
						</p>
						<p className="text-sm text-gray-500 mobile:text-[1rem] truncate overflow-ellipsis whitespace-nowrap max-w-[150px]">
							{props.description}
						</p>
					</div>

					{/* Solo mostramos "Valoración del proveedor" si NO es envio incluido */}
					{!shippingIncluded && (
						<p className="mt-2 text-sm mobile:text-[2.9vw] font-tertiary-font text-primary-blue font-extrabold">
							Valoración del proveedor
						</p>
					)}

					<div className="flex w-full justify-center items-center flex-row gap-2 mobile:gap-3 my-1">
						{/* Si quieres mantener el icono de ubicación siempre, déjalo. Si en la versión 2 prefieres solo texto cyan, podrías añadir condicional */}
						<Image
							src="/ubication.svg"
							alt="ubication"
							width={22}
							height={22}
							className="xl:w-[0.7vw] md:w-[1.7vw] md:h-[1.7vw] sm:w-[1.5vw] sm:h-[1.5vw] mobile:w-[3.5vw] mobile:h-[3.5vw]"
						/>
						<span
							className={`text-sm mobile:text-[2.9vw] font-tertiary-font font-semibold uppercase ${
								shippingIncluded ? 'text-[#00B4D8]' : 'text-secondary-blue'
							}`}
						>
							{props.location || 'Sin ubicación'}
						</span>
					</div>

					<div className="flex w-[100%] justify-center flex-row gap-4 mobile:gap-3 mb-2">
						{Array.from({ length: MAX_VALORATION }, (_, index) => (
							<Star
								key={index}
								isFilled={true}
								className="
                                    text-blue-600
                                    xl:w-[1vw] xl:h-[1vw]
                                    lg:w-[1.4vw] lg:h-[1.4vw]
                                    md:w-[1.4vw] md:h-[1.4vw]
                                    sm:w-[1.6vw] sm:h-[1.6vw]
                                    mobile:w-[3.3vw] mobile:h-[3.3vw]
                                "
							/>
						))}
					</div>

					<div className="flex flex-col items-center w-[100%]">
						<PriceView price={props.price.toFixed(2).replace('.', ',')} />

						{shippingIncluded && (
							<div className="flex items-center gap-1 mt-1 mb-2">
								<CheckIcon />
								<span className="text-green-600 font-semibold text-sm">
									Envío incluido
								</span>
							</div>
						)}
					</div>

					{/* NUEVO FEATURE: Métodos de pago (Caja de plazos) */}
					{shippingIncluded && (
						<div className="w-full border border-gray-300 rounded-lg p-2 mb-3 mt-1 bg-white">
							<div className="flex items-center mb-1 justify-center text-center">
								<div className="bg-[#333] text-white text-[13px] font-bold px-1.5 py-0.5 rounded-full flex items-center">
									3x
								</div>
								<p className="text-[13px] font-tertiary-font leading-tight text-gray-700 ">
									Paga en 3 plazos de{' '}
									<span className="font-bold">{installmentPrice}€</span>
								</p>
							</div>
							<div className="flex gap-2 justify-center items-center mt-1">
								{/* Placeholder para Klarna (o usa <Image /> si tienes el logo) */}
								{/* <span className="bg-pink-100 text-pink-600 font-bold text-[10px] px-1 rounded">
									Klarna.
								</span> */}
								<Image
									src="/klarnap.png"
									alt="Klarna"
									width={40}
									height={20}
								/>
								{/* Placeholder para PayPal (o usa <Image /> si tienes el logo) */}
								{/* <span className="text-[#003087] font-bold italic text-[10px]">
									PayPal
								</span> */}
								<Image
									src="/paypalp.svg"
									alt="PayPal"
									width={50}
									height={20}
								/>
							</div>
						</div>
					)}

					<div className="flex justify-center w-[100%] mt-2 mobile:mb-0">
						{loading ? (
							<div className="flex justify-center my-4">
								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
							</div>
						) : (
							<Button labelName="Ver producto" onClick={props.handle} />
						)}
					</div>
				</div>
			</div>
		</Link>
	)
}