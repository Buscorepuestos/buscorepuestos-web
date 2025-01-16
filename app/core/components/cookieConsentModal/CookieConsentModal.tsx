// 'use client'

// import React from 'react'

// interface CookieConsentModalProps {
// 	onAccept: () => void
// 	onReject: () => void
// }

// const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
// 	onAccept,
// 	onReject,
// }) => {
// 	const handleAccept = () => {
// 		onAccept()
// 	}

// 	const handleReject = () => {
// 		onReject()
// 	}

// 	return (
// 		<div className="z-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
// 			<div className="bg-white border-2 border-primary-blue rounded-[2rem] p-4 shadow-lg w-[90%] sm:w-[600px]">
// 				<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-2">
// 					<img
// 						src="/cookies.svg"
// 						alt="Cookie"
// 						className="w-40 h-40 mx-auto mobile:w-32 mobile:h-32"
// 					/>
// 					<p className="mt-2 text-sm text-gray-600 text-center sm:text-left">
// 						Este sitio web utiliza cookies para mejorar su
// 						experiencia de navegación y proporcionar funcionalidades
// 						adicionales. Las cookies son pequeños archivos de texto
// 						que se almacenan en su dispositivo para recordar sus
// 						preferencias y ofrecerle una experiencia personalizada.
// 						Al hacer clic en &quot;Aceptar&quot;, usted acepta el
// 						uso de todas las cookies. Sin embargo, puede optar por
// 						no participar en cualquier momento configurando sus
// 						preferencias de cookies.
// 					</p>
// 				</div>
// 				<div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
// 					<button
// 						className="px-20 py-1 text-[16px] sm:text-[18px] rounded-2xl bg-secondary-blue text-white hover:bg-white hover:text-secondary-blue border-[2px] border-secondary-blue"
// 						onClick={handleAccept}
// 					>
// 						Aceptar
// 					</button>
// 					<button
// 						className="px-20 py-1 text-[16px] sm:text-[18px] rounded-2xl bg-white border-[2px] text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white"
// 						onClick={handleReject}
// 					>
// 						Rechazar
// 					</button>
// 				</div>
// 				<div className="flex justify-center">
// 					<button
// 						className="mt-4 text-sm text-secondary-blue underline"
// 						style={{ textUnderlineOffset: '8px' }}
// 						onClick={handleReject}
// 					>
// 						Política de privacidad
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default CookieConsentModal

'use client'

import React, { useState } from 'react'

interface CookieConsentModalProps {
	onAccept: () => void
	onReject: () => void
}

const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
	onAccept,
	onReject,
}) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const handleAccept = () => {
		onAccept()
	}

	const handleReject = () => {
		onReject()
	}

	const toggleExpand = () => {
		setIsExpanded(!isExpanded)
	}

	return (
		<div className="z-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white border-2 border-primary-blue rounded-[2rem] p-4 shadow-lg w-[90%] sm:w-[600px]">
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-2">
					<img
						src="/cookies.svg"
						alt="Cookie"
						className="w-40 h-40 mx-auto mobile:w-32 mobile:h-32"
					/>
					<p className="mt-2 text-sm text-gray-600 text-center sm:text-left">
						Este sitio web utiliza cookies para mejorar su
						experiencia de navegación y proporcionar funcionalidades
						adicionales. Las cookies son pequeños archivos de texto
						que se almacenan en su dispositivo para recordar sus
						preferencias y ofrecerle una experiencia personalizada.&nbsp;
						{!isExpanded && (
							<button
								className="text-sm text-secondary-blue underline"
								style={{ textUnderlineOffset: '8px' }}
								onClick={toggleExpand}
							>
								Leer más
							</button>
						)}
						{isExpanded && (
							<>
								{' '}
								Al hacer clic en &quot;Aceptar&quot;, usted
								acepta el uso de todas las cookies. Sin embargo,
								puede optar por no participar en cualquier
								momento configurando sus preferencias de
								cookies.{' '}
								{isExpanded && (
									<button
										className="mt-2 text-sm text-secondary-blue underline"
										style={{ textUnderlineOffset: '8px' }}
										onClick={toggleExpand}
									>
										Leer menos
									</button>
								)}
							</>
						)}
					</p>
				</div>

				<div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
					<button
						className="px-20 py-1 text-[16px] sm:text-[18px] rounded-2xl bg-secondary-blue text-white hover:bg-white hover:text-secondary-blue border-[2px] border-secondary-blue"
						onClick={handleAccept}
					>
						Aceptar
					</button>
					<button
						className="px-20 py-1 text-[16px] sm:text-[18px] rounded-2xl bg-white border-[2px] text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white"
						onClick={handleReject}
					>
						Rechazar
					</button>
				</div>
				<div className="flex justify-center">
					<button
						className="mt-4 text-sm text-secondary-blue underline"
						style={{ textUnderlineOffset: '8px' }}
						onClick={handleReject}
					>
						Política de privacidad
					</button>
				</div>
			</div>
		</div>
	)
}

export default CookieConsentModal
