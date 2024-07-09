import React from 'react'
import Image from 'next/image'

interface PaymentOption {
    src: string;
    alt: string;
    subtitle: string;
    width: number;
    height: number;
    className?: string;
}

interface Props {
    isWideScreen: boolean;
    paymentOptions: PaymentOption[];
}

const PaymentMethods: React.FC<Props> = ({ isWideScreen, paymentOptions }) => {
	return (
		<div className="font-tertiary-font text-custom-grey rounded-[20px] border-[2px] border-secondary-blue px-8 md:px-3 sm:px-3">
			<div className="flex justify-center text-secondary-blue font-semibold xl:text-[0.9vw] md:text-[1.2vw] sm:text-[1.7vw] mobile:text-[3vw]">
				<p>Paga con la mayor comodidad</p>
			</div>
			<div className="w-[95%] m-auto h-[1.5px] mobile:h-[2px] bg-secondary-blue separator" />
			<div
				className="
                    flex mobile:flex-col justify-items-center 
                    items-center mt-4 mb-4 gap-4 xl:text-[0.8vw] 
                    lg:text-[0.9vw] md:text-[1.1vw] sm:text-[1.3vw] mobile:text-[3vw]
                "
			>
                <div className='flex'>
                    <div className="flex flex-col items-center gap-3 pr-6 border-r-[2px] border-secondary-blue mobile:justify-center">
                        <Image
                            src={paymentOptions[0].src}
                            alt={paymentOptions[0].alt}
                            width={paymentOptions[0].width}
                            height={paymentOptions[0].height}
                            className={paymentOptions[0].className}
                        />
                        <p>{paymentOptions[0].subtitle}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-6 sm:border-r-[2px] sm:border-secondary-blue">
                        <Image
                            src={paymentOptions[1].src}
                            alt={paymentOptions[1].alt}
                            width={paymentOptions[1].width}
                            height={paymentOptions[1].height}
                            className={paymentOptions[1].className}
                        />
                        <p>{paymentOptions[1].subtitle}</p>
                    </div>
                </div>
                {
                    isWideScreen && (
                        <div className="w-[95%] m-auto h-[1.5px] bg-secondary-blue separator" />
                    )
                }
                <div className='flex'>
                    <div className="flex flex-col items-center gap-2 pr-6 mobile:pr-6 border-r-[2px] border-secondary-blue">
                        <Image
                            src={paymentOptions[2].src}
                            alt={paymentOptions[2].alt}
                            width={paymentOptions[2].width}
                            height={paymentOptions[2].height}
                            className={paymentOptions[2].className}
                        />
                        <p>{paymentOptions[2].subtitle}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-6 sm:border-r-[2px] sm:border-secondary-blue">
                        <Image
                            src={paymentOptions[3].src}
                            alt={paymentOptions[3].alt}
                            width={paymentOptions[3].width}
                            height={paymentOptions[3].height}
                            className={paymentOptions[3].className}
                        />
                        <p>{paymentOptions[3].subtitle}</p>
                    </div>
                </div>
                {
                    isWideScreen && (
                        <div className="w-[95%] m-auto h-[2px] bg-secondary-blue separator" />
                    )
                }
				{
                    !isWideScreen && (
                        <div className="flex flex-col items-center gap-2 mobile:justify-center">
                            <Image
                                src={paymentOptions[4].src}
                                alt={paymentOptions[4].alt}
                                width={paymentOptions[4].width}
                                height={paymentOptions[4].height}
                                className={paymentOptions[4].className}
                            />
                            <p>{paymentOptions[4].subtitle}</p>
                        </div>
                    )
                }
			</div>
            {
                isWideScreen && (
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-2 my-4 text-[3vw]">
                            <Image
                                src={paymentOptions[4].src}
                                alt={paymentOptions[4].alt}
                                width={paymentOptions[4].width}
                                height={paymentOptions[4].height}
                                className={paymentOptions[4].className}
                            />
                            <p>{paymentOptions[4].subtitle}</p>
                        </div>
                    </div>
                )
            }
		</div>
	)
}

export default PaymentMethods
