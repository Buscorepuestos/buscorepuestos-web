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
    paymentOptions: PaymentOption[];
}

const PaymentMethods: React.FC<Props> = ({ paymentOptions }) => {
	return (
		<div className="w-full border-y border-secondary-blue bg-white font-tertiary-font text-custom-grey mobile:w-[74vw] mobile:mx-auto mobile:rounded-[20px] mobile:border-[2px] mobile:px-5">
			<div className="pt-3 mobile:pt-4 flex justify-center text-secondary-blue font-semibold text-[18px] mobile:text-[3vw]">
				<p>Paga con la mayor comodidad</p>
			</div>
			<div className="w-[92%] m-auto h-[1.5px] mobile:h-[2px] bg-secondary-blue separator" />
			<div
				className="
                    flex mobile:flex-col justify-items-center 
                    items-stretch mt-3 mb-4 gap-0 text-[15px] mobile:text-[3vw]
                "
			>
                <div className='flex w-full justify-center mobile:w-full'>
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-2 mobile:px-0 mobile:py-3 mobile:min-h-[82px] border-r-[2px] border-secondary-blue mobile:justify-center min-w-0">
                        <Image
                            src={paymentOptions[0].src}
                            alt={paymentOptions[0].alt}
                            width={paymentOptions[0].width}
                            height={paymentOptions[0].height}
                            className={paymentOptions[0].className}
                        />
                        <p className="text-center leading-tight">{paymentOptions[0].subtitle}</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-2 mobile:px-0 mobile:py-3 mobile:min-h-[82px] border-r-[2px] border-secondary-blue mobile:border-r-0 min-w-0">
                        <Image
                            src={paymentOptions[1].src}
                            alt={paymentOptions[1].alt}
                            width={paymentOptions[1].width}
                            height={paymentOptions[1].height}
                            className={paymentOptions[1].className}
                        />
                        <p className="text-center leading-tight">{paymentOptions[1].subtitle}</p>
                    </div>
                </div>
                <div className="hidden mobile:block w-full m-auto h-[1.5px] bg-secondary-blue separator" />
                <div className='flex w-full justify-center mobile:w-full'>
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-2 mobile:px-0 mobile:py-3 mobile:min-h-[82px] border-r-[2px] border-secondary-blue min-w-0">
                        <Image
                            src={paymentOptions[2].src}
                            alt={paymentOptions[2].alt}
                            width={paymentOptions[2].width}
                            height={paymentOptions[2].height}
                            className={paymentOptions[2].className}
                        />
                        <p className="text-center leading-tight">{paymentOptions[2].subtitle}</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-2 mobile:px-0 mobile:py-3 mobile:min-h-[82px] min-w-0">
                        <Image
                            src={paymentOptions[3].src}
                            alt={paymentOptions[3].alt}
                            width={paymentOptions[3].width}
                            height={paymentOptions[3].height}
                            className={paymentOptions[3].className}
                        />
                        <p className="text-center leading-tight">{paymentOptions[3].subtitle}</p>
                    </div>
                </div>
			</div>
		</div>
	)
}

export default PaymentMethods
