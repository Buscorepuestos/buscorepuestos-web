import Image from 'next/image'
import Trash from '../svg/trash'

export default function ProductCartInfo(props: {
	image: string,
	title: string,
	brand: string,
	model: string,
	ref: string,
	price: number,
	isMobile: boolean
}) {

	const {isMobile = false} = props;

	const parsePrice = (price: number) => {
		return price.toString().replace('.', ',');
	}
	return (
		<article className={'flex w-[775px] tablet:w-[500px] mobile:w-[320px]'}>
				<Image
					src="/card-preview.webp"
					alt={props.title}
					width={isMobile ? 84 : 96}
					height={72}
					priority
					className="rounded-[10px] h-max"
				/>
			<div className={'flex justify-between w-full'}>
				<div className={'ml-16 tablet:ml-8 mobile:ml-4 w-[40vw] mobile:w-full'}>
					<h1 className={'text-title-3 tablet:text-title-4 mobile:text-base font-semibold font-poppins line-clamp-1 mobile:line-clamp-2'}>{props.title}</h1>
					<h2 className={'text-sm tablet:text-xs mobile:text-xs font-poppins'}>{props.brand.toUpperCase()} {props.model.toUpperCase()}</h2>
					<p className={'text-sm mobile:text-xs'}>Ref. {props.ref}</p>
				</div>
				<div className={'flex flex-col items-end tablet:justify-between mobile:justify-between'}>
					<Trash isFilled={true} width={15} height={16}/>
					<p className={'text-lg tablet:text-title-3 mobile:text-title-4 font-semibold text-primary-blue-2'}>{parsePrice(props.price)}€</p>
				</div>
			</div>
		</article>
	)
}
