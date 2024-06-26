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
}) {
	return (
		<>
			{/* Next images */}

			<div
				className="max-w-[207px] max-h-[366px]
					flex flex-col justify-between pb-[23px] gap-4 shadow-md bg-custom-white rounded-[23px] hover:shadow-2xl 
					transition duration-300 ease-in-out"
			>
				<Image
					src="/card-preview.webp"
					alt="card image"
					width={205}
					height={140}
					priority
					className="rounded-t-[23px] w-[100%]"
				/>
				<div className="flex flex-col items-start px-[0.5vw] mobile:px-[1.5vw] w-full">
					<div className="mb-[37px]">
						<h4 className="text-base mobile:text-[14px] text-dark-grey font-bold">
							{props.title}
						</h4>
						<p className="text-sm">
							<span className="font-bold">Ref. </span>
							{props.reference}
						</p>
						<p className="text-sm">{props.description}</p>
					</div>
					<div className="mb-[13.5px] flex justify-center w-[100%]">
						<PriceView price={props.price} />
					</div>
					<div className='flex justify-center w-[100%]'>
						<Button type='primary'/>
					</div>
				</div>
			</div>
		</>
	)
}
