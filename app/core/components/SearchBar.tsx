// 'use client'
// import { ChangeEvent, KeyboardEvent, useRef, useEffect, useState } from 'react'
// import { useAutocomplete } from '../../hooks/useAutocomplete';
// import { createPortal } from 'react-dom'

// interface SearchBarProps {
//     value: string;
//     onChange: (event: ChangeEvent<HTMLInputElement>) => void;
//     onClear?: () => void;
//     isLoading?: boolean;
//     height?: string;
//     width?: string;
//     borderColor?: string;
//     borderWidth?: string;
//     onEnterPress?: () => void;
//     onSuggestionSelect?: (suggestion: string) => void;
// }

// export default function SearchBar(props: SearchBarProps) {

//     const { suggestions, isOpen, closeDropdown } = useAutocomplete(props.value);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLInputElement>(null)
//     const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

//     useEffect(() => {
//         const handleClickOutside = (e: MouseEvent) => {
//             if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
//                 closeDropdown();
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [closeDropdown]);

//     useEffect(() => {
//         // Calcular posición SOLO al abrir (sin scroll listener de posición)
//         if (isOpen && inputRef.current) {
//             const rect = inputRef.current.getBoundingClientRect()
//             setDropdownPos({
//                 top: rect.bottom + 4,
//                 left: rect.left,
//                 width: rect.width,
//             })
//         }

//         // Al hacer scroll, simplemente cerrar el dropdown
//         const handleScroll = () => {
//             if (isOpen) closeDropdown()
//         }

//         if (isOpen) {
//             window.addEventListener('scroll', handleScroll, true)
//         }

//         return () => {
//             window.removeEventListener('scroll', handleScroll, true)
//         }
//     }, [isOpen, closeDropdown])

//     const handleSuggestionClick = (suggestion: string) => {
//         props.onSuggestionSelect?.(suggestion); // notifica al padre
//         closeDropdown();
//     };

//     const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter' && props.onEnterPress) {
//             props.onEnterPress();
//         }
//     };

//     const isReferenceSearch = (term: string): boolean => {
//         if (!term) return false;
//         const trimmed = term.trim();
//         if (trimmed.length < 6) return false;

//         const onlyNumbers = /^\d{6,}$/;
//         const mixedWithNumbers = /^[A-Za-z0-9\-\.]+$/;
//         const hasNumbers = /\d/;
//         const hasLetters = /[A-Za-z]/;
//         const specificPatterns = /^[A-Za-z0-9]+[\-\.][A-Za-z0-9]+/;

//         if (onlyNumbers.test(trimmed)) return true;
//         if (specificPatterns.test(trimmed)) return true;
//         if (mixedWithNumbers.test(trimmed) && hasNumbers.test(trimmed) && hasLetters.test(trimmed)) {
//             const numberCount = (trimmed.match(/\d/g) || []).length;
//             return (numberCount / trimmed.length) >= 0.3;
//         }
//         return false;
//     };

//     const getPlaceholder = (): string => {
//         if (props.value && isReferenceSearch(props.value)) {
//             return "Buscando por referencia...";
//         }
//         return "Escribe lo que necesitas";
//     };

//     const getBorderColor = (): string => {
//         if (props.value && isReferenceSearch(props.value)) {
//             return '#10B981';
//         }
//         return props.borderColor || '#12B1BB';
//     };

//     return (
//         <div
//             ref={containerRef}
//             className={`${props.width} relative flex items-center bg-custom-white
//                 rounded-[34px] self-center transition-all duration-200`}
//             style={{
//                 height: props.height,
//                 borderColor: getBorderColor(),
//                 borderWidth: props.borderWidth,
//                 boxShadow: props.value && isReferenceSearch(props.value)
//                     ? '0 0 0 1px rgba(16, 185, 129, 0.2)'
//                     : 'none'
//             }}
//         >
//             <input
//                 className="text-title-4 flex-grow bg-transparent outline-none font-semibold pl-6 pr-14 rounded-[34px]"
//                 type="text"
//                 placeholder={getPlaceholder()}
//                 style={{
//                     color: '#A9A9A9'
//                 }}
//                 value={props.value}
//                 onChange={props.onChange}
//                 onKeyDown={handleKeyDown}
//                 disabled={props.isLoading}
//                 ref={inputRef}
//             />

