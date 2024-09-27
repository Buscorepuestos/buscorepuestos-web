import Image from 'next/image'
import Button from '../Button'
import Link from 'next/link'

function PriceView(props: { price: string }) {
	return <p className="text-title-3 font-bold text-primary-blue">{props.price}€</p>
}

export default function CardPrice(props: {
	title: string
	reference: string
	description: string
	price: number
	image?: string
	handleBuy?: () => void,
	id?: string
}) {
	const { image } = props;
	return (
		<>
			<div
				className="max-w-[207px] max-h-[366px] mobile:max-h-[345px]
					flex flex-col justify-between pb-[23px] m-6 gap-4 shadow-md bg-custom-white rounded-[23px] hover:shadow-2xl
					transition duration-300 ease-in-out"
			>
				<Image
					unoptimized={true}
					src={image ? image : '/card-preview.webp'}
					alt="card image"
					width={205}
					height={140}
					className="rounded-t-[23px] w-[100%] h-[140px] mobile:h-[132px]"
					loading={'lazy'}
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
						<p className="text-sm mobile:text-[1.2rem]">{props.description}</p>
					</div>
					<div className="flex justify-center w-[100%] ">
						<PriceView price={props.price.toFixed(2).replace('.', ',')} />
					</div>
					<div className='flex justify-center w-[100%] mb-6 mobile:mb-0'>
						<Button 
							labelName={'Comprar'}
							onClick={props.handleBuy}
							xpadding='px-16'
						/>
					</div>
				</div>
			</div>
		</>
	)
}
