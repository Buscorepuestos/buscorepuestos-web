import React from 'react'
import Image from 'next/image'

const paymentMethod = () => {
    return (
        <div className='font-tertiary-font rounded-[20px] border-[2px] border-secondary-blue px-8 md:px-3 sm:px-3 mb-6'>
            <div className='flex justify-center text-secondary-blue font-semibold xl:text-[0.9vw] md:text-[1.2vw] sm:text-[1.7vw]'>
                <p>Paga con la mayor comodidad</p>
            </div>
            <div className="w-[95%] m-auto h-[0.1vw] bg-secondary-blue" />
            <div className='flex justify-items-center items-center mt-4 mb-4 text-custom-grey gap-4 xl:text-[0.7vw] lg:text-[1vw] md:text-[1.1vw] sm:text-[1.3vw]'>
                <div className='flex flex-col items-center gap-3 pr-4 border-r-[2px] border-secondary-blue'>
                    <Image 
                        src='/tarjeta.svg'
                        alt='tarjeta'
                        width={56}
                        height={56}
                        className='
                            xl:w-[3.3vw]
                            lg:w-[4vw]
                            md:w-[4.8vw]
                            sm:w-[6vw]
                            mobile:w-[7vw]
                        '
                    />
                    <p>Pago con tarjeta</p>
                </div>
                <div className='flex flex-col items-center gap-2 pr-4 border-r-[2px] border-secondary-blue'>
                    <Image 
                        src='/transferencia.svg'
                        alt='transferencia'
                        width={50}
                        height={50}
                        className='
                            xl:w-[3vw]
                            lg:w-[4vw]
                            md:w-[4.3vw]
                            sm:w-[5.5vw]
                            mobile:w-[7vw]
                        '
                    />
                    <p>Transferencia</p>
                </div>
                <div className='flex flex-col items-center gap-2 pr-4 border-r-[2px] border-secondary-blue'>
                    <Image 
                        src='/contrareembolso.svg'
                        alt='contrareembolso'
                        width={50}
                        height={50}
                        className='
                            xl:w-[3vw]
                            lg:w-[4vw]
                            md:w-[4.6vw]
                            sm:w-[5.5vw]
                            mobile:w-[7vw]
                        '
                    />
                    <p>Contra reembolso</p>
                </div>
                <div className='flex flex-col items-center gap-2 pr-4 border-r-[2px] border-secondary-blue'>
                    <Image 
                        src='/bizum.svg'
                        alt='bizum'
                        width={35}
                        height={35}
                        className='
                            xl:w-[2.3vw]
                            lg:w-[3vw]
                            md:w-[3.3vw]
                            sm:w-[4vw]
                            mobile:w-[7vw]
                        '
                    />
                    <p>Paga con Bizum</p>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <Image 
                        src='/plazos.svg'
                        alt='plazos'
                        width={45}
                        height={45}
                        className='
                            xl:w-[3vw]
                            lg:w-[4vw]
                            md:w-[4.4vw]
                            sm:w-[5.5vw]
                            mobile:w-[7vw]
                        '
                    />
                    <p>Pago a plazos</p>
                </div>
            </div>
        </div>
    )
}

export default paymentMethod
