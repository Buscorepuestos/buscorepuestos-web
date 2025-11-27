'use client'

import React, { useState } from 'react'

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
		<div className="flex justify-center items-center mb-8">
			<div className="w-full max-w-[35rem] bg-white p-8 rounded-2xl shadow-lg border border-gray-200 font-tertiary-font">
				<p className="text-2xl font-bold text-dark-grey mb-2 mobile:text-[5vw] text-center">
					¿No encontraste lo que buscasbas?
				</p>
				<p className="text-custom-grey text-center mb-4 mobile:text-[3.5vw]">
					Tenemos más piezas disponibles que aún no están publicadas. Escríbenos y te ayudaremos a encontrar el repuesto exacto.
				</p>
				{/* <ul className="text-left mb-6 space-y-2 text-custom-grey">
					<li>🔸 Ingresa tu matrícula</li>
					<li>🔸 Cuéntanos qué repuesto buscas</li>
				</ul> */}

				<div className="space-y-4 mt-[2.5rem]">
					<div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-3 bg-white">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">

							<path d="M4 3a2 2 0 00-2 2v9a1 1 0 001 1h1v2a1 1 0 001.707.707L7.414 15h5.172l1.707 1.707A1 1 0 0016 17v-2h1a1 1 0 001-1V5a2 2 0 00-2-2H4z" />

						</svg>
						<input
							type="text"
							value={matricula}
							onChange={(e) => setMatricula(e.target.value)}
							placeholder="Matrícula del vehículo"
							className="w-full text-sm outline-none text-gray-700 border-gray-300 rounded-lg"
						/>
					</div>
					<div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-5 bg-white">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">

							<path d="M11.983 1.343a1 1 0 00-1.966 0L9.308 4H5a1 1 0 100 2h3.308l.709 2H5a1 1 0 100 2h4.017l.709 2H5a1 1 0 100 2h4.017l.709 2H5a1 1 0 100 2h5a1 1 0 00.983-.829L12.692 16H17a1 1 0 100-2h-3.308l-.709-2H17a1 1 0 100-2h-4.017l-.709-2H17a1 1 0 100-2h-4.017l-.709-2H17a1 1 0 100-2h-5.017l-.709-2z" />

						</svg>
						<input
							type="text"
							value={repuesto}
							onChange={(e) => setRepuesto(e.target.value)}
							placeholder="Repuesto o referencia"
							className="w-full text-sm outline-none text-gray-700 border-gray-300 rounded-lg"
						/>
					</div>
				</div>

				<button
					onClick={handleWhatsAppInquiry}
					className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors mb-3 mt-5"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">

						<path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.149-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.08 4.487.711.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />

					</svg>
					<p className='mobile:text-[3.5vw] text-[1.5rem]'>
						Consultar ahora por WhatsApp
					</p>
				</button>

				<p className="text-[1.1rem] text-gray-500 flex items-center justify-center gap-1">

					<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">

						<path d="M10 2a8 8 0 00-8 8v5a2 2 0 002 2h12a2 2 0 002-2v-5a8 8 0 00-8-8zM9 10a1 1 0 012 0v2a1 1 0 11-2 0v-2z" />

					</svg>

					Tu consulta es 100% confidencial y sin compromiso.

				</p>
			</div>
		</div>
	)
}

export default NotFoundInStore