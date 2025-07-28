import React from 'react'
import Image from 'next/image'

interface FacilitiesProps {
    classNamePrincipal?: string; 
    classNameImg?: string;
	isProductPage?: boolean;
}

const Facilities: React.FC<FacilitiesProps> = ({ classNamePrincipal, classNameImg, isProductPage }) => {
	return (
		<div
			className={classNamePrincipal}
		>
			<div className={` ${isProductPage ? 'mobile:gap-2' : 'mobile:gap-5'} flex items-center md:gap-4 sm:gap-1 `}>
				<Image
					src="/garantia.svg"
					alt="garantia"
					width={34}
					height={34}
					className={classNameImg}
				/>
				<p className={` ${isProductPage && 'mobile:text-[3vw] lg:text-[1vw] md:text-[1.5vw]' } font-normal mobile:font-bold`}>2 años de garantía</p>
			</div>
			<div className={` ${isProductPage ? 'mobile:gap-2' : 'mobile:gap-5 mobile:hidden'} flex items-center md:gap-4 sm:gap-1 `}>
				<Image
					src="/devolucion.svg"
					alt="devolucion"
					width={34}
					height={34}
					className={classNameImg}
				/>
				<p className={` ${isProductPage && 'mobile:text-[3vw] lg:text-[1vw] md:text-[1.5vw]' } font-normal mobile:font-bold`}>devolución gratuita</p>
			</div>
			<div className={` ${isProductPage && 'mobile:hidden'} mobile:hidden flex items-center md:gap-4 sm:gap-1 mobile:gap-5`}>
				<Image
					src="/atencion.svg"
					alt="atencion"
					width={34}
					height={34}
					className={classNameImg}
				/>
				<p className={` ${isProductPage && 'lg:text-[1vw] md:text-[1.5vw] '} font-normal mobile:font-bold `}>Atencíon al cliente 24h</p>
			</div>
			<div className={` ${isProductPage && 'mobile:hidden'} flex items-center md:gap-4 sm:gap-1 mobile:gap-5`}>
				<Image
					src="/pago.svg"
					alt="pago"
					width={34}
					height={34}
					className={classNameImg}
				/>
				<p className={` ${isProductPage && 'lg:text-[1vw] md:text-[1.5vw]'} font-normal mobile:font-bold `}>Pago a plazos</p>
			</div>
		</div>
	)
}

export default Facilities
