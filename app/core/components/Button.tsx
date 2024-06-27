export default function Button(props: {
	labelName?: string
	type?: 'primary' | 'secondary' | 'tertiary'
	hoverBg?: string
	hoverText?: string
	bg?: string
	color?: string
	borderColor?: string
}) {
	
	if (props.type === 'secondary') {

		const { 
			labelName = 'Añadir a la cesta', 
			bg = 'bg-secondary-blue',
			hoverBg = 'hover:bg-custom-white',
			hoverText = 'hover:text-secondary-blue',
			borderColor = 'border-secondary-blue'
		} = props

		return (
			<button
				className={`
						${bg} ${borderColor} border-[2px] box-border shadow-lg 
						${hoverText} ${hoverBg} 
						rounded-3xl text-custom-white 
						transition duration-300 ease-in-out w-[170px] h-[42px]
						font-tertiary-font text-[3vw] lg:text-[1vw] md:text-[2vw] 
					`}
			>
				{labelName}
			</button>
		)
	} else if (props.type === 'tertiary') {

		const { 
			labelName = 'Siguiente', 
			bg = 'bg-secondary-blue',
			hoverBg = 'hover:bg-custom-white',
			hoverText = 'hover:text-secondary-blue',
			borderColor = 'border-secondary-blue'
		} = props
		
		return (
			<button
				className={`
					${bg} ${borderColor} border-[2px] box-border shadow-lg 
					${hoverText} ${hoverBg}
					rounded-3xl text-custom-white 
					transition duration-300 ease-in-out w-[170px] h-[35px]
					font-tertiary-font text-[3vw] lg:text-[1vw] md:text-[2vw]
				`}
			>
				{labelName}
			</button>
		)
	}

	const { 
		labelName = 'Comprar', 
		bg = 'bg-primary-blue',
		hoverBg = 'hover:bg-primary-lila',
		hoverText = 'hover:text-white',
	} = props

	return (
		<button
			className={` 
				${bg} border-[1px] box-border shadow-lg
				${hoverText} ${hoverBg} rounded-3xl
				text-custom-white transition duration-300 
				ease-in-out w-[170px] h-[42px] font-semibold
				font-tertiary-font text-[3vw] lg:text-[1vw] md:text-[2vw] mobile:text-[4vw]
			`}
		>
			{labelName}
		</button>
	)
}
