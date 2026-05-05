'use client'
import React, { useState } from 'react'
import Button from '../Button'

interface WarrantiesProps {
    compact?: boolean;
}

const Warranties = ({ compact = false }: WarrantiesProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal = () => setIsModalOpen(true)
    const handleCloseModal = () => setIsModalOpen(false)
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleCloseModal()
    }

    const modal = isModalOpen && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
            onClick={handleBackdropClick}
        >
            <div className="bg-white p-6 rounded-lg max-w-[90vw] w-[400px] relative">
                <button
                    className="absolute top-4 right-5 text-gray-500 hover:text-gray-800"
                    onClick={handleCloseModal}
                >
                    ✖
                </button>
                <h2 className="text-lg font-bold mb-4 text-custom-grey">Garantía y Devoluciones</h2>
                <div className="text-custom-gray lg:text-[1vw] md:text-[1.5vw] mobile:text-[3.8vw]">
                    <p>
                        Durante los primeros 14 días podrás desistir de tu compra por cualquier motivo.
                        Si la pieza es incorrecta o no funciona, la retiraremos sin costes para ti.
                        En caso de desistimiento sin causa justificada, deberás gestionar el envío
                        al centro de origen indicado.
                    </p>
                    <br />
                    <p>
                        <strong>Importante (Pedidos Internacionales):</strong> Para asegurar la validez
                        legal de la garantía internacional, el cliente dispone de 14 días naturales para
                        comprobar el funcionamiento de piezas provenientes de tiendas extranjeras.
                        Consulta con nuestro equipo las condiciones específicas para estos casos.
                    </p>
                    <br />
                    <p>
                        Tras este periodo, dispones de 2 años de garantía. Es imprescindible presentar
                        la factura de montaje de un taller profesional especializado{' '}
                        <span>👨🏼‍🔧</span>. Al activar la garantía, enviaremos un nuevo artículo o,
                        en su defecto, el reembolso tras la validación técnica de la tienda de origen.
                    </p>
                    <br />
                    <p>
                        <span>👉 </span>
                        <a
                            href="https://drive.google.com/file/d/1j5i-9hI2HJJyBrpzBDA1BAr0YmImtf7v/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            Haz clic aquí para leer la Política de Devoluciones completa en PDF
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )

    // ── MODO COMPACTO: fila clickable (para página de producto mobile) ──
    if (compact) {
        return (
            <>
                <button
                    onClick={handleOpenModal}
                    className="
                        w-full flex items-center justify-between
                        px-[2vw] py-[1vw]
                        bg-white border border-secondary-blue rounded-xl
                        active:bg-gray-50
                    "
                >
                    <div className="flex items-center gap-[2.5vw]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#12B1BB"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="flex-shrink-0"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span className="font-tertiary-font font-semibold text-[3.5vw] text-secondary-blue">
                            Ver condiciones de garantía
                        </span>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#12B1BB"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0"
                    >
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
                {modal}
            </>
        )
    }

    // ── MODO NORMAL: banner completo (home, otras páginas) ──────────────
    return (
        <div
            className="
                mb-[3vw] bg-[url(/fondo-garantia.svg)] mobile:bg-[url(/fondo-garantia-mobile.svg)] bg-cover bg-center
                py-[2vw] px-[21vw] font-tertiary-font mobile:py-[6vw] mobile:px-[7vw]
            "
        >
            <div className="flex gap-28 items-center mobile:flex-col mobile:gap-10">
                <p className="text-custom-white text-[1.2vw] mobile:text-[4vw] text-center">
                    🛡️ Garantía de 2 años. Devolución gratuita <br /> en caso de error o fallo técnico.
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
            {modal}
        </div>
    )
}

export default Warranties