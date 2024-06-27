import React, { useState } from 'react'
import Image from 'next/image'

interface DropdownProps {
    content?: React.ReactNode;
    labelClassName?: string;
    iconClassName?: string;
    contentClassName?: string;
    wrapperClassName?: string;
}

export default function Dropdown({
    content,
    labelClassName = 'text-[14px] lg:text-[18px] md:text-[1.9vw] text-secondary-blue font-tertiary-font',
    iconClassName = 'mb-3 cursor-pointer hover:scale-110 transition duration-300 ease-in-out',
    contentClassName = 'w-[8vw] bg-gray-100 mt-2 p-4 rounded-lg shadow-lg',
    wrapperClassName = 'w-full flex flex-col items-center mt-[1vw]'
}: DropdownProps) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={wrapperClassName}>
            <div className='w-[8vw] mobile:w-screen sm:w-[10vw] flex flex-col items-center'>
                {!isOpen && (
                    <>
                        <p className={labelClassName}>Ver más</p>
                    </>
                )}
                <div className="w-[80px] lg:w-[130px] md:w-[100px] h-0.5 bg-secondary-blue mb-3" />
                <Image
					src="/dropdown.svg"
					alt="dropdown icon"
					width={20}
					height={20}
					priority
                    className={iconClassName}
                    onClick={toggleDropdown}
				/>
            </div>
            {isOpen && (
                <div className={contentClassName}>
                    {content}
                </div>
            )}
        </div>
    )
}
