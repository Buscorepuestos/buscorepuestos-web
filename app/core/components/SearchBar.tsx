// import Image from 'next/image'
// import { ChangeEvent, KeyboardEvent } from 'react'

// // 1. Añadimos la nueva prop 'onClear' a la interfaz
// interface SearchBarProps {
//     value: string;
//     onChange: (event: ChangeEvent<HTMLInputElement>) => void;
//     onClear: () => void; // <-- NUEVA PROP
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
//                 // 2. Añadimos padding a la derecha para que el texto no se monte sobre el botón
//                 className="text-title-4 flex-grow bg-transparent outline-none font-semibold pr-20" // <-- 'pr-20' AÑADIDO
//                 type="text"
//                 placeholder="Escribe lo que necesitas"
//                 style={{
//                     color: '#A9A9A9'
//                 }}
//                 value={props.value}
//                 onChange={props.onChange}
//                 onKeyDown={handleKeyDown}
//             />

//             {/* 3. Botón "Borrar" que aparece condicionalmente */}
//             {props.value && (
//                 <button
//                     onClick={props.onClear} // Llama a la función del padre
//                     className="absolute right-5 text-gray-500 hover:text-secondary-blue text-sm font-tertiary-font cursor-pointer z-10"
//                     type="button" // Es buena práctica especificar el tipo
//                 >
//                     Borrar
//                 </button>
//             )}
//         </div>
//     )
// }
import Image from 'next/image'
import { ChangeEvent, KeyboardEvent } from 'react'

// 1. Añadimos la nueva prop 'isLoading' a la interfaz
interface SearchBarProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    isLoading?: boolean; // <-- NUEVA PROP
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

    return (
        <div
            className={`${props.width} relative flex items-center bg-custom-white
                rounded-[34px] pl-8 self-center`}
            style={{
                height: props.height,
                borderColor: props.borderColor,
                borderWidth: props.borderWidth
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
                // 2. Ajustamos el padding derecho para dar espacio al loader o al botón
                className="text-title-4 flex-grow bg-transparent outline-none font-semibold pr-16" // <-- 'pr-16' AJUSTADO
                type="text"
                placeholder="Escribe lo que necesitas"
                style={{
                    color: '#A9A9A9'
                }}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={handleKeyDown}
                disabled={props.isLoading} // Opcional: deshabilita el input mientras carga
            />

            {/* 3. Lógica para mostrar el loader O el botón de borrar */}
            <div className="absolute right-5 flex items-center justify-center">
                {props.isLoading ? (
                    // Si está cargando, muestra el spinner
                    <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent border-solid rounded-full animate-spin"></div>
                ) : (
                    // Si no está cargando y hay texto, muestra el botón "Borrar"
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