//             {/* DROPDOWN NUEVO */}
//             {isOpen && suggestions.length > 0 && typeof window !== 'undefined' && createPortal(
//                 <ul
//                     style={{
//                         position: 'fixed',
//                         top: dropdownPos.top,
//                         left: dropdownPos.left,
//                         width: dropdownPos.width,
//                         zIndex: 9999,
//                     }}
//                     className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
//                 >
//                     {suggestions.map((suggestion, index) => (
//                         <li
//                             key={index}
//                             onMouseDown={() => handleSuggestionClick(suggestion)}
//                             className="px-5 py-3 cursor-pointer hover:bg-gray-50 font-tertiary-font text-sm text-gray-700 border-b border-gray-100 last:border-0 flex items-center gap-3"
//                         >
//                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400 shrink-0">
//                                 <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>
//                             {suggestion}
//                         </li>
//                     ))}
//                 </ul>,
//                 document.body
//             )}

//             {/* Indicador de REF */}
//             {props.value && !props.isLoading && isReferenceSearch(props.value) && (
//                 <div className="absolute right-14 flex items-center pointer-events-none">
//                     <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
//                         REF
//                     </span>
//                 </div>
//             )}

//             {/* Área de acción a la derecha */}
//             <div className="absolute right-5 flex items-center justify-center w-10 h-10">
//                 {props.isLoading ? (
//                     <div className="w-6 h-6 border-4 border-primary-blue border-t-transparent border-solid rounded-full animate-spin"></div>
//                 ) : (
//                     <button
//                         onClick={props.onEnterPress}
//                         // Usamos 'group' aquí para controlar el SVG hijo al hacer hover en el botón
//                         className="group flex items-center justify-center w-full h-full focus:outline-none"
//                         aria-label="Buscar"
//                         type="button"
//                     >
//                         {/* 
//                             SVG INLINE REEMPLAZANDO A <Image />
//                             - 'stroke-current': Hace que el trazo use el color del texto actual.
//                             - 'text-[#A9A9A9]': Color base (gris).
//                             - 'group-hover:text-primary-blue': Cambia a azul cuando haces hover sobre el botón.
//                         */}
//                         <svg
//                             width="24"
//                             height="24"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="text-[#A9A9A9] transition-colors duration-200 group-hover:text-primary-blue"
//                         >
//                             <path
//                                 d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             />
//                         </svg>
//                     </button>
//                 )}
//             </div>
//         </div>
//     )
// }
'use client'
import { ChangeEvent, KeyboardEvent, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAutocomplete } from '../../hooks/useAutocomplete'

interface SearchBarProps {
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    onClear?: () => void
    isLoading?: boolean
    height?: string
    width?: string
    borderColor?: string
    borderWidth?: string
    onEnterPress?: () => void
    onSuggestionSelect?: (suggestion: string) => void
}

