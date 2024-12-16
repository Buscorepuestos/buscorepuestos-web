import React from 'react'
import Image from 'next/image'

interface FacilitiesProps {
    classNamePrincipal?: string; 
    classNameImg?: string;
}

const Facilities: React.FC<FacilitiesProps> = ({ classNamePrincipal, classNameImg }) => {
	return (
		<div
			className={classNamePrincipal}
		>
			<div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
				<Image
					src="/garantia.svg"
					alt="garantia"
					width={34}
					height={34}
					className={classNameImg}
				/>
				<p className="md:text-[1.5vw] font-normal mobile:font-bold">2 años de garantía</p>
			</div>
			<div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
				<Image
					src="/devolucion.svg"
					alt="devolucion"
					width={34}
					height={34}
					className={classNameImg}
				/>
				<p className="md:text-[1.5vw] font-normal mobile:font-bold">devolución gratuita</p>
			</div>
			<div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
				<Image
					src="/atencion.svg"
					alt="atencion"
					width={34}
					height={34}
					className={classNameImg}
				/>
				<p className="md:text-[1.5vw] font-normal mobile:font-bold">Atencíon al cliente 24h</p>
			</div>
			<div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
				<Image
					src="/pago.svg"
					alt="pago"
					width={34}
					height={34}
					className={classNameImg}
				/>
				<p className="md:text-[1.5vw] font-normal mobile:font-bold">Pago a plazos</p>
			</div>
		</div>
	)
}

export default Facilities
