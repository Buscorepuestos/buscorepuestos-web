'use client'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import './ayuda.css'

const FaqAccordion = () => {
	const faqItems = [
		{
			question: '¿Cuánto tiempo tarda el envío?',
			answer: `Después de que el vendedor nos confirme que tiene la pieza preparada para su envío, recibirás el repuesto en tu domicilio entre 24 y 48h laborables.`,
		},
		{
			question: '¿Dónde puedo consultar la política de devoluciones?',
			answer: (
				<>
					Puedes consultar nuestra política de devoluciones completa en el
					siguiente documento.
					<a
						href="https://drive.google.com/file/d/1zPY7RIb_UwulVHyHNmlRI1X-dYnXVl-o/view?usp=drive_link"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline ml-1"
					>
						Haz clic aquí para verla.
					</a>
				</>
			),
		},
		{
			question: '¿Tengo que pagar algo por el servicio de búsqueda?',
			answer: `No, nuestro servicio de búsqueda es totalmente gratuito. En el precio de los artículos ya encontrarás añadido el envío a domicilio.`,
		},
		{
			question: '¿Qué garantía tienen los repuestos?',
			answer: `
                En el plazo de los primeros 14 días desde la recepción podrás desistir tu compra por cualquier motivo, no te preocupes que retiraremos el artículo en el lugar de entrega sin costes añadidos.
                Después de los 14 días de desistimiento te acoges a la garantía del producto por su correcto funcionamiento. En nuestro portal ofrecemos 2 años de garantía en todos nuestros productos.
                La garantía no cubrirá aquellos gastos de instalación o montaje de los artículos comprados.
            `,
		},
		{
			question: 'Si el repuesto no me sirve. ¿Se podría devolver?',
			answer: `
                Sí, todos los artículos tienen la posibilidad de devolución en el caso de que se encuentre defectuoso o no reúna las mismas condiciones descritas por el vendedor.
                Derecho de Desistimiento: El Usuario posee el derecho a desistir de dicha compra en un plazo máximo de 14 días naturales.
            `,
		},
		{
			question: '¿Cómo funciona vuestro negocio?',
			answer: `
                Buscamos tu repuesto entre cientos de tiendas profesionales en toda España y te enviamos una propuesta de los artículos que más se adecuan a tus necesidades para que puedas comparar y elegir entre varios con las mismas especificaciones. Una vez has realizado el pago gestionamos el envío a tu domicilio.
            `,
		},
	]

	return (
		<div className="container mx-auto px-4 py-6 mt-6">
			<h2 className="flex justify-center text-title-3 font-tertiary-font font-semibold mb-10">
				Preguntas frecuentes
			</h2>
			<div className="space-y-4">
				{faqItems.map((item, index) => (
					<Disclosure key={index}>
						{({ open }) => (
							<>
								<Disclosure.Button
									className="
                                        flex text-custom-grey font-bold font-tertiary-font justify-between 
                                        w-full px-4 py-8 text-[1.7rem] mobile:text-[1.5rem] text-left bg-gray-100 rounded-lg 
                                        hover:bg-gray-200 focus:outline-none focus-visible:ring 
                                        focus-visible:ring-opacity-75 
                                    "
								>
									<span className="ml-4">
										{item.question}
									</span>
									<ChevronRightIcon
										className={`${
											open ? 'transform rotate-90' : ''
										} w-8 h-8 text-custom-grey`}
									/>
								</Disclosure.Button>
								<Disclosure.Panel
									className="
                                        px-4 font-tertiary-font pt-2 pb-4 text-gray-600 text-[1.6rem] mobile:text-[1.4rem]
                                    "
								>
									{/* Se envuelve la respuesta en un div para manejar tanto strings como JSX */}
                                    <div>{item.answer}</div>
								</Disclosure.Panel>
							</>
						)}
					</Disclosure>
				))}
			</div>
			<div className="mt-6 text-center">
				<p className="text-gray-600">
					¿Tienes más preguntas? Deja que te ayudemos.
				</p>
				<a href="/contacto" className="text-blue-500 hover:underline">
					Contacta con nosotros
				</a>
			</div>
		</div>
	)
}

export default FaqAccordion
