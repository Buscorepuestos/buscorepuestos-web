import React from 'react'
import Image from 'next/image'

interface ProductTitleProps {
    title: string;
    refNumber: string;
    productName: string;
    imageSrc: string;
    isWideScreen?: boolean;
}

export default function ProductTitle({ title, refNumber, productName, imageSrc, isWideScreen } : ProductTitleProps) {
    return (
        <div className='mobile:mb-10'>
            <div className="w-full h-[2px] bg-secondary-blue mb-6 mobile:mb-2" />
            <div className='mobile:grid mobile:grid-cols-custom-layout-mobile mobile:items-center'>
                <div>
                    <div className='grid grid-cols-custom-layout mobile:flex items-center mb-0'>
                        <h1 className="lg:text-[1.5vw] md:text-[2vw] sm:text-[2.2vw] mobile:text-[4vw] font-tertiary-font font-semibold overflow-hidden truncate w-auto">
                            {title}
                        </h1>
                        {
                            !isWideScreen && (
                                <>
                                    <h1 className="text-[0.8vw] lg:text-[0.9vw] sm:text-[1.3vw] font-tertiary-font flex justify-center">
                                        <span className="ref">Ref.</span>{refNumber}
                                    </h1>
                                    <Image
                                        src={imageSrc} 
                                        alt="compartir"
                                        width={34}
                                        height={34}
                                    />
                                </>
                            )
                        }
                    </div>
                    <h1 className="lg:text-[1.2vw] md:text-[1.5vw] sm:text-[1.8vw] mobile:text-[3.4vw] font-tertiary-font font-semibold">
                        {productName}
                    </h1>
                    {
                        isWideScreen && (
                            <h1 className="text-[3vw] font-tertiary-font mt-1">
                                <span className="ref">Ref.</span>{refNumber}
                            </h1>
                        )
                    }
                </div>
                {
                    isWideScreen && (
                        <div className='flex justify-center'>
                            <Image
                                src={imageSrc} 
                                alt="compartir"
                                width={34}
                                height={34}
                            />
                        </div>
                    )
                }
            </div>
            <div className="w-full h-[2px] bg-secondary-blue mt-4" />
        </div>
    )
}
