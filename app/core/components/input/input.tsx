import React, { useEffect, useState } from 'react'

interface InputProps {
	name?: string
	placeholder: string
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	cssClass?: string
	ref?: React.RefObject<HTMLInputElement>
	isScrolled?: boolean
}

const Input: React.FC<InputProps> = ({
	name,
	placeholder,
	value,
	onChange,
	cssClass,
	ref,
	isScrolled = false,
}) => {
	cssClass = cssClass ? cssClass : ''

	const [error, setError] = useState(false)

	const handleOnBlur = () => {
		if (value === '') setError(true)
		else setError(false)
	}

	useEffect(() => {
		if (value !== '') setError(false)
	}, [value])

	useEffect(() => {
		if (isScrolled) {
			setError(true); // Cambiar a error cuando isScrolled es true
		}
	}, [isScrolled]);

	return (
		<div className={cssClass}>
			<input
				name={name}
				type="text"
				className={`
                    flex border-[1px] w-full rounded-xl text-gray-800 
                    p-2 font-tertiary-font focus:border-secondary-blue focus:outline-none
                    placeholder:text-custom-grey
                    xl:text-[0.9vw] lg:text-[1.6vw] md:text-[1.7vw] sm:text-[2vw] mobile:text-[3vw]
					${error || isScrolled? 'border-red-500' : 'border-secondary-blue'}
                `}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onBlur={() => handleOnBlur()}
				autoComplete="off"
				ref={ref}
			/>
			{error && (
				<span className={'text-red-500 text-xs font-semibold'}>
					Campo requerido
				</span>
			)}
		</div>
	)
}

export default Input
