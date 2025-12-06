import React from 'react';
import Image from 'next/image';

type Option = {
    value: string;
    label: string;
};

type SelectDropdownProps = {
    options: Option[];
    placeholder: string;
    name: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, placeholder, name, onChange }) => {
    return (
        <div className="relative w-full">
            <select 
                id={name}
                name={name}
                onChange={onChange}
                defaultValue=""
                className={`
                    appearance-none border-[1px] border-secondary-blue rounded-xl 
                    w-full text-custom-grey font-tertiary-font p-2 focus:border-secondary-blue 
                    focus:outline-none pr-10
                    xl:text-[0.9vw] lg:text-[1vw] md:text-[1.4vw] sm:text-[1.6vw] mobile:text-[2.8vw]
                `}
            >
                <option value="" disabled hidden>{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Image src="/dropdown-arrow.svg" alt="arrow-down" width={20} height={20} />
            </div>
        </div>
    );
}

export default SelectDropdown;
