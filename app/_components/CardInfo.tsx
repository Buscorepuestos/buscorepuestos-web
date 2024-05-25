import Image from 'next/image'

export default function CardInfo(props: { title: string }) {
	return (
		<>
			<div
				className="w-[178px] max-h-[174px]
					 flex flex-col items-center shadow-inter rounded-2xl pt-3 pb-3 box-border
					 hover:transition duration-300 ease-in-out bg-custom-white "
			>
				<Image
					src="/card-no-price.svg"
					alt="card image"
					width={0}
					height={0}
					priority
					className="rounded-lg max-w-[136px] h-[136px] w-full object-fill 
							sm:max-w-[120px] sm:h-[120px] md:max-w-[100px] md:h-[100px]"
				/>
				<h4 className=" flex items-center text-base text-dark-grey font-bold text-center flex-grow pl-3 pr-3">
					{props.title}
				</h4>
			</div>
		</>
	)
}
