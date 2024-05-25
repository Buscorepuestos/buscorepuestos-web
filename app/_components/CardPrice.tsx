import Image from 'next/image'
import Button from './Button'

function PriceView() {
	return <p className="text-xl text-primary-blue">10€</p>
}

export default function CardPrice() {
	return (
		<>
			{/* Next images */}
			<div className="flex gap-4">
				<div className="flex flex-col gap-2 rounded-lg shadow-lg">
					<div
						className="max-w-[207px] max-h-[366px]
           flex flex-col justify-between gap-4 pb-1"
					>
						<Image
							src="/card-preview.webp"
							alt="card image"
							width={205}
							height={140}
							priority
							className="rounded-t-lg"
						/>
						<div className="flex flex-col items-center w-full">
							<h4 className="text-lg">Parachoque delantero</h4>
							<p className="text-md">Ref e45678987654erfgy</p>
							<PriceView />
							<Button />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
