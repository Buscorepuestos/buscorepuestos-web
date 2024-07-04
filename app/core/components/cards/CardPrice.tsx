import Image from 'next/image'
import Button from '../Button'

function PriceView(props: { price: number }) {
	return <p className="text-title-3 font-bold text-primary-blue">{props.price}€</p>
}

export default function CardPrice(props: {
	title: string
	reference: string
	description: string
	price: number
	image: string
}) {
	return (
		<>
			{/* Next images */}

			<div
				className="max-w-[207px] max-h-[366px] mobile:max-h-[345px]
					flex flex-col justify-between pb-[23px] m-6 gap-4 shadow-md bg-custom-white rounded-[23px] hover:shadow-2xl
					transition duration-300 ease-in-out"
			>
				<Image
					src={props.image}
					alt="card image"
					width={205}
					height={140}
					priority
					className="rounded-t-[23px] w-[100%] h-[140px] mobile:h-[132px]"
				/>
				<div className="flex flex-col items-start px-[0.5vw] mobile:px-4 w-full">
					<div className="w-full h-[112px] mobile:h-[120px]">
						<h4 className="text-base text-dark-grey font-bold line-clamp-2">
							{props.title}
						</h4>
						<p className="text-sm">
							<span className="font-bold">Ref. </span>
							{props.reference}
						</p>
						<p className="text-sm">{props.description}</p>
					</div>
					<div className="flex justify-center w-[100%]">
						<PriceView price={props.price} />
					</div>
					<div className='flex justify-center w-[100%] mb-6'>
						<Button labelName={'Comprar'}/>
					</div>
				</div>
			</div>
		</>
	)
}
