// import Image from 'next/image'
// import { ChangeEvent, KeyboardEvent } from 'react'

// export default function SearchBar(props: {
// 	height?: string
// 	width?: string
// 	borderColor?: string
// 	borderWidth?: string
// 	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
// 	onEnterPress?: () => void;
// }) {

// 	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter' && props.onEnterPress) {
//             props.onEnterPress();
//         }
//     };

// 	return (
// 		<div
// 			className={`${props.width} relative flex items-center bg-custom-white
// 				rounded-[34px] pl-8 self-center`}
// 			style={{
// 				height: props.height,
// 				borderColor: props.borderColor,
// 				borderWidth: props.borderWidth
// 			}}
// 		>
// 			<Image
// 				src="/search-icon.svg"
// 				alt="icon"
// 				width={30}
// 				height={30}
// 				priority
// 				className="mr-[20px] mobile:mr-[15px]"
// 			/>
// 			<input
// 				className="text-title-4 flex-grow bg-transparent outline-none font-semibold"
// 				type="text"
// 				onChange={props.onChange}
// 				placeholder="Escribe lo que necesitas"
// 				style={{
// 					color: '#A9A9A9'
// 				}}
// 				onKeyDown={handleKeyDown}
// 			/>
// 		</div>
// 	)
// }
import Image from 'next/image'
import { ChangeEvent, KeyboardEvent } from 'react'

// Definimos una interfaz para las props para que sea más claro y escalable
interface SearchBarProps {
    value: string; // <-- AÑADIDO: El valor actual del input, controlado por el padre
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
                className="text-title-4 flex-grow bg-transparent outline-none font-semibold"
                type="text"
                placeholder="Escribe lo que necesitas"
                style={{
                    color: '#A9A9A9'
                }}
                // --- CAMBIOS CLAVE AQUÍ ---
                value={props.value}       // 1. El valor del input ahora es controlado por la prop
                onChange={props.onChange}   // 2. La función onChange del padre actualiza el estado
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}