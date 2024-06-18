function getAligned(aligned: 'center' | 'left' | 'right' | undefined) {
	if (aligned === 'left') return 'flex-start'
	if (aligned === 'right') return 'flex-end'
	return 'justify-center'
}

function getItemsAligned(aligned: 'center' | 'left' | 'right' | undefined) {
	if (aligned === 'left') return 'items-start'
	if (aligned === 'right') return 'items-end'
	return 'items-center'
}

export default function TagBanner(props: {
	title: string
	flexDir: string
	fontColor: string
	color: string
	width: string
	height: string
	align: 'center' | 'left' | 'right'
	alignItems: 'center' | 'left' | 'right'
	radius?: string
	children?: React.ReactNode
	position: string
	zIndex: string
	axis: string
	padding: ''
	alignSelf: ''
}) {
	return (
		<article className={`flex ${props.flexDir} justify-around ${getItemsAligned(props.alignItems)} ${props.alignSelf} ${props.position} ${props.axis} ${props.radius} ${props.padding}`} style={{
			justifyContent: getAligned(props.align),
			backgroundColor: props.color,
			width: props.width,
			height: props.height,
			color: props.fontColor,
			zIndex: props.zIndex
		}}>
			<div className="desktop:max-w-80">
				<h1 className={'desktop:text-title-2 mobile:text-xl tablet:text-xl text-center leading-none'}>{props.title}</h1>
			</div>
			{props.children}
		</article>
	)
}
