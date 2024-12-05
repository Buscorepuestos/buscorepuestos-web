'use client'
import React from 'react'
import './contacto.css'

const page = () => {

    const handleClick = () => {
		const phoneNumber = '34611537631' // Número de teléfono de WhatsApp
		const message = '' // Mensaje predeterminado
		const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
		window.open(whatsappURL, '_blank')
	}

    return (
        <div 
            className="
                w-full mobile:w-[100vw] mt-[4vw] mb-[2vw] lg:grid lg:grid-cols-2 
                sm:flex sm:flex-col-reverse sm:justify-center mobile:flex mobile:flex-col-reverse 
                gap-10 mobile:gap-0 px-[5vw] xl:pl-[19.5vw] sm:pl-[16vw]
        ">
            <div className='font-tertiary-font'>
                <h1 className='text-title-2 mobile:text-title-3 mobile:mt-6 font-bold font-tertiary-font'>Contacta con nosotros</h1>
                <p className='mt-4 text-[2rem] mobile:text-[1.5rem]'>
                    ¿Tienes alguna duda o consulta?<br />
                    Estaremos encantados de poder ayudarte, detrás de cualquier método
                    de contacto habrá uno de nosotros esperándote.
                </p>
                <div>
                    <div className='flex items-center mt-8'>
                        <button className='flex items-center' onClick={handleClick}>
                            <img src="/telefono-azul-buscorepuestos.svg" alt="Telefono" className='w-11 h-11' />
                            <p className='ml-4 text-[1.7rem] mobile:text-[1.5rem] font-bold text-primary-blue'>+34 611 53 76 31</p>
                        </button>
                    </div>
                    <div className='flex items-center mt-4 mobile:mb-4 mobile:pl-1 mobile:gap-3'>
                        <img src="/correo-icono-buscorepuestos.svg" alt="Correo" className='w-8 h-8' />
                        <p className='ml-4 text-[1.7rem] mobile:text-[1.5rem] font-bold text-primary-blue'>
                            <a href="mailto:info@buscorepuestos.com">
                                info@buscorepuestos.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <img src="/centro-llamadas-buscorepuestos.png" alt="centro de llamadas" />
            </div>
        </div>
    )
}

export default page
