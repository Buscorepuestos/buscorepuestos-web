import React from 'react'
import Image from 'next/image'

interface CheckboxProps {
    name: string;             
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
    value: boolean;  
    label: string;            
}

const Checkbox: React.FC<CheckboxProps> = ({ name, onChange, value, label }) => {
    return ( 
        <div className="flex items-center mobile:pl-[5vw]">
            <div className="relative flex items-center">
                <input 
                    id={name} 
                    type="checkbox" 
                    name={name}
                    // value={value}
                    onChange={onChange}
                    className="peer hidden"
                />
                <div className="
                    w-11 h-11 rounded-md border border-gray-300 
                    peer-checked:bg-secondary-blue peer-checked:border-transparent
                    flex items-center justify-center
                    transition-colors
                ">
                    <Image
                        src="/checkbox.svg"
                        width={24}  
                        height={24}
                        alt="Checkmark"
                        className="peer-checked:block w-8 h-8"
                    />
                </div>
                <label 
                    htmlFor={name} 
                    className="
                        absolute inset-0 cursor-pointer 
                        z-10
                    "
                />
            </div>
            <label 
                htmlFor={name} 
                className="
                    ms-10 font-tertiary-font text-custom-grey
                    xl:text-[0.9vw] lg:text-[1vw] md:text-[1.4vw] sm:text-[1.6vw] mobile:text-[3vw]
                "
            >
                {label}
            </label>
        </div>  
    )
}

export default Checkbox
