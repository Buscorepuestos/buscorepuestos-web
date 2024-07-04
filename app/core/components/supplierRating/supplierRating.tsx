import React from 'react'
import Star from '../svg/star'
import Image from 'next/image'

const MAX_VALORATION = 5

type SupplierRatingProps = {
    valoration: number;
    location?: string;
    title?: string;
};

const SupplierRating: React.FC<SupplierRatingProps> = ({ valoration, location, title }) => {
    return (
        <div className="mt-[1.5vw]">
            <div className='xl:w-[18vw] lg:w-[21vw] md:w-[24vw] sm:w-[26vw] mobile:w-[49vw] pl-[1.2vw] mobile:pl-[3vw] pr-[1vw] flex flex-col bg-custom-white border-secondary-blue border-[2px] py-1 rounded-3xl'>
                <p className="xl:text-[1.1vw] lg:text-[1.4vw] md:text-[1.5vw] sm:text-[1.7vw] mobile:text-[3.2vw] font-tertiary-font text-primary-blue font-semibold">{title}</p>
                <div className="w-full flex gap-4 mobile:gap-3 items-center mt-1 mb-3 mobile:mb-1 mobile:mt-0">
                    <Image 
                        src="/ubication.svg" 
                        alt="ubication"
                        width={22}
                        height={22}
                        className="md:w-[2vw] md:h-[2vw] sm:w-[1.9vw] sm:h-[1.9vw] mobile:w-[3.5vw] mobile:h-[3.5vw]"
                    />
                    <p className='xl:text-[1vw] lg:text-[1.2vw] md:text-[1.3vw] sm:text-[1.5vw] mobile:text-[3vw] pt-2 font-tertiary-font text-secondary-blue font-semibold'>{location}</p>
                    <div className="flex flex-row gap-4 mobile:gap-3">
                        {Array.from({ length: MAX_VALORATION }, (_, index) => (
                            <Star 
                                key={index} 
                                isFilled={index < valoration}
                                className='
                                    xl:w-[1.2vw] xl:h-[1.2vw]
                                    lg:w-[1.4vw] lg:h-[1.4vw]
                                    md:w-[1.4vw] md:h-[1.4vw]
                                    sm:w-[1.6vw] sm:h-[1.6vw]
                                    mobile:w-[3.3vw] mobile:h-[3.3vw]
                                '
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierRating
