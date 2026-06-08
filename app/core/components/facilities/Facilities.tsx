import React from 'react'
import Image from 'next/image'

interface FacilitiesProps {
    classNamePrincipal?: string;
    classNameImg?: string;
    isProductPage?: boolean;
}

const Facilities: React.FC<FacilitiesProps> = ({ classNamePrincipal, classNameImg, isProductPage }) => {

    // ── PRODUCTO PAGE: nuevo diseño 3 columnas ──────────────────────────────
    if (isProductPage) {
        return (
            <div className="w-full border-y border-secondary-blue bg-[#f0fbfc] sm:mt-[0.5rem]">
                <div className="
                grid grid-cols-3
                divide-x divide-secondary-blue
                font-tertiary-font text-secondary-blue
                py-[1vw] mobile:py-[2.5vw]
            ">
                    {/* Item 1: Referencias verificadas */}
                    <div className="flex flex-row items-center justify-center gap-[0.8vw] mobile:gap-[2vw] px-[1.5vw] mobile:px-[2.5vw]">
                        <Image
                            src="/referencias.svg"
                            alt="referencias"
                            width={28}
                            height={28}
                            className="flex-shrink-0 xl:w-[1.6vw] lg:w-[2vw] md:w-[2.5vw] sm:w-[3.2vw] mobile:w-[6vw]"
                        />
                        <p className="xl:text-[0.85vw] lg:text-[1vw] md:text-[1.2vw] sm:text-[1.4vw] mobile:text-[2.5vw] font-semibold leading-tight">
                            Referencias verificadas por expertos
                        </p>
                    </div>

                    {/* Item 2: Garantía 2 años */}
                    <div className="flex flex-row items-center justify-center gap-[0.8vw] mobile:gap-[2vw] px-[1.5vw] mobile:px-[2.5vw]">
                        <Image
                            src="/garantia.svg"
                            alt="garantia"
                            width={28}
                            height={28}
                            className="flex-shrink-0 xl:w-[1.6vw] lg:w-[2vw] md:w-[2.5vw] sm:w-[3.2vw] mobile:w-[6vw]"
                        />
                        <p className="xl:text-[0.85vw] lg:text-[1vw] md:text-[1.2vw] sm:text-[1.4vw] mobile:text-[2.5vw] font-semibold leading-tight">
                            Garantía de 2 años
                        </p>
                    </div>

                    {/* Item 3: Devoluciones gratuitas */}
                    <div className="flex flex-row items-center justify-center gap-[0.8vw] mobile:gap-[2vw] px-[1.5vw] mobile:px-[2.5vw]">
                        <Image
                            src="/devolucion.svg"
                            alt="devolucion"
                            width={28}
                            height={28}
                            className="flex-shrink-0 xl:w-[1.6vw] lg:w-[2vw] md:w-[2.5vw] sm:w-[3.2vw] mobile:w-[6vw]"
                        />
                        <p className="xl:text-[0.85vw] lg:text-[1vw] md:text-[1.2vw] sm:text-[1.4vw] mobile:text-[2.5vw] font-semibold leading-tight">
                            Devoluciones gratuitas
                        </p>
                    </div>
                </div>
            </div>
        )
    }
    // ── TIENDA / OTRAS PÁGINAS: diseño original ─────────────────────────────
    return (
        <div className={classNamePrincipal}>
            <div className={`${isProductPage ? 'mobile:gap-2' : 'mobile:gap-5'} flex items-center md:gap-4 sm:gap-1`}>
                <Image
                    src="/garantia.svg"
                    alt="garantia"
                    width={34}
                    height={34}
                    className={classNameImg}
                />
                <p className="font-normal mobile:font-bold">2 años de garantía</p>
            </div>
            <div className={`${isProductPage ? 'mobile:gap-2' : 'mobile:gap-5 mobile:hidden'} flex items-center md:gap-4 sm:gap-1`}>
                <Image
                    src="/devolucion.svg"
                    alt="devolucion"
                    width={34}
                    height={34}
                    className={classNameImg}
                />
                <p className="font-normal mobile:font-bold">devolución gratuita</p>
            </div>
            <div className="mobile:hidden flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
                <Image
                    src="/atencion.svg"
                    alt="atencion"
                    width={34}
                    height={34}
                    className={classNameImg}
                />
                <p className="font-normal mobile:font-bold">Atención al cliente 24h</p>
            </div>
            <div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
                <Image
                    src="/pago.svg"
                    alt="pago"
                    width={34}
                    height={34}
                    className={classNameImg}
                />
                <p className="font-normal mobile:font-bold">Pago a plazos</p>
            </div>
        </div>
    )
}

export default Facilities
