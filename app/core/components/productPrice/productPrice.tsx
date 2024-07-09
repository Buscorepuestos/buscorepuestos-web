import React from 'react'
import Image from 'next/image'
import Button from '../Button'

const productPrice = () => {
    return (
        <div className='flex flex-col justify-center items-center font-tertiary-font'>
            <p className='text-[32px] text-primary-blue font-semibold'>
                148,12€
            </p>
            <p className='font-semibold'>
                Envío e IVA incluido
            </p>
            <div className='flex text-custom-orange gap-3'>
                <Image
                    src='/info.svg'
                    alt='warning'
                    width={20}
                    height={20}
                />
                <p>
                    Precio medio pieza original nueva:  
                    <span className='font-semibold line-through'> 200,00 € </span>
                </p>
                <p className='bg-custom-orange text-custom-white rounded-2xl px-1'>
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
