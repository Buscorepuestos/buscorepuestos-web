import React from 'react'

interface InputProps {
    name?: string
    placeholder: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({name, placeholder, value, onChange}) => {
    return (
        <div >
            <input
                name={name}
                type="text" 
                className={`
                    flex border-[1px] border-secondary-blue w-full rounded-xl text-gray-800 
                    p-2 font-tertiary-font focus:border-secondary-blue focus:outline-none
                    placeholder:text-custom-grey
                    xl:text-[0.9vw] lg:text-[1vw] md:text-[1.1vw] sm:text-[1.5vw] mobile:text-[2.8vw]
                `}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete='off'
            />
        </div>
    )
}

export default Input