'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const NotFoundInStore = () => {
	const [matricula, setMatricula] = useState('')
	const [repuesto, setRepuesto] = useState('')

	const handleWhatsAppInquiry = () => {
		if (!matricula.trim() || !repuesto.trim()) {
			alert('Por favor, completa los campos de matrícula y repuesto.')
			return
		}

		const phoneNumber = '34611537631'
		const message = `Hola, necesito ayuda para encontrar un repuesto que no encontré en la tienda online.\n\n📌 Matrícula: ${matricula}\n🔧 Repuesto / Referencia: ${repuesto}\n\n¿Me podrían ayudar a conseguirlo? ¡Gracias!`

		const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
			message
		)}`
		window.open(url, '_blank')
	}

	return (
		<div className="flex justify-center items-center my-16">
			<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200 font-tertiary-font">
				<h3 className="text-2xl font-bold text-dark-grey text-left mb-2">
					¿No encontraste lo que buscas?
				</h3>
				<p className="text-custom-grey text-left mb-4">
					Disponemos de más stock que aún no está publicado
				</p>

				<ul className="text-left mb-6 space-y-2 text-custom-grey">
					<li>🔸 Ingresa tu matrícula</li>
					<li>🔸 Cuéntanos qué repuesto buscas</li>
				</ul>

				<div className="space-y-4">
					<input
						type="text"
						value={matricula}
						onChange={(e) => setMatricula(e.target.value)}
						placeholder="Matrícula"
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
					/>
					<input
						type="text"
						value={repuesto}
						onChange={(e) => setRepuesto(e.target.value)}
						placeholder="Repuesto / Referencia"
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
					/>
				</div>

				<button
					onClick={handleWhatsAppInquiry}
					className="w-full mt-6 bg-[#25D366] text-[1.5rem] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#20bf5a] transition-colors"
				>
					<Image
						src="/whatsapp-icon.svg"
						alt="WhatsApp Icon"
						width={24}
						height={24}
					/>
					Consultar por WhatsApp
				</button>
			</div>
		</div>
	)
}

export default NotFoundInStore