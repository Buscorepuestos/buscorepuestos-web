export default function Button(props: {
	labelName?: string
	type?: 'primary' | 'secondary'
}) {
	const { labelName = 'Compras', type = 'primary' } = props

	if (type === 'secondary') {
		return (
			<button
				className="
				box-border rounded-3xl bg-warning 
				shadow-lg w-[389px] h-[23px] text-base text-dark-grey
				transition duration-300 ease-in-out 
				hover:bg-custom-white hover:border-primary-blue
				"
			>
				{labelName}
			</button>
		)
	}
	return (
		<button
			className="border-[1px] box-border border-primary-blue 
            shadow-lg hover:text-primary-blue hover:bg-custom-white 
            hover:border-primary-blue rounded-3xl bg-primary-blue 
            text-custom-white transition duration-300 ease-in-out w-[170px] h-[42px]"
		>
			{labelName}
		</button>
	)
}
