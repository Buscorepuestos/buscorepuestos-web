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
import Image from 'next/image'
import { ChangeEvent, KeyboardEvent } from 'react'

interface SearchBarProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
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

    // Función para detectar si es una búsqueda por referencia
    const isReferenceSearch = (term: string): boolean => {
        if (!term) return false;
        const trimmed = term.trim();
        
        // Debe tener al menos 6 caracteres para considerarse referencia
        if (trimmed.length < 6) return false;
        
        // Patrones comunes de referencias:
        // 1. Solo números (ej: 9661087080, 123456)
        const onlyNumbers = /^\d{6,}$/;
        
        // 2. Mezcla de letras y números con predominancia de números
        const mixedWithNumbers = /^[A-Za-z0-9\-\.]+$/;
        const hasNumbers = /\d/;
        const hasLetters = /[A-Za-z]/;
        
        // 3. Patrones específicos con guiones/puntos
        const specificPatterns = /^[A-Za-z0-9]+[\-\.][A-Za-z0-9]+/;
        
        if (onlyNumbers.test(trimmed)) {
            return true; // Solo números largos
        }
        
        if (specificPatterns.test(trimmed)) {
            return true; // Patrones con separadores
        }
        
        // Para mezclas de letras y números, debe tener ambos y no ser solo una palabra
        if (mixedWithNumbers.test(trimmed) && hasNumbers.test(trimmed) && hasLetters.test(trimmed)) {
            // Verificar que no sea una palabra común (debe tener un buen balance de números)
            const numberCount = (trimmed.match(/\d/g) || []).length;
            const letterCount = (trimmed.match(/[A-Za-z]/g) || []).length;
            
            // Al menos 30% deben ser números para considerarse referencia
            return (numberCount / trimmed.length) >= 0.3;
        }
        
        return false;
    };

    // Determinar el placeholder dinámico
    const getPlaceholder = (): string => {
        if (props.value && isReferenceSearch(props.value)) {
            return "Buscando por referencia...";
        }
        return "Escribe lo que necesitas";
    };

    // Determinar el color del borde dinámicamente
    const getBorderColor = (): string => {
        if (props.value && isReferenceSearch(props.value)) {
            return '#10B981'; // Verde para indicar búsqueda por referencia
        }
        return props.borderColor || '#12B1BB';
    };

    return (
        <div
            className={`${props.width} relative flex items-center bg-custom-white
                rounded-[34px] pl-8 self-center transition-all duration-200`}
            style={{
                height: props.height,
                borderColor: getBorderColor(),
                borderWidth: props.borderWidth,
                boxShadow: props.value && isReferenceSearch(props.value) 
                    ? '0 0 0 1px rgba(16, 185, 129, 0.2)' 
                    : 'none'
            }}
        >
            <Image
                src="/search-icon.svg"
                alt="icon"
                width={30}
                height={30}
                priority
                className="mr-[20px] mobile:mr-[15px]"
            />
            
            <input
                className="text-title-4 flex-grow bg-transparent outline-none font-semibold pr-16"
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

            {/* Indicador de tipo de búsqueda */}
            {props.value && !props.isLoading && (
                <div className="absolute right-20 flex items-center">
                    {isReferenceSearch(props.value) && (
                        <span className="text-xs text-green-600 font-semibold bg-green-50 px-4 py-1 rounded-full">
                            REF
                        </span>
                    )}
                </div>
            )}

            {/* Loader o botón de borrar */}
            <div className="absolute right-5 flex items-center justify-center">
                {props.isLoading ? (
                    <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent border-solid rounded-full animate-spin"></div>
                ) : (
                    props.value && (
                        <button
                            onClick={props.onClear}
                            className="text-gray-500 hover:text-secondary-blue text-sm font-tertiary-font cursor-pointer z-10"
                            type="button"
                        >
                            Borrar
                        </button>
                    )
                )}
            </div>
        </div>
    )
}