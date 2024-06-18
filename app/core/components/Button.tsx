export default function Button(props: {
	labelName?: string
	type?: 'primary' | 'secondary' | 'tertiary'
	hover?: boolean
}) {
	const { 
		labelName = 'Comprar', 
		type = 'primary'
	} = props

	if (type === 'secondary') {
		return (
			<button
			className="
				border-[2px] border-secondary-blue box-border shadow-lg hover:text-secondary-blue hover:bg-custom-white 
				rounded-3xl bg-secondary-blue text-custom-white 
				transition duration-300 ease-in-out w-[170px] h-[42px]
				font-tertiary-font text-[0.9vw]
				"
			>
				{labelName}
			</button>
		)
	} else if (type === 'tertiary') {
		return (
			<button
				className="
					border-[2px] border-secondary-blue box-border shadow-lg hover:text-secondary-blue hover:bg-custom-white 
					rounded-3xl bg-secondary-blue text-custom-white 
					transition duration-300 ease-in-out w-[170px] h-[35px]
					font-tertiary-font text-[0.9vw]
				"
			>
				{labelName}
			</button>
		)
	}
	return (
		<button
			className={` 
				border-[1px] box-border shadow-lg hover:text-white 
				hover:bg-primary-lila rounded-3xl bg-primary-blue
				text-custom-white transition duration-300 
				ease-in-out w-[170px] h-[42px]
				font-tertiary-font text-[0.9vw] font-semibold
			`}
		>
			{labelName}
		</button>
	)
}
