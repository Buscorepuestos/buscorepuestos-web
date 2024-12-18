// 'use client'
// import React, { useState } from 'react'
// import Button from '../Button'

// const Warranties = () => {
// 	const [isModalOpen, setIsModalOpen] = useState(false)

// 	const handleOpenModal = () => {
// 		setIsModalOpen(true)
// 	}

// 	const handleCloseModal = () => {
// 		setIsModalOpen(false)
// 	}
// 	return (
// 		<div
// 			className="
// 					mb-[3vw] bg-[url(/fondo-garantia.svg)] mobile:bg-[url(/fondo-garantia-mobile.svg)] bg-cover bg-center
// 					py-[2vw] px-[21vw] font-tertiary-font mobile:py-[6vw] mobile:px-[10vw]
// 				"
// 		>
// 			<div className="flex gap-28 items-center mobile:flex-col mobile:gap-10">
// 				<p className="text-custom-white text-[1.2vw] mobile:text-[4vw]">
// 					En el plazo de 14 dias retiraremos tus <br />
// 					devoluciones en el mismo lugar de entrega sin <br />
// 					ningún coste añadido.
// 				</p>
// 				<Button
// 					type="secondary"
// 					labelName="Ver garantías"
// 					bg="bg-custom-white"
// 					hoverBg="hover:bg-secondary-blue"
// 					textColor="text-secondary-blue"
// 					hoverText="hover:text-custom-white"
// 					height="xl:h-[2.8vw] lg:h-[3.5vw] md:h-[3.8vw] sm:h-[4.5vw] mobile:h-[9vw]"
// 					xpadding="px-4"
//                     onClick={handleOpenModal}
// 				/>
// 			</div>
// 			{isModalOpen && (
// 				<div
// 					className="
//                     fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10
//                 "
// 				>
// 					<div className="bg-white p-6 rounded-lg max-w-[90vw] w-[400px]">
// 						<h2 className="text-lg font-bold mb-4 text-custom-grey">
// 							Garantías
// 						</h2>
// 						<div className="text-custom-gray">
//                             <p>
//                                 En el plazo de los primeros 14 días desde la
//                                 recepción podrás desistir tu compra por
//                                 cualquier motivo, no te preocupes que
//                                 retiraremos el artículo en el lugar de entrega
//                                 sin costes añadidos. Para evitar posibles abusos
//                                 de nuestras garantías se estudiará cada
//                                 devolución de forma individual pudiendo exigir
//                                 los portes de envío en caso de detectar malas
//                                 prácticas.
//                             </p>
//                             < br />
//                             <p>
//                                 Después de los 14 días de desistimiento te
//                                 acoges a la garantía del producto por su
//                                 correcto funcionamiento. En nuestro portal
//                                 ofrecemos 2 años de garantía en todos nuestros
//                                 productos, deberás presentar una factura de la
//                                 correcta instalación de la pieza por un
//                                 profesional especializado.
//                             </p>
//                             < br />
//                             <p>
//                                 Al hacer uso de la garantía enviaremos un nuevo
//                                 artículo con las mismas características. En el
//                                 caso de no disponer de otro, se hará la
//                                 devolución del valor pagado.
//                             </p>
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	)
// }

// export default Warranties

'use client'
import React, { useState } from 'react'
import Button from '../Button'

const Warranties = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleOpenModal = () => {
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const handleBackdropClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (e.target === e.currentTarget) {
			handleCloseModal()
		}
	}

	return (
		<div
			className="
        mb-[3vw] bg-[url(/fondo-garantia.svg)] mobile:bg-[url(/fondo-garantia-mobile.svg)] bg-cover bg-center
        py-[2vw] px-[21vw] font-tertiary-font mobile:py-[6vw] mobile:px-[10vw]
      "
		>
			<div className="flex gap-28 items-center mobile:flex-col mobile:gap-10">
				<p className="text-custom-white text-[1.2vw] mobile:text-[4vw]">
					En el plazo de 14 días retiraremos tus <br />
					devoluciones en el mismo lugar de entrega sin <br />
					ningún coste añadido.
				</p>
				<Button
					type="secondary"
					labelName="Ver garantías"
					bg="bg-custom-white"
					hoverBg="hover:bg-secondary-blue"
					textColor="text-secondary-blue"
					hoverText="hover:text-custom-white"
					height="xl:h-[2.8vw] lg:h-[3.5vw] md:h-[3.8vw] sm:h-[4.5vw] mobile:h-[9vw]"
					xpadding="px-4"
					onClick={handleOpenModal}
				/>
			</div>
			{isModalOpen && (
				<div
					className="
            fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10
          "
					onClick={handleBackdropClick} // Detecta clics en el fondo
				>
					<div className="bg-white p-6 rounded-lg max-w-[90vw] w-[400px] relative">
						{/* Botón de cierre */}
						<button
							className="absolute top-4 right-5 text-gray-500 hover:text-gray-800"
							onClick={handleCloseModal}
						>
							✖
						</button>

						<h2 className="text-lg font-bold mb-4 text-custom-grey">
							Garantías
						</h2>
						<div className="text-custom-gray lg:text-[1vw] md:text-[1.5vw] mobile:text-[4vw]">
							<p>
								En el plazo de los primeros 14 días desde la
								recepción podrás desistir tu compra por
								cualquier motivo, no te preocupes que
								retiraremos el artículo en el lugar de entrega
								sin costes añadidos. Para evitar posibles abusos
								de nuestras garantías se estudiará cada
								devolución de forma individual pudiendo exigir
								los portes de envío en caso de detectar malas
								prácticas.
							</p>
							<br />
							<p>
								Después de los 14 días de desistimiento te
								acoges a la garantía del producto por su
								correcto funcionamiento. En nuestro portal
								ofrecemos 2 años de garantía en todos nuestros
								productos, deberás presentar una factura de la
								correcta instalación de la pieza por un
								profesional especializado.
							</p>
							<br />
							<p>
								Al hacer uso de la garantía enviaremos un nuevo
								artículo con las mismas características. En el
								caso de no disponer de otro, se hará la
								devolución del valor pagado.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Warranties
