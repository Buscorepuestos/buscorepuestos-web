// import React from 'react'

// interface ProductInfoProps {
//     vehicleVersion: string;
//     engine: string;
//     engineCode: string;
//     oemReference: string;
//     observations: string;
// }

// const ProductInfo: React.FC<ProductInfoProps> = ({ vehicleVersion, engine, engineCode, oemReference, observations }: ProductInfoProps) => {
//     return (
//         <div className='flex flex-col mt-6 text-dark-grey font-tertiary-font text-[0.9vw] xl:text-[1vw] sm:text-[1.5vw] mobile:text-[2.8vw] px-10'>
//             <p className='font-semibold'>Versión del vehículo</p>
//             <p>{vehicleVersion}</p>
//             <p className='font-semibold'>Motor</p>
//             <p>{engine}</p>
//             <p className='font-semibold'>Código del motor</p>
//             <p>{engineCode}</p>
//             <p className='font-semibold'>Referencia principal OEM</p>
//             <p>{oemReference}</p>
//             <p className='font-semibold'>Observaciones</p>
//             <p className='text-justify'>
//                 {observations}
//             </p>
//         </div>
//     )
// }

// export default 
'use client'
import React, { useState } from 'react'

interface ProductInfoProps {
    vehicleVersion: string;
    engine: string;
    engineCode: string;
    oemReference: string;
    observations: string;
    vehicleBrand?: string;
    articleModel?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
    vehicleVersion,
    engine,
    engineCode,
    oemReference,
    observations,
    vehicleBrand,
    articleModel
}) => {

    const [isOpen, setIsOpen] = useState(false)

    // Contenido de las especificaciones (compartido entre móvil y desktop)
    const specsContent = (
        <div className="flex flex-col text-dark-grey font-tertiary-font">
            <p className="font-semibold">Versión del vehículo</p>
            <p>{vehicleVersion}</p>
            <p className="font-semibold mt-2">Motor</p>
            <p>{engine}</p>
            <p className="font-semibold mt-2">Código del motor</p>
            <p>{engineCode}</p>
            <p className="font-semibold mt-2">Referencia principal OEM</p>
            <p>{oemReference}</p>
            <p className="font-semibold mt-2">Observaciones</p>
            <p className="text-justify">{observations}</p>
        </div>
    )

    return (
        <>
            {/* ── MOBILE: Accordion ───────────────────────────────────────── */}
            <div className="hidden mobile:block w-full">

                {/* Banda 1: Detalles técnicos — clickable, con ícono de info */}
                <button
                    onClick={() => setIsOpen(prev => !prev)}
                    className="
                        w-full flex items-center justify-between
                        px-[4vw] py-[2vw]
                        bg-white border-b-[1px] border-secondary-blue
                        active:bg-gray-50
                    "
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center gap-[2vw]">
                        {/* Ícono de documento/lista */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#12B1BB"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="flex-shrink-0"
                        >
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                        <span className="font-tertiary-font font-bold text-[3.5vw] text-secondary-blue">
                            Ver especificaciones técnicas
                        </span>
                    </div>

                    {/* Flecha */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#12B1BB"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {/* Contenido desplegable */}
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-[4vw] py-[4vw] text-[3.2vw] bg-[#f9fefe] border-b border-secondary-blue">
                        {specsContent}
                    </div>
                </div>
            </div>

            {/* ── DESKTOP/TABLET: Layout original ─────────────────────────── */}
            <div className="mobile:hidden flex flex-col mt-6 text-dark-grey font-tertiary-font text-[0.9vw] xl:text-[1vw] sm:text-[1.5vw] px-10">
                {specsContent}
            </div>
        </>
    )
}

export default ProductInfo
