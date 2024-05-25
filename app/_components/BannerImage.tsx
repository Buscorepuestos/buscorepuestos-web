export default function BannerImage(props: {
	imgName: string
	height: string
	children?: React.ReactNode
}) {
	return (
		<section
			className={`bg-${props.imgName} h-[${props.height}] w-full
			border-2 border-black bg-no-repeat bg-cover bg-center
			`}
		>
			{props.imgName}
			{props.children}
		</section>
	)
}
