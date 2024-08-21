import Image from 'next/image'

export default function CardInfo(props: { title: string, image: string, href?: string, className?: string}) {
	return (
		<>
			<div
				className="w-[178px] max-h-[350px] mobile:w-[160px]
					flex flex-col items-center shadow-inter rounded-[24px] pt-3 pb-3 box-border
					hover:transition duration-300 ease-in-out bg-custom-white "
			>
					<Image
						src={props.image}
						alt="card image"
						width={0}
						height={0}
						priority
						className={props.className}
					/>
				<h4 className="whitespace-pre-wrap flex items-center text-[20px] text-dark-grey font-semibold text-center flex-grow pl-3 pr-3">
					{props.title}
				</h4>
			</div>
		</>
	)
}
