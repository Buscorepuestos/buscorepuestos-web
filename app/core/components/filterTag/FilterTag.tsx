import React from 'react'

interface FilterTagProps {
	filterName: string
	onRemove: () => void
}

const FilterTag: React.FC<FilterTagProps> = ({ filterName, onRemove }) => {
	return (
		<div className="flex items-center bg-primary-blue text-white px-3 rounded-full gap-2">
			<span className='text-sm'>{filterName}</span>
			<button
				onClick={onRemove}
				className="text-white text-[1.8rem] font-bold hover:text-gray-300"
				aria-label={`Remove ${filterName}`}
			>
				×
			</button>
		</div>
	)
}

export default FilterTag
