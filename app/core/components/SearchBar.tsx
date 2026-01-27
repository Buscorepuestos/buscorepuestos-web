// import Image from 'next/image'
// import { ChangeEvent, KeyboardEvent } from 'react'

// // 1. Añadimos la nueva prop 'isLoading' a la interfaz
// interface SearchBarProps {
//     value: string;
//     onChange: (event: ChangeEvent<HTMLInputElement>) => void;
//     onClear: () => void;
//     isLoading?: boolean; // <-- NUEVA PROP
//     height?: string;
//     width?: string;
//     borderColor?: string;
//     borderWidth?: string;
//     onEnterPress?: () => void;
// }

// export default function SearchBar(props: SearchBarProps) {

//     const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter' && props.onEnterPress) {
//             props.onEnterPress();
//         }
//     };

//     return (
//         <div
//             className={`${props.width} relative flex items-center bg-custom-white
//                 rounded-[34px] pl-8 self-center`}
//             style={{
//                 height: props.height,
//                 borderColor: props.borderColor,
//                 borderWidth: props.borderWidth
//             }}
//         >
//             <Image
//                 src="/search-icon.svg"
//                 alt="icon"
//                 width={30}
//                 height={30}
//                 priority
//                 className="mr-[20px] mobile:mr-[15px]"
//             />
//             <input
//                 // 2. Ajustamos el padding derecho para dar espacio al loader o al botón
//                 className="text-title-4 flex-grow bg-transparent outline-none font-semibold pr-16" // <-- 'pr-16' AJUSTADO
//                 type="text"
//                 placeholder="Escribe lo que necesitas"
//                 style={{
//                     color: '#A9A9A9'
//                 }}
//                 value={props.value}
//                 onChange={props.onChange}
//                 onKeyDown={handleKeyDown}
//                 disabled={props.isLoading} // Opcional: deshabilita el input mientras carga
//             />

//             {/* 3. Lógica para mostrar el loader O el botón de borrar */}
//             <div className="absolute right-5 flex items-center justify-center">
//                 {props.isLoading ? (
//                     // Si está cargando, muestra el spinner
//                     <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent border-solid rounded-full animate-spin"></div>
//                 ) : (
//                     // Si no está cargando y hay texto, muestra el botón "Borrar"
//                     props.value && (
//                         <button
//                             onClick={props.onClear}
//                             className="text-gray-500 hover:text-secondary-blue text-sm font-tertiary-font cursor-pointer z-10"
//                             type="button"
//                         >
//                             Borrar
//                         </button>
//                     )
//                 )}
//             </div>
//         </div>
//     )
// }

'use client'
import { ChangeEvent, KeyboardEvent } from 'react'

interface SearchBarProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onClear?: () => void;
    isLoading?: boolean;
    height?: string;
    width?: string;
    borderColor?: string;
    borderWidth?: string;
    onEnterPress?: () => void;
}

export default function SearchBar(props: SearchBarProps) {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && props.onEnterPress) {
            props.onEnterPress();
        }
    };

    const isReferenceSearch = (term: string): boolean => {
        if (!term) return false;
        const trimmed = term.trim();
        if (trimmed.length < 6) return false;

        const onlyNumbers = /^\d{6,}$/;
        const mixedWithNumbers = /^[A-Za-z0-9\-\.]+$/;
        const hasNumbers = /\d/;
        const hasLetters = /[A-Za-z]/;
        const specificPatterns = /^[A-Za-z0-9]+[\-\.][A-Za-z0-9]+/;

        if (onlyNumbers.test(trimmed)) return true;
        if (specificPatterns.test(trimmed)) return true;
        if (mixedWithNumbers.test(trimmed) && hasNumbers.test(trimmed) && hasLetters.test(trimmed)) {
            const numberCount = (trimmed.match(/\d/g) || []).length;
            return (numberCount / trimmed.length) >= 0.3;
        }
        return false;
    };

    const getPlaceholder = (): string => {
        if (props.value && isReferenceSearch(props.value)) {
            return "Buscando por referencia...";
        }
        return "Escribe lo que necesitas";
    };

    const getBorderColor = (): string => {
        if (props.value && isReferenceSearch(props.value)) {
            return '#10B981';
        }
        return props.borderColor || '#12B1BB';
    };

    return (
        <div
            className={`${props.width} relative flex items-center bg-custom-white
                rounded-[34px] self-center transition-all duration-200`}
            style={{
                height: props.height,
                borderColor: getBorderColor(),
                borderWidth: props.borderWidth,
                boxShadow: props.value && isReferenceSearch(props.value)
                    ? '0 0 0 1px rgba(16, 185, 129, 0.2)'
                    : 'none'
            }}
        >
            <input
                className="text-title-4 flex-grow bg-transparent outline-none font-semibold pl-6 pr-14 rounded-[34px]"
                type="text"
                placeholder={getPlaceholder()}
                style={{
                    color: '#A9A9A9'
                }}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={handleKeyDown}
                disabled={props.isLoading}
            />

            {/* Indicador de REF */}
            {props.value && !props.isLoading && isReferenceSearch(props.value) && (
                <div className="absolute right-14 flex items-center pointer-events-none">
                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
                        REF
                    </span>
                </div>
            )}

            {/* Área de acción a la derecha */}
            <div className="absolute right-5 flex items-center justify-center w-10 h-10">
                {props.isLoading ? (
                    <div className="w-6 h-6 border-4 border-primary-blue border-t-transparent border-solid rounded-full animate-spin"></div>
                ) : (
                    <button
                        onClick={props.onEnterPress}
                        // Usamos 'group' aquí para controlar el SVG hijo al hacer hover en el botón
                        className="group flex items-center justify-center w-full h-full focus:outline-none"
                        aria-label="Buscar"
                        type="button"
                    >
                        {/* 
                            SVG INLINE REEMPLAZANDO A <Image />
                            - 'stroke-current': Hace que el trazo use el color del texto actual.
                            - 'text-[#A9A9A9]': Color base (gris).
                            - 'group-hover:text-primary-blue': Cambia a azul cuando haces hover sobre el botón.
                        */}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#A9A9A9] transition-colors duration-200 group-hover:text-primary-blue"
                        >
                            <path
                                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}