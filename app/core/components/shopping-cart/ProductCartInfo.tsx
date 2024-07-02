import Image from 'next/image'
import Trash from '../svg/trash'

export default function ProductCartInfo(prop: {
	image: string,
	title: string,
	brand: string,
	model: string,
	ref: string,
	price: number
}) {

	return (
		<article className={'flex w-[775px]'}>
				<Image
					src="/card-preview.webp"
					alt="card image"
					width={96}
					height={72}
					priority
					className="rounded-[10px]"
				/>
			<div className={'flex justify-between w-full'}>
				<div className={'ml-16'}>
					<h1 className={'text-title-3 font-semibold font-poppins'}>{prop.title}</h1>
					<h2 className={'text-sm font-poppins'}>{prop.brand} {prop.model}</h2>
					<p className={'text-xs'}>Ref. {prop.ref ? prop.ref : '-'}</p>
				</div>
				<div className={'flex flex-col content-center items-end'}>
					<Trash isFilled={true}/>
					<p className={'text-lg font-semibold text-primary-blue'}>{prop.price}€</p>
				</div>
			</div>
		</article>
	)
}
