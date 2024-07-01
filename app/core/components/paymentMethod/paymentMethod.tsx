import React from 'react'
import Image from 'next/image'

interface Props {
    isWideScreen: boolean;
}

const paymentMethod = (
    { isWideScreen }: Props
) => {
	return (
		<div className="font-tertiary-font text-custom-grey rounded-[20px] border-[2px] border-secondary-blue px-8 md:px-3 sm:px-3 mb-6">
			<div className="flex justify-center text-secondary-blue font-semibold xl:text-[0.9vw] md:text-[1.2vw] sm:text-[1.7vw] mobile:text-[3vw]">
				<p>Paga con la mayor comodidad</p>
			</div>
			<div className="w-[95%] m-auto h-[1.5px] mobile:h-[2px] bg-secondary-blue" />
			<div
				className="
                    flex mobile:flex-col justify-items-center 
                    items-center mt-4 mb-4 gap-4 xl:text-[0.7vw] 
                    lg:text-[1vw] md:text-[1.1vw] sm:text-[1.3vw] mobile:text-[3vw]
                "
			>
                <div className='flex'>
                    <div className="flex flex-col items-center gap-3 pr-4 border-r-[2px] border-secondary-blue mobile:justify-center">
                        <Image
                            src="/tarjeta.svg"
                            alt="tarjeta"
                            width={56}
                            height={56}
                            className="
                                xl:w-[3.4vw]
                                lg:w-[4.5vw]
                                md:w-[4.8vw]
                                sm:w-[6vw]
                                mobile:w-[12vw]
                            "
                        />
                        <p>Pago con tarjeta</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-4 sm:border-r-[2px] sm:border-secondary-blue">
                        <Image
                            src="/transferencia.svg"
                            alt="transferencia"
                            width={50}
                            height={50}
                            className="
                                xl:w-[3vw]
                                lg:w-[4vw]
                                md:w-[4.3vw]
                                sm:w-[5.5vw]
                                mobile:w-[11vw]
                            "
                        />
                        <p>Transferencia</p>
                    </div>
                </div>
                {
                    isWideScreen && (
                        <div className="w-[95%] m-auto h-[1.5px] bg-secondary-blue" />
                    )
                }
                <div className='flex'>
                    <div className="flex flex-col items-center gap-2 pr-4 mobile:pr-6 border-r-[2px] border-secondary-blue">
                        <Image
                            src="/contrareembolso.svg"
                            alt="contrareembolso"
                            width={50}
                            height={50}
                            className="
                                xl:w-[3.1vw]
                                lg:w-[4vw]
                                md:w-[4.6vw]
                                sm:w-[5.5vw]
                                mobile:w-[11vw]
                            "
                        />
                        <p>Contra reembolso</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-4 sm:border-r-[2px] sm:border-secondary-blue">
                        <Image
                            src="/bizum.svg"
                            alt="bizum"
                            width={35}
                            height={35}
                            className="
                                xl:w-[2.3vw]
                                lg:w-[3vw]
                                md:w-[3.3vw]
                                sm:w-[4vw]
                                mobile:w-[8.5vw]
                            "
                        />
                        <p>Paga con Bizum</p>
                    </div>
                </div>
                {
                    isWideScreen && (
                        <div className="w-[95%] m-auto h-[2px] bg-secondary-blue" />
                    )
                }
				{
                    !isWideScreen && (
                        <div className="flex flex-col items-center gap-2 mobile:justify-center">
                            <Image
                                src="/plazos.svg"
                                alt="plazos"
                                width={45}
                                height={45}
                                className="
                                    xl:w-[3vw]
                                    lg:w-[4vw]
                                    md:w-[4.4vw]
                                    sm:w-[5.5vw]
                                    mobile:w-[11vw]
                                "
                            />
                            <p>Pago a plazos</p>
                        </div>
                    )
                }
			</div>
            {
                isWideScreen && (
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-2 my-4 text-[3vw]">
                            <Image
                                src="/plazos.svg"
                                alt="plazos"
                                width={45}
                                height={45}
                                className="
                                    xl:w-[3vw]
                                    lg:w-[4vw]
                                    md:w-[4.4vw]
                                    sm:w-[5.5vw]
                                    mobile:w-[11vw]
                                "
                            />
                            <p>Pago a plazos</p>
                        </div>
                    </div>
                )
            }
		</div>
	)
}

export default paymentMethod
