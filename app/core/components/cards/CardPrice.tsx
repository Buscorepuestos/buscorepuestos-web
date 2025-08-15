import Image from 'next/image'
import Button from '../Button'
import Link from 'next/link'
import Star from '../svg/star'
import noDisponible from '../../../../public/nodisponible.png'
import { useState } from 'react'

function PriceView(props: { price: string }) {
	return (
		<p className="text-title-3 font-bold text-primary-blue">
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
}) {
	const { image, loading } = props

	const [imgSrc, setImgSrc] = useState(image || noDisponible.src);

	// 2. Función que se dispara si la imagen principal falla al cargar
	const handleImageError = () => {
		// Si hay un error, cambia la fuente a la imagen de fallback.
		setImgSrc(noDisponible.src);
	};
	return (
		<>
			<div
				className="max-w-[207px]
					flex flex-col justify-between pb-[23px] m-6 gap-4 shadow-md bg-custom-white rounded-[23px] hover:shadow-2xl
					transition duration-300 ease-in-out"
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
				<div className="flex flex-col items-start px-[0.5vw] mobile:px-4 w-full">
					<div className="w-full h-auto mobile:h-auto">
						<Link href={`/producto/${props.id}`}>
							<h4 className="text-base text-dark-grey font-bold line-clamp-2 hover:underline">
								{props.title}
							</h4>
						</Link>
						<p className="text-sm">
							<span className="font-bold">Ref. </span>
							{props.reference}
						</p>
						<p className="text-sm mobile:text-[1.2rem] truncate overflow-ellipsis whitespace-nowrap max-w-[150px]">
							{props.description}
						</p>
					</div>
					<p className="mt-2 text-sm mobile:text-[2.9vw] font-tertiary-font text-primary-blue font-extrabold">
						Valoración del proveedor
					</p>
					<div className="flex w-full justify-center items-center flex-row gap-2 mobile:gap-3">
						<Image
							src="/ubication.svg"
							alt="ubication"
							width={22}
							height={22}
							className="xl:w-[0.7vw] md:w-[1.7vw] md:h-[1.7vw] sm:w-[1.5vw] sm:h-[1.5vw] mobile:w-[3.5vw] mobile:h-[3.5vw]"
						/>
						<span className="text-sm mobile:text-[2.9vw] font-tertiary-font text-secondary-blue font-semibold">
							{props.location || 'Sin ubicación'}
						</span>
					</div>
					<div className="flex w-[100%] justify-center flex-row gap-4 mobile:gap-3 mt-2 mb-2">
						{Array.from({ length: MAX_VALORATION }, (_, index) => (
							<Star
								key={index}
								isFilled={true}
								className="
									xl:w-[1vw] xl:h-[1vw]
									lg:w-[1.4vw] lg:h-[1.4vw]
									md:w-[1.4vw] md:h-[1.4vw]
									sm:w-[1.6vw] sm:h-[1.6vw]
									mobile:w-[3.3vw] mobile:h-[3.3vw]
								"
							/>
						))}
					</div>
					<div className="flex justify-center w-[100%] ">
						<PriceView
							price={props.price.toFixed(2).replace('.', ',')}
						/>
					</div>
					<div className="flex justify-center w-[100%] mt-4 mobile:mb-0">
						{loading ? (
							<div className="flex justify-center my-4">
								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
							</div>
						) : (
							<Button
								labelName="Ver producto"
								onClick={props.handle}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
