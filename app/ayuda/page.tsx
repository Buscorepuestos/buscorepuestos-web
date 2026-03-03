'use client'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import './ayuda.css'

const FaqAccordion = () => {
	const faqItems = [
		{
			question: '¿Cuánto tiempo tarda el envío?',
			answer: (
				<div>
					<p>El plazo de entrega depende de la ubicación del recambio:</p>
					<ul className="list-disc ml-5 mt-2 space-y-1">
						<li><strong>Tiendas Nacionales:</strong> Entre 24 y 48h laborables una vez que el vendedor confirme la preparación de la pieza.</li>
						<li><strong>Tiendas Extranjeras:</strong> Al ser envíos internacionales, el plazo estimado es de entre 7 y 10 días.</li>
					</ul>
				</div>
			),
		},
		{
			question: '¿Qué métodos de pago aceptáis?',
			answer: (
				<div>
					<ul className="list-disc ml-5 space-y-1">
						<li><strong>Tarjeta de Crédito/Débito:</strong> Pago inmediato mediante pasarela cifrada.</li>
						<li><strong>PayPal:</strong> Paga de forma segura con tu cuenta o tarjeta.</li>
						<li><strong>Pago a Plazos:</strong> Financia tu compra cómodamente con Klarna o Scalapay.</li>
						<li><strong>Bizum:</strong> Realiza tu pago al instante desde tu móvil.</li>
						<li><strong>Transferencia Bancaria:</strong> Te facilitaremos los datos al confirmar tu pedido.</li>
					</ul>
					<p className="mt-2 text-sm text-gray-500">(Todos los pagos se realizan bajo protocolos de seguridad SSL para garantizar la protección de tus datos).</p>
				</div>
			),
		},
		{
			question: '¿Dónde puedo consultar la política de devoluciones?',
			answer: (
				<span>
					Puedes consultar nuestra política de devoluciones detallada y el protocolo de
					garantías en el siguiente documento oficial:{' '}
					<a
						href="https://drive.google.com/file/d/1j5i-9hI2HJJyBrpzBDA1BAr0YmImtf7v/view?usp=sharing"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline ml-1"
					>
						Haz clic aquí para ver el PDF de Garantías.
					</a>
				</span>
			),
		},
		{
			question: '¿Tengo que pagar algo por el servicio de búsqueda?',
			answer: 'No, nuestro servicio de búsqueda es totalmente gratuito. En el precio de los artículos ya encontrarás añadido el envío a domicilio.',
		},
		{
			question: '¿Qué garantía tienen los repuestos?',
			answer: (
				<div>
					<p>
						Ofrecemos una garantía de 2 años en todos nuestros productos. Para hacerla
						efectiva, es necesario presentar la factura de montaje de un taller
						profesional 👨🏼‍🔧 que certifique la correcta instalación de la pieza.
						En caso de que el recambio sea incorrecto o presente un fallo técnico,
						la gestión de recogida y el nuevo envío son totalmente gratuitos.
					</p>
					<br />
					<p className="text-sm">
						<strong>Nota para pedidos internacionales:</strong> En el caso de piezas
						provenientes de tiendas extranjeras, es fundamental que el cliente compruebe
						el funcionamiento del recambio dentro de los primeros 14 días tras la
						recepción. Por favor, coordina cualquier incidencia con nuestro equipo
						lo antes posible dentro de este periodo.
					</p>
				</div>
			),
		},
		{
			question: '¿Si no quiero el repuesto, se podría devolver?',
			answer: (
				<div>
					<p>Sí, dispones de 14 días naturales para desistir de tu compra:</p>
					<ul className="list-disc ml-5 mt-2 space-y-1">
						<li><strong>Por error técnico o de referencia:</strong> Retiramos la pieza sin costes añadidos para ti.</li>
						<li><strong>Por otros motivos (Desistimiento voluntario):</strong> Al ser intermediarios de tiendas independientes, deberás gestionar el envío de vuelta al centro de origen. El abono se liberará una vez la tienda realice la validación técnica de la pieza.</li>
					</ul>
				</div>
			),
		},
		{
			question: '¿Cómo funciona vuestro negocio?',
			answer: 'Buscorepuestos.com es una plataforma tecnológica que te conecta con una red de tiendas independientes y centros especializados de toda Europa. Nosotros gestionamos la búsqueda, la logística y la seguridad de tu compra, actuando como intermediarios para asegurar que recibes piezas certificadas y que tu dinero está protegido hasta que el proceso de validación técnica finaliza con éxito.',
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
										className={`${open ? 'transform rotate-90' : ''
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
