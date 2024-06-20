import Image from 'next/image'

export default function SearchBar(props: {
	height: string
	width: string
	borderColor: string
	borderWidth: string
}) {
	return (
		<section
			className={`${props.width} relative flex items-center bg-custom-white
				rounded-[34px] pl-8 self-center`}
			style={{
				height: props.height,
				borderColor: props.borderColor,
				borderWidth: props.borderWidth
			}}
		>
			<Image
				src="/search-icon.svg"
				alt="icon"
				width={30}
				height={30}
				priority
				className="mr-[20px]"
			/>
			<input
				className="text-title-4 flex-grow bg-transparent outline-none font-semibold"
				type="text"
				placeholder="escribe lo que necesitas"
				style={{
					color: '#A9A9A9'
				}}
			/>
		</section>
	)
}
