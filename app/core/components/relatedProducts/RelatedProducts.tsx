'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRelatedProducts } from '../../../hooks/useRelatedProducts'

interface RelatedProductsProps {
    productId: string
    brand: string
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId, brand }) => {
    const { related, loading } = useRelatedProducts(productId)

    const brandLabel = brand
        ? brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
        : 'este vehículo'

    if (!loading && related.length === 0) return null

    return (
        <div className="hidden mobile:block mt-[2vw] mb-[10vw]">
            {/* Título */}
            <div className="px-[4vw] mb-[3vw]">
                <p className="font-tertiary-font font-bold text-[4.5vw] text-dark-grey">
                    Otras piezas para tu{' '}
                    <span className="text-secondary-blue">{brandLabel}</span>
                </p>
            </div>

            {/* Carrusel horizontal */}
            <div className="flex gap-[3vw] overflow-x-auto px-[4vw] pb-[2vw] scrollbar-hide">

                {/* Skeleton loader */}
                {loading && [1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[42vw] bg-white rounded-2xl border border-gray-200 p-[3vw] animate-pulse"
                    >
                        <div className="w-full h-[30vw] bg-gray-200 rounded-xl mb-[2vw]" />
                        <div className="h-[3vw] bg-gray-200 rounded mb-[2vw] w-3/4" />
                        <div className="h-[4vw] bg-gray-200 rounded w-1/3" />
                    </div>
                ))}

                {/* Cards reales */}
                {!loading && related.map(item => (
                    <Link
                        key={item._id}
                        href={`/producto/${item._id}`}
                        className="flex-shrink-0 w-[42vw] bg-white rounded-2xl border border-gray-200 p-[3vw] active:scale-95 transition-transform"
                    >
                        {/* Imagen */}
                        <div className="w-full h-[30vw] bg-gray-100 rounded-xl mb-[2vw] overflow-hidden relative">
                            {item.images?.[0] ? (
                                <Image
                                    src={item.images[0]}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="42vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Subcategoría */}
                        {item.subcategory && (
                            <p className="text-[2.5vw] text-secondary-blue font-semibold uppercase tracking-wide mb-[1vw]">
                                {item.subcategory}
                            </p>
                        )}

                        {/* Título */}
                        <p className="text-[2.8vw] font-semibold text-dark-grey leading-tight line-clamp-2 mb-[2vw]">
                            {item.title}
                        </p>

                        {/* Precio */}
                        <p className="text-[4.5vw] text-primary-blue font-bold">
                            {item.buscorepuestosPrice?.toFixed(2)}€
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts