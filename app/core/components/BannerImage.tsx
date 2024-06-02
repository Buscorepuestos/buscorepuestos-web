function getAligned(aligned: 'center' | 'left' | 'right' | undefined) {
	if (aligned === 'left') return 'flex-start'
	if (aligned === 'right') return 'flex-end'
	return 'justify-center'
}

export default function BannerImage(props: {
	imgUrl: string
	height: string
	aligned?: 'center' | 'left' | 'right'
	children?: React.ReactNode
}) {
	return (
		<section
			className={`w-full bg-no-repeat bg-cover bg-center flex 
				${getAligned(props.aligned)} items-center`}
			style={{
				backgroundImage: `url(${props.imgUrl})`,
				height: props.height,
			}}
		>
			{props.children}
		</section>
	)
}