import React from 'react'
import Image from 'next/image'

interface ButtonIconProps {
    iconSrc: string;
    selectedIconSrc?: string; // Nueva prop para la imagen cuando está seleccionado
    label: string;
    isSelected: boolean;
    onClick: () => void;
    imageWidth: number;  
    imageHeight: number;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ iconSrc, selectedIconSrc, label, isSelected, onClick, imageWidth, imageHeight }) => {
    return (
        <div>
            <button 
                onClick={onClick}
                className={`
                    flex flex-col gap-3 border-[2px] 
                    ${isSelected ? 'border-primary-blue text-primary-blue' : 'border-secondary-blue text-secondary-blue'} 
                    rounded-3xl p-3 items-center 
                    xl:text-[0.9vw] lg:text-[1vw] md:text-[1.4vw] 
                    sm:text-[1.6vw] mobile:text-[3vw]
                `}
            >
                <Image 
                    src={isSelected ? selectedIconSrc || iconSrc : iconSrc} 
                    alt={label} 
                    width={imageWidth}  
                    height={imageHeight}
                    className='fill-current'
                />
                <p className='font-tertiary-font'>{label}</p>
            </button>
        </div>
    )
}

export default ButtonIcon;