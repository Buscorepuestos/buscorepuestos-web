import React from 'react'
import Image from 'next/image'
import Button from '../Button'

const productPrice = () => {
    return (
        <div className='flex flex-col justify-center items-center font-tertiary-font'>
            <p className='text-[32px] xl:text-[2.5vw] lg:text-[2.8vw] md:text-[3.2vw] sm:text-[3.5vw] text-primary-blue font-semibold'>
                148,12€
            </p>
            <p className='font-semibold xl:text-[1vw] sm:text-[1.8vw]'>
                Envío e IVA incluido
            </p>
            <div className='text-custom-orange gap-3 flex items-center'>
                <Image
                    src='/info.svg'
                    alt='warning'
                    width={20}
                    height={20}
                    className='sm:w-[17px] sm:h-[17px] md:w-[22px] md:h-[22px]'
                />
                <p className='text-[2.8vw] xl:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw]'>
                    Precio medio pieza original nueva:  
                    <span className='font-semibold line-through'> 200,00 € </span>
                </p>
                <p className='text-[2.8vw] xl:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw] bg-custom-orange text-custom-white rounded-2xl px-1 flex items-center'>
                    -10%
                </p>
            </div>
            <div className='flex gap-7 mt-7'>
                <Button
                    type='secondary'
                    labelName='Añadir a la cesta' 
                />
                <Button
                    type='primary'
                    labelName='Comprar'
                />
            </div>
        </div>
    )
}

export default productPrice
