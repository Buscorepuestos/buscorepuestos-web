function getAligned(aligned: 'center' | 'left' | 'right' | undefined) {
	if (aligned === 'left') return 'flex-start'
	if (aligned === 'right') return 'flex-end'
	return 'justify-center'
}

export default function BannerImage(props: {
	imgName: string
	height: string
	aligned?: 'center' | 'left' | 'right'
	children?: React.ReactNode
}) {
	return (
		<>
			<section
				className={`bg-${props.imgName} h-[${
					props.height
				}] w-full bg-no-repeat 
				bg-cover bg-center flex ${getAligned(props.aligned)} items-center`}
			>
				{props.children}
			</section>
		</>
	)
}

//<section
//className={`bg-${props.imgName} h-[${props.height}] w-auto
//border-2 border-black bg-no-repeat bg-cover bg-center
//`}
//>
