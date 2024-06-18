function getAligned(aligned: 'center' | 'left' | 'right' | undefined) {
	if (aligned === 'left') return 'flex-start'
	if (aligned === 'right') return 'flex-end'
	return 'center'
}

interface BannerStyle {
	backgroundImage?: string,
	height: string,
	justifyContent: string,
	backgroundColor: string
}

export default function Banner(props: {
	height: string
	color: string
	imgUrl?: string
	aligned?: 'center' | 'left' | 'right'
	children?: React.ReactNode
	position?: string
	extraCss?: string
}) {
	const styles: BannerStyle = {
		backgroundColor: props.color,
		height: props.height,
		justifyContent: getAligned(props.aligned),
	};
	if (props.imgUrl)
		styles.backgroundImage = `url(${props.imgUrl})`;
	return (
		<section
			className={`desktop:w-full mobile:w-[100vw] bg-no-repeat bg-cover bg-center flex ${props.position} z-0 ${props.extraCss}`}
			style={styles}
		>
			{props.children}
		</section>
	)
}
