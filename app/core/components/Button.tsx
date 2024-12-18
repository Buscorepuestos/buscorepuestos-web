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
	textColor?: string;
	height?: string;
}

export default function Button(props: ButtonProps) {

	if (props.type === 'secondary') {

		const {
			labelName = 'Añadir a la cesta',
			bg = 'bg-secondary-blue',
			hoverBg = 'hover:bg-custom-white',
			hoverText = 'hover:text-secondary-blue',
			borderColor = 'border-secondary-blue',
			cursor = 'cursor-pointer',
			textColor = 'text-custom-white',
			height = '',
			xpadding = ''
		} = props

		return (
			<button
				onClick={props.onClick}
				className={`
						${bg} ${borderColor} border-[2px] box-border shadow-lg 
						${hoverText} ${hoverBg} ${cursor} ${height} ${xpadding}
						rounded-3xl ${textColor} font-semibold
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
			borderColor = 'border-secondary-blue',
			xpadding = 'px-20'
		} = props

		return (
			<button
				onClick={props.onClick}
				className={`
					${bg} ${borderColor} border-[2px] box-border shadow-lg 
					${hoverText} ${hoverBg} ${xpadding}
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
		xpadding = 'px-0' 
	} = props

	return (
		<button
			onClick={props.onClick}
			className={` 
				${bg} border-[1px] box-border shadow-lg
				${hoverText} ${hoverBg} ${xpadding} rounded-3xl font-semibold 
				text-custom-white transition duration-300 ease-in-out p-2
				font-tertiary-font text-[2.5vw] xl:text-[0.8vw] lg:text-[1vw] md:text-[1vw] sm:text-[1.5vw]
				flex justify-center items-center w-full
			`}
		>
			{labelName}
		</button>
	)
}
