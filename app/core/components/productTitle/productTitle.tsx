import React from 'react'
import Image from 'next/image'

interface ProductTitleProps {
    title: string;
    refNumber: string;
    productName: string;
    imageSrc: string;
}

const ProductTitle: React.FC<ProductTitleProps> = ({ title, refNumber, productName, imageSrc } : ProductTitleProps) => {
    return (
        <div>
            <div className="w-full h-[2px] bg-secondary-blue mb-[0.6vw] mobile:mb-2" />
            <div className='mobile:grid mobile:grid-cols-custom-layout-mobile mobile:items-center sm:px-10'>
                <div>
                    <div className='grid grid-cols-custom-layout mobile:flex items-center mb-0 md:gap-3 sm:gap-4'>
                        <h1 className="lg:text-[1.5vw] md:text-[2vw] sm:text-[2.2vw] mobile:text-[4vw] font-tertiary-font font-semibold overflow-hidden truncate w-auto">
                            {title}
                        </h1>
                        <h2 className="mobile:hidden text-[0.8vw] lg:text-[0.9vw] sm:text-[1.3vw] font-tertiary-font flex justify-center">
                            <span className="ref">Ref.</span>{refNumber}
                        </h2>
                        <Image
                            src={imageSrc} 
                            alt="compartir-desktop"
                            width={34}
                            height={34}
                            className='md:w-[30px] md:h-[30px] mobile:hidden'
                        />
                    </div>
                    <h2 className="lg:text-[1.2vw] md:text-[1.5vw] sm:text-[1.8vw] mobile:text-[3.4vw] font-tertiary-font font-semibold">
                        {productName}
                    </h2>
                    <h2 className="hidden mobile:block text-[3vw] font-tertiary-font mt-1" role='ref-mobile'>
                        <span className="ref">Ref.</span>{refNumber}
                    </h2>
                </div>
                <div className='hidden mobile:flex mobile:justify-center'>
                    <Image
                        src={imageSrc} 
                        alt="compartir"
                        width={34}
                        height={34}
                    />
                </div>
            </div>
            <div className="w-full h-[2px] bg-secondary-blue mt-4" />
        </div>
    )
}

export default ProductTitle
