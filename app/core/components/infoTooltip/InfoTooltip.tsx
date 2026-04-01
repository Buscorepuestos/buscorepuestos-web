// src/app/core/components/infoTooltip/InfoTooltip.tsx
'use client'

interface InfoTooltipProps {
    message: string
}

export default function InfoTooltip({ message }: InfoTooltipProps) {
    return (
        <div className="relative inline-flex items-center group">
            {/* Ícono info */}
            <button
                type="button"
                aria-label="Más información"
                className="w-4 h-4 rounded-full border border-gray-400 text-gray-400
                           hover:border-primary-blue hover:text-primary-blue
                           flex items-center justify-center text-xs font-bold
                           transition duration-200 cursor-default focus:outline-none"
            >
                i
            </button>

            {/* Tooltip */}
            <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                           w-64 px-3 py-2 rounded-lg shadow-md
                           bg-gray-800 text-white text-xs leading-snug
                           opacity-0 pointer-events-none
                           group-hover:opacity-100 group-hover:pointer-events-auto
                           transition-opacity duration-200"
            >
                {message}
                {/* Flecha apuntando hacia abajo */}
                <div className="absolute top-full left-1/2 -translate-x-1/2
                                border-4 border-transparent border-t-gray-800" />
            </div>
        </div>
    )
}