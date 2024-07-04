import React from 'react'
import Image from 'next/image'

interface ProductTitleProps {
    title: string;
    refNumber: string;
    productName: string;
    imageSrc: string;
}

export default function ProductTitle({ title, refNumber, productName, imageSrc } : ProductTitleProps) {
    return (
        <div className='mobile:mb-10'>
            <div className="w-full h-[3px] bg-secondary-blue mb-6" />
            <div className='grid grid-cols-custom-layout items-center mb-4'>
                <h1 className="lg:text-[1.8vw] md:text-[2vw] sm:text-[2.2vw] mobile:text-[3.5vw] font-tertiary-font font-semibold overflow-hidden truncate w-auto">
                    {title}
                </h1>
                <h1 className="text-[0.8vw] lg:text-[1vw] sm:text-[1.3vw] mobile:text-[2.5vw] font-tertiary-font flex justify-center">
                    <span className="ref">Ref.</span>{refNumber}
                </h1>
                <Image
                    src={imageSrc} 
                    alt="compartir"
                    width={34}
                    height={34}
                />
            </div>
            <h1 className="lg:text-[1.4vw] md:text-[1.5vw] sm:text-[1.8vw] font-tertiary-font font-semibold">
                {productName}
            </h1>
            <div className="w-full h-[3px] bg-secondary-blue mt-4" />
        </div>
    )
}
