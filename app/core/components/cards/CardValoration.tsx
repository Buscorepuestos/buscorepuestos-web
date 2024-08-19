import Star from '../svg/star'

const MAX_VALORATION = 5

export default function CardValoration(props: {
	title: string
	valoration: number
	comments: string
}) {
	return (
		<>
			<div
				className="flex flex-col gap-3 w-[341px] h-[220px] rounded-[32px] bg-custom-white pt-[26px] 
			pb-[26px] pr-[27px] pl-[27px] font-tertiary-font"
			>
				<div className='flex gap-6'>
					<h3 className='font-tertiary-font'>{props.title}</h3>
					<div className="flex flex-row gap-2">
						{Array.from({ length: MAX_VALORATION }, (_, index) => (
							<Star key={index} isFilled={index < props.valoration} />
						))}
					</div>
				</div>
				<p>{props.comments}</p>
			</div>
		</>
	)
}
