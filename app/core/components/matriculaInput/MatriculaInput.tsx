'use client'
import React, { useState } from 'react'

interface ValidadorMatriculaProps {
    productTitle: string
}

const ValidadorMatricula: React.FC<ValidadorMatriculaProps> = ({ productTitle }) => {
    const [matriculaInput, setMatriculaInput] = useState('')

    const handleValidar = () => {
        if (!matriculaInput.trim()) {
            alert('Por favor, introduce tu matrícula.')
            return
        }
        const phoneNumber = '34611537631'
        const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
        const message =
            `Hola, quiero comprobar si este repuesto es compatible con mi vehículo.\n\n` +
            `⚙️ Pieza: ${productTitle}\n` +
            `🔗 URL: ${currentUrl}\n` +
            `🚗 Matrícula: ${matriculaInput}\n\n` +
            `¿Pueden confirmarme la compatibilidad? ¡Gracias!`

        // Usar encodeURI en lugar de encodeURIComponent para preservar emojis
        const encoded = encodeURI(message)
        const url = `https://wa.me/${phoneNumber}?text=${encoded}`
        window.open(url, '_blank')
    }

    return (
        <div className="hidden mobile:block px-[4vw] mt-[4vw] mb-[3vw]">
            <div className="bg-white rounded-2xl border border-secondary-blue p-[4vw]">
                <p className="font-tertiary-font font-bold text-[3.8vw] text-dark-grey mb-[2vw]">
                    🔍 Valida la compatibilidad con tu matrícula
                </p>
                <div className="flex gap-[2vw]">
                    <div className="flex-1 relative">
                        {/* Bandera ES */}
                        <div className="absolute left-0 top-0 bottom-0 w-[10vw] bg-primary-blue rounded-l-xl flex flex-col items-center justify-center">
                            <span className="text-[2vw] text-white font-bold leading-none">🇪🇸</span>
                            <span className="text-[2vw] text-white font-bold">E</span>
                        </div>
                        <input
                            type="text"
                            placeholder="1234 ABC"
                            maxLength={8}
                            value={matriculaInput}
                            onChange={(e) => setMatriculaInput(e.target.value.toUpperCase())}
                            className="
                                w-full pl-[12vw] pr-[2vw] py-[2.5vw]
                                border-2 border-gray-200 rounded-xl
                                font-bold text-[4vw] text-dark-grey tracking-widest uppercase
                                focus:outline-none focus:border-secondary-blue
                            "
                        />
                    </div>
                    <button
                        onClick={handleValidar}
                        className="flex items-center justify-center gap-[1.5vw] px-[4vw] py-[2.5vw] bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a84f] text-white font-bold text-[3.5vw] rounded-xl flex-shrink-0 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-[4.5vw] h-[4.5vw] flex-shrink-0"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.149-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.08 4.487.711.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.855L.057 23.117a.75.75 0 00.917.908l5.438-1.453A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.95-1.354l-.354-.21-3.667.98.997-3.584-.23-.37A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                        </svg>
                        Validar
                    </button>
                </div>
                <p className="text-[2.8vw] text-gray-400 mt-[2vw]">
                    Te confirmamos si esta pieza es compatible con tu vehículo.
                </p>
            </div>
        </div>
    )
}

export default ValidadorMatricula