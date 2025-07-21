// import Image from 'next/image'
// import { ChangeEvent, KeyboardEvent } from 'react'

// // Definimos una interfaz para las props para que sea más claro y escalable
// interface SearchBarProps {
//     value: string; // <-- AÑADIDO: El valor actual del input, controlado por el padre
//     onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
//                 className="text-title-4 flex-grow bg-transparent outline-none font-semibold"
//                 type="text"
//                 placeholder="Escribe lo que necesitas"
//                 style={{
//                     color: '#A9A9A9'
//                 }}
//                 // --- CAMBIOS CLAVE AQUÍ ---
//                 value={props.value}       // 1. El valor del input ahora es controlado por la prop
//                 onChange={props.onChange}   // 2. La función onChange del padre actualiza el estado
//                 onKeyDown={handleKeyDown}
//             />
//         </div>
//     )
// }

import Image from 'next/image'
import { ChangeEvent, KeyboardEvent } from 'react'

// 1. Añadimos la nueva prop 'onClear' a la interfaz
interface SearchBarProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void; // <-- NUEVA PROP
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
                // 2. Añadimos padding a la derecha para que el texto no se monte sobre el botón
                className="text-title-4 flex-grow bg-transparent outline-none font-semibold pr-20" // <-- 'pr-20' AÑADIDO
                type="text"
                placeholder="Escribe lo que necesitas"
                style={{
                    color: '#A9A9A9'
                }}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={handleKeyDown}
            />

            {/* 3. Botón "Borrar" que aparece condicionalmente */}
            {props.value && (
                <button
                    onClick={props.onClear} // Llama a la función del padre
                    className="absolute right-5 text-gray-500 hover:text-secondary-blue text-sm font-tertiary-font cursor-pointer z-10"
                    type="button" // Es buena práctica especificar el tipo
                >
                    Borrar
                </button>
            )}
        </div>
    )
}