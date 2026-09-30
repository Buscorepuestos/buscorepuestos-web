import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from '../Button'
import Star from '../svg/star'
import noDisponible from '../../../../public/nodisponible.png'

const MAX_VALORATION = 5

const CheckIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-600" aria-hidden="true">
		<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
	</svg>
)

export interface CardPriceProps {
	title: string
	reference: string
	description?: string
	price: number
	image?: string
	handle?: () => void
	id?: string
	loading?: boolean
	location?: string
	condition?: string
	availability?: string
	shippingIncluded?: boolean
	hideRating?: boolean
}

export default function CardPrice(props: CardPriceProps) {
	const [imgSrc, setImgSrc] = useState(props.image || noDisponible.src)

	useEffect(() => {
		setImgSrc(props.image || noDisponible.src)
	}, [props.image])

	const installmentPrice = (props.price / 4).toFixed(2).replace('.', ',')
	const isAvailable = props.availability === 'Disponible'

	return (
		<Link href={props.id ? `/producto/${props.id}` : '#'} className="block h-full" aria-label={`Ver ${props.title}`}>
			<article className="max-w-[207px] min-h-full flex flex-col justify-between pb-[23px] m-6 gap-2 shadow-md bg-custom-white rounded-[23px] hover:shadow-2xl transition duration-300 ease-in-out border border-gray-100">
				<Image
					unoptimized
					src={imgSrc}
					alt={`Fotografía de ${props.title}`}
					width={205}
					height={140}
					className="rounded-t-[23px] w-full h-[140px] mobile:h-[132px] object-cover object-center"
					loading="lazy"
					onError={() => setImgSrc(noDisponible.src)}
				/>

				<div className="flex flex-1 flex-col items-start px-[0.5vw] mobile:px-4 w-full h-full justify-between">
					<div className="w-full h-auto mb-2">
						<h4 className="text-base text-dark-grey font-bold line-clamp-2 hover:underline uppercase h-[3rem] leading-6">
							{props.title}
						</h4>
						<p className="text-sm text-gray-600 truncate w-full">
							<span className="font-bold">Ref. </span>
							{props.reference || 'No disponible'}
						</p>
						{props.description && (
							<p className="text-sm text-gray-500 truncate overflow-ellipsis whitespace-nowrap max-w-[175px]" title={props.description}>
								<span className="sr-only">Vehículo compatible: </span>
								{props.description}
							</p>
						)}

						{(props.condition || props.availability) && (
							<div className="flex flex-wrap gap-1.5 mt-2 text-[11px] font-semibold">
								{props.condition && <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">{props.condition}</span>}
							{props.availability && (
								<span className={`rounded-full px-2 py-0.5 ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
									{props.availability}
								</span>
							)}
							</div>
						)}
						</div>

					{props.location && (
						<div className="flex w-full justify-center items-center gap-2 my-1 text-secondary-blue font-semibold uppercase">
							<Image src="/ubication.svg" alt="" aria-hidden="true" width={22} height={22} />
							<span>{props.location}</span>
						</div>
					)}

					{!props.hideRating && (
						<div className="flex w-full justify-center flex-row gap-1 mobile:gap-2 mb-2">
							{Array.from({ length: MAX_VALORATION }, (_, index) => (
								<Star key={index} isFilled className="text-blue-600 xl:w-[0.8vw] xl:h-[0.8vw] lg:w-[1.2vw] lg:h-[1.2vw] md:w-[1.2vw] md:h-[1.2vw] sm:w-[1.4vw] sm:h-[1.4vw] mobile:w-[3.1vw] mobile:h-[3.1vw]" />
							))}
						</div>
					)}

					<div className="flex flex-col items-center w-full">
						<p className="text-[3rem] font-bold text-dark-grey text-2xl">
							{props.price.toFixed(2).replace('.', ',')}€
						</p>

						{props.shippingIncluded && (
							<div className="flex items-center gap-1 mt-1 mb-2">
								<CheckIcon />
								<span className="text-green-600 font-semibold text-sm mobile:text-[3vw]">Envío incluido</span>
								<Image src="/truck-green.png" alt="" aria-hidden="true" width={30} height={30} className="mobile:w-[7vw] mobile:h-[7vw]" />
							</div>
						)}
					</div>

					{props.shippingIncluded && (
						<div className="w-full p-2 mb-3 mt-1 bg-white text-center">
							<p className="text-[13px] mobile:text-[3vw] text-gray-700">
								<span className="bg-[#333] text-white font-bold px-1.5 py-0.5 rounded-full mr-1">4x</span>
								Paga en 4 plazos de <span className="font-bold">{installmentPrice}€</span>
							</p>
							<div className="flex w-full gap-1.5 justify-center items-center mt-2 overflow-hidden">
								<Image src="/klarnap.png" alt="Klarna" width={40} height={20} className="h-auto max-w-[28%] object-contain" />
								<Image src="/PayPalp.svg" alt="PayPal" width={50} height={20} className="h-auto max-w-[32%] object-contain" />
								<Image src="/scalapay-png.png" alt="Scalapay" width={60} height={30} className="h-auto max-w-[36%] object-contain" />
							</div>
						</div>
					)}

					<div className="flex justify-center w-full mt-2 mobile:mb-0">
						{props.loading ? (
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin" aria-label="Abriendo producto" />
						) : (
							<Button labelName="Ver producto" onClick={props.handle} />
						)}
					</div>
				</div>
			</article>
		</Link>
	)
}
