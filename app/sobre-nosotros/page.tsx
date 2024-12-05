'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import './sobre-nosotros.css'

const Page = () => {
	const sliderRef = useRef<HTMLDivElement | null>(null)
	const isDragging = useRef(false)
	const startPosition = useRef(0)

	// Funciones del slider
	const startDragging = (event: React.MouseEvent) => {
		isDragging.current = true
		startPosition.current = event.clientX
	}

	const stopDragging = () => {
		isDragging.current = false
	}

	const moveEvent = (event: React.MouseEvent) => {
		if (!isDragging.current || !sliderRef.current) return
		const diff = startPosition.current - event.clientX
		sliderRef.current.scrollLeft += diff
		startPosition.current = event.clientX
	}

	return (
		<div className="container mx-auto px-4 py-6 mt-6">
			<article>
				<h1 className="font-tertiary-font text-title-3 font-bold flex justify-center ">
					Sobre nosotros
				</h1>
				<div className="mt-4">
					<p className="text-center m-auto font-tertiary-font max-w-fit">
						Conlleva mucho tiempo y conocimientos localizar un
						repuesto
						<br />
						para un coche tanto de manera online como offline.
						<br />
						La razón por la que ha nacido nuestro portal
						BuscoRepuestos.com
						<br />
						es lograr ayudar a que cualquier persona pueda consultar
						<br />
						repuestos para su vehículo lo más rápido, fácil y
						pudiendo comparar varios precios
						<br />
						sin necesidad de grandes conocimientos en el ámbito.
					</p>
				</div>
			</article>
			<article>
				<h1 className="font-tertiary-font text-title-3 font-bold flex justify-center mt-4">
					Nuestro equipo
				</h1>
				<div className="flex justify-center mobile:flex-col gap-32 mobile:gap-16 w-full px-4 m-auto mt-8 font-tertiary-font">
					<div>
						<div className="rounded-xl shadow-inner">
							<div className="px-4 py-4">
								<p className="text-dark-grey font-bold">CEO</p>
								<p className="font-bold">Manuel Perez</p>
							</div>
							<Image
								src="/manuel-perez.jpg"
								alt="manuel perez"
								width={300}
								height={300}
								className="rounded-br-xl rounded-bl-xl mobile:w-full"
							/>
						</div>
						<div className="mt-6">
							<p className="font-bold">
								&quot;Sistema de transmisión&quot;.
								<br />
							</p>
							<p className='text-sm'>
								Hace optimizar el manejo del vehículo <br /> y
								lo mantiene en sincronía.
							</p>
							<a href="https://www.linkedin.com/in/manuel-p%C3%A9rez-ortega-4998771b1/">
								<Image
									src="/linkedin-color-buscorepuestos.svg"
									alt="linkedin"
									width={70}
									height={70}
								/>
							</a>
						</div>
					</div>
					<div>
						<div className="rounded-xl shadow-inner">
							<div className="px-4 py-4">
								<p className="text-dark-grey font-bold">COO</p>
								<p className="font-bold">Juan David Torres</p>
							</div>
							<Image
								src="/juan-david-torres.jpg"
								alt="juan david torres"
								width={300}
								height={300}
								className="rounded-br-xl rounded-bl-xl mobile:w-full"
							/>
						</div>
						<div className="mt-6">
							<p className="font-bold">&quot;El motor&quot;.</p>
							<p className='text-sm'>
								El corazón de nuestra plataforma, <br />
								encargado de cada artículo publicado <br /> en 
								nuestra web y el correcto filtrado <br /> de los
								colaboradores.
							</p>
							<a href="https://www.linkedin.com/in/juan-david-torres-valencia-7b4948205/">
								<Image
									src="/linkedin-color-buscorepuestos.svg"
									alt="Linkedin"
									width={70}
									height={70}
								/>
							</a>
						</div>
					</div>
				</div>
			</article>
			<article>
				<h1 className="font-tertiary-font text-title-3 font-bold flex justify-center mt-8 mb-16">
					Nuestros valores
				</h1>
                <div
                    className="flex mobile:flex-col gap-36 mobile:gap-16 justify-center text-center ml-auto mt-8 font-tertiary-font"
                >
                    <div className='flex flex-col items-center rounded-xl shadow-2xl px-4 py-4'>
                        <Image 
                            src={'/usabilidad-icono-buscorepuestos.svg'}
                            alt="usabilidad"
                            width={40}
                            height={40}
                        />
                        <p className='font-bold mt-6 mb-6'>
                            Usabilidad
                        </p>
                        <p>
                            Cada día dedicamos recursos para que nuestra
                            plataforma sea más intuitiva y fácil de usar.
                        </p>
                    </div>
                    <div className='flex flex-col justify-center items-center rounded-xl shadow-2xl px-4 py-4'>
                        <Image 
                            src={'/seguridad-icono-buscorepuestos.svg'}
                            alt="seguridad"
                            width={40}
                            height={40}
                        />
                        <p className='font-bold mt-6 mb-6'>
                            Seguridad
                        </p>
                        <p>
                            Creemos que la transparencia es vital <br /> en un entorno
                            digital, por ello disponemos de <br /> varios canales de
                            contacto como llamada, whatsapp, correo electrónico
                            y desde la propia plataforma web.
                        </p>
                    </div>
                    <div className='flex flex-col justify-center items-center rounded-xl shadow-2xl px-4 py-4'>
                        <Image 
                            src={'/profesionalidad-icono-buscorepuestos.svg'}
                            alt="profesionalidad"
                            width={40}
                            height={40}
                        />
                        <p className='font-bold mt-6 mb-6'>
                            Profesionalidad
                        </p>
                        <p>
                            Ponemos a disposición de nuestros usuarios <br /> un equipo
                            de recambistas especializados para <br /> entregar
                            resultados precisos y filtrar  colaboradores que no
                            cumplan con nuestra política de garantías.
                        </p>
                    </div>
                </div>
			</article>
		</div>
	)
}

export default Page
