import React, { useState, useMemo, useDeferredValue } from 'react'
import Image from 'next/image'
import { 
    Combobox, 
    ComboboxButton, 
    ComboboxInput, 
    ComboboxOption, 
    ComboboxOptions 
} from '@headlessui/react'

type Option = {
    value: string | number;
    label: string;
};

type SearchableSelectProps = {
    options: string[] | number[];
    placeholder: string;
    value: string | number | null;
    onChange: (value: string | null) => void;
    disabled?: boolean;
};

const SearchableSelect = React.memo(({ options, placeholder, value, onChange, disabled }: SearchableSelectProps) => {
    const [query, setQuery] = useState('')
    const deferredQuery = useDeferredValue(query)

    const normalizedOptions: Option[] = useMemo(() => {
        return options.map(opt => ({
            value: opt,
            label: opt.toString()
        }))
    }, [options])

    const filteredOptions = useMemo(() => {
        const q = deferredQuery.toLowerCase()
        let results = normalizedOptions;

        if (q !== '') {
            results = normalizedOptions.filter((option) =>
                option.label.toLowerCase().includes(q)
            )
        }
        // Limitamos a 60 para evitar problemas de rendimiento
        return results.slice(0, 60); 
    }, [deferredQuery, normalizedOptions])

    const selectedOption = useMemo(() => 
        normalizedOptions.find(opt => opt.value === value) || null
    , [normalizedOptions, value])

    return (
        <div className="relative w-full">
            <Combobox
                value={selectedOption}
                onChange={(item: Option | null) => onChange(item ? String(item.value) : null)}
                disabled={disabled}
                immediate
                onClose={() => setQuery('')}
                as="div" // 1. Forzamos al contenedor raíz a ser un DIV
            >
                <div className="relative w-full">
                    <ComboboxInput
                        as="input" // 2. Explícito (aunque es el default)
                        className={`
                            w-full border-[1px] border-secondary-blue rounded-xl 
                            bg-white text-custom-grey font-tertiary-font p-2 pr-10
                            focus:border-secondary-blue focus:outline-none focus:ring-1 focus:ring-secondary-blue
                            xl:text-[0.9vw] lg:text-[1vw] md:text-[1.4vw] sm:text-[1.6vw] mobile:text-[2.8vw]
                            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                            truncate
                        `}
                        displayValue={(option: Option | null) => option?.label ?? ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
                        <Image src="/dropdown-arrow.svg" alt="arrow-down" width={20} height={20} className="aria-disabled:opacity-50" />
                    </ComboboxButton>
                </div>

                {/* 
                    CORRECCIÓN PRINCIPAL:
                    1. Eliminamos <Transition> envolvente.
                    2. Usamos la prop 'transition' nativa.
                    3. Usamos as="ul" para que sea un elemento real del DOM (acepta refs).
                    4. Usamos clases data-[closed] para la animación.
                */}
                <ComboboxOptions 
                    as="ul" 
                    transition
                    className="
                        absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
                        transition duration-100 ease-in data-[closed]:opacity-0
                    "
                >
                    {filteredOptions.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                            No se encontraron resultados.
                        </div>
                    ) : (
                        <>
                            {filteredOptions.map((option) => (
                                <ComboboxOption
                                    as="li" // 3. Forzamos a que cada opción sea un LI real
                                    key={option.value}
                                    className={({ focus, selected }) =>
                                        `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                                            focus ? 'bg-secondary-blue text-white' : 'text-gray-900'
                                        } ${selected ? 'font-medium bg-blue-50 text-secondary-blue' : 'font-normal'}`
                                    }
                                    value={option}
                                >
                                    <span className="block truncate">
                                        {option.label}
                                    </span>
                                </ComboboxOption>
                            ))}
                            {normalizedOptions.length > filteredOptions.length && query === '' && (
                                <div className="px-4 py-2 text-xs text-gray-400 text-center italic border-t">
                                    Escribe para ver más resultados...
                                </div>
                            )}
                        </>
                    )}
                </ComboboxOptions>
            </Combobox>
        </div>
    )
})

SearchableSelect.displayName = 'SearchableSelect';

export default SearchableSelect