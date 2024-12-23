import React, { useEffect, useState } from 'react'

interface InputProps {
	name?: string
	placeholder: string
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	cssClass?: string
	ref?: React.RefObject<HTMLInputElement>
	isScrolled?: boolean
	disabled?: boolean
	buttonText?: string // Añadido para el texto del botón
	onButtonClick?: () => void // Añadido para manejar el clic del botón
	type?: string
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	isProductPage?: boolean
}

const Input: React.FC<InputProps> = ({
	name,
	placeholder,
	value,
	onChange,
	cssClass,
	ref,
	isScrolled = false,
	disabled = false,
	buttonText,
	onButtonClick,
	type = 'text',
	onKeyDown,
	isProductPage,
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
			setError(true) // Cambiar a error cuando isScrolled es true
		}
	}, [isScrolled])

	// Función para manejar las teclas no válidas
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (type === 'number') {
			// Bloquea letras, caracteres especiales y espacios
			const invalidKeys = ['e', 'E', '+', '-', '.', ',']
			if (invalidKeys.includes(e.key)) {
				e.preventDefault()
			}
		}
		if (onKeyDown) onKeyDown(e)
	}

	// Validar el valor ingresado
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (type === 'number') {
			const numericValue = e.target.value.replace(/[^0-9]/g, '') // Solo números
			e.target.value = numericValue
		}
		if (onChange) onChange(e)
	}

	return (
		<div className={`relative ${cssClass}`}>
			<input
				name={name}
				type={type}
				className={`
                    flex border-[1px] w-full rounded-xl text-gray-800 
                    p-2 font-tertiary-font focus:border-secondary-blue focus:outline-none
                    placeholder:text-custom-grey
                    xl:text-[0.9vw] ${isProductPage ? 'lg:text-[1.1vw] md:text-[1.5vw] sm:text-[1.5vw]':'lg:text-[1.6vw] md:text-[1.7vw] sm:text-[2vw] mobile:text-[3vw]'}
					${error || isScrolled ? 'border-red-500' : 'border-secondary-blue'}
					
                `}
				placeholder={placeholder}
				value={value}
				onChange={(e) => handleChange(e)}
				onBlur={() => handleOnBlur()}
				autoComplete="off"
				ref={ref}
				disabled={disabled}
				onKeyDown={handleKeyDown}
			/>
			{buttonText && onButtonClick && (
				<button
					className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-blue  ${isProductPage ? 'xl:text-sm lg:text-[1.2vw] md:text-[1.1vw] sm:text-[1.2vw] mobile:text-sm':'text-sm'} underline cursor-pointer`}
					onClick={onButtonClick}
				>
					{buttonText}
				</button>
			)}
			{error && (
				<span className={'text-red-500 text-xs font-semibold'}>
					Campo requerido
				</span>
			)}
		</div>
	)
}

export default Input