export default function SearchBar(props: SearchBarProps) {
    const { suggestions, isOpen, closeDropdown } = useAutocomplete(props.value)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
    const [mounted, setMounted] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    // Solo para saber que estamos en el cliente
    useEffect(() => { setMounted(true) }, [])

    // Click fuera — array vacío para no recrear el listener
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                closeDropdown()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, []) // ← vacío, sin closeDropdown

    // Calcular posición del dropdown al abrirse
    useEffect(() => {
        if (!isOpen) return

        // Calcular posición una sola vez al abrir
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect()
            setDropdownPos({
                top: rect.bottom + 13,
                left: rect.left,
                width: rect.width,
            })
        }

        // Al hacer scroll → cerrar el dropdown directamente
        const handleScroll = () => closeDropdown()
        window.addEventListener('scroll', handleScroll, true)

        return () => window.removeEventListener('scroll', handleScroll, true)
    }, [isOpen]) // ← solo isOpen, closeDropdown NO va aquí

    const handleSuggestionClick = (suggestion: string) => {
        props.onSuggestionSelect?.(suggestion)
        closeDropdown()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            closeDropdown()   // ← AÑADIR ESTO
            props.onEnterPress?.()
        }
        if (event.key === 'Escape') closeDropdown()
    }

    const isReferenceSearch = (term: string): boolean => {
        if (!term) return false
        const trimmed = term.trim()
        if (trimmed.length < 6) return false
        const onlyNumbers = /^\d{6,}$/
        const mixedWithNumbers = /^[A-Za-z0-9\-\.]+$/
        const hasNumbers = /\d/
        const hasLetters = /[A-Za-z]/
        const specificPatterns = /^[A-Za-z0-9]+[\-\.][A-Za-z0-9]+/
        if (onlyNumbers.test(trimmed)) return true
        if (specificPatterns.test(trimmed)) return true
        if (mixedWithNumbers.test(trimmed) && hasNumbers.test(trimmed) && hasLetters.test(trimmed)) {
            const numberCount = (trimmed.match(/\d/g) || []).length
            return (numberCount / trimmed.length) >= 0.3
        }
        return false
    }

    const getPlaceholder = () =>
        props.value && isReferenceSearch(props.value)
            ? 'Buscando por referencia...'
            : 'Escribe lo que necesitas'

    const getBorderColor = () =>
        props.value && isReferenceSearch(props.value)
            ? '#10B981'
            : props.borderColor || '#12B1BB'

    return (
        <div
            ref={containerRef}
            className={`${props.width} relative flex items-center bg-custom-white rounded-[34px] self-center transition-all duration-200`}
            style={{
                height: props.height,
                borderColor: getBorderColor(),
                borderWidth: props.borderWidth,
                borderStyle: 'solid',
                boxShadow: props.value && isReferenceSearch(props.value)
                    ? '0 0 0 1px rgba(16, 185, 129, 0.2)'
                    : 'none',
            }}
        >
            <input
                ref={inputRef}
                className="text-title-4 flex-grow bg-transparent outline-none font-semibold pl-6 pr-14 rounded-[34px]"
                type="text"
                placeholder={getPlaceholder()}
                style={{ color: '#A9A9A9' }}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={handleKeyDown}
                disabled={props.isLoading}
                onFocus={() => setIsFocused(true)}   // ← AÑADIR
                onBlur={() => setIsFocused(false)}   // ← AÑADIR
            />

            {/* PORTAL — flota encima de todo, fuera del DOM del Banner */}
            {mounted && isOpen && suggestions.length > 0 && isFocused && createPortal(
                <ul style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                    zIndex: 99999,
                }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                            className="px-5 py-3 cursor-pointer hover:bg-gray-50 font-tertiary-font text-sm text-gray-700 border-b border-gray-100 last:border-0 flex items-center gap-3"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400 shrink-0">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {suggestion}
                        </li>
                    ))}
                </ul>,
                document.body
            )}

            {props.value && !props.isLoading && isReferenceSearch(props.value) && (
                <div className="absolute right-14 flex items-center pointer-events-none">
                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
                        REF
                    </span>
                </div>
            )}

            <div className="absolute right-5 flex items-center justify-center w-10 h-10">
                {props.isLoading ? (
                    <div className="w-6 h-6 border-4 border-primary-blue border-t-transparent border-solid rounded-full animate-spin" />
                ) : (
                    <button
                        onClick={props.onEnterPress}
                        className="group flex items-center justify-center w-full h-full focus:outline-none"
                        aria-label="Buscar"
                        type="button"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#A9A9A9] transition-colors duration-200 group-hover:text-primary-blue">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}


