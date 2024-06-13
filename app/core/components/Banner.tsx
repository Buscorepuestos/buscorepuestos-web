function getAligned(aligned: 'center' | 'left' | 'right' | undefined) {
	if (aligned === 'left') return 'flex-start'
	if (aligned === 'right') return 'flex-end'
	return 'justify-center'
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
}) {
	const styles: BannerStyle = {
		backgroundColor: "blue",
		height: props.height,
		justifyContent: getAligned(props.aligned),
	};
	if (props.imgUrl)
		styles.backgroundImage = `url(${props.imgUrl})`;
	return (
		<section
			className={`w-full bg-no-repeat bg-cover bg-center flex justify-center`}
			style={styles}
		>
			{props.children}
		</section>
	)
}
