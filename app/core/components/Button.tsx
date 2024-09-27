export interface ButtonProps {
	labelName?: string;
	type?: 'primary' | 'secondary' | 'tertiary';
	hoverBg?: string;
	hoverText?: string;
	bg?: string;
	color?: string;
	borderColor?: string;
	xpadding?: string;
	onClick?: () => void;
	cursor?: string;
}

export default function Button(props: ButtonProps) {

	if (props.type === 'secondary') {

		const {
			labelName = 'Añadir a la cesta',
			bg = 'bg-secondary-blue',
			hoverBg = 'hover:bg-custom-white',
			hoverText = 'hover:text-secondary-blue',
			borderColor = 'border-secondary-blue',
			cursor = 'cursor-pointer'
		} = props

		return (
			<button
				onClick={props.onClick}
				className={`
						${bg} ${borderColor} border-[2px] box-border shadow-lg 
						${hoverText} ${hoverBg} ${cursor}
						rounded-3xl text-custom-white font-semibold
						transition duration-300 ease-in-out p-2
						font-tertiary-font text-[3vw] xl:text-[1.3vw] lg:text-[1.5vw] md:text-[1.6vw] sm:text-[1.5vw]
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
				onClick={props.onClick}
				className={`
					${bg} ${borderColor} border-[2px] box-border shadow-lg 
					${hoverText} ${hoverBg}
					rounded-3xl text-custom-white font-semibold
					transition duration-300 ease-in-out p-2
					font-tertiary-font text-[3vw] xl:text-[1.3vw] lg:text-[1.5vw] md:text-[1.6vw] sm:text-[1.5vw]
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
		xpadding = 'px-20' 
	} = props

	return (
		<button
			onClick={props.onClick}
			className={` 
				${bg} border-[1px] box-border shadow-lg
				${hoverText} ${hoverBg} ${xpadding} rounded-3xl font-semibold 
				text-custom-white transition duration-300 ease-in-out p-2
				font-tertiary-font text-[3vw] xl:text-[1.1vw] lg:text-[1.5vw] md:text-[1.6vw] sm:text-[1.5vw]
				flex justify-center items-center sm:w-[15vw]
			`}
		>
			{labelName}
		</button>
	)
}
