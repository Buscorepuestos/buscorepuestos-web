function getAligned(aligned: 'center' | 'left' | 'right' | undefined) {
	if (aligned === 'left') return 'flex-start'
	if (aligned === 'right') return 'flex-end'
	return 'justify-center'
}

export default function TagBanner(props: {
	title: string
	fontColor: string
	color: string
	width: string
	height: string
	align: 'center' | 'left' | 'right'
	radius?: string
	children?: React.ReactNode
	position: string
	zIndex: string
	axis: string
}) {
	return (
		<article className={`flex justify-around items-center ${props.position} ${props.axis} ${props.radius}`} style={{
			justifyContent: getAligned(props.align),
			backgroundColor: props.color,
			width: props.width,
			height: props.height,
			color: props.fontColor,
			zIndex: props.zIndex
		}}>
			<div className="max-w-80">
				<h1 className={'text-title-2 text-center leading-none'}>{props.title}</h1>
			</div>
			{props.children}
		</article>
	)
}
