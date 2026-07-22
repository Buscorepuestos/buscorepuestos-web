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
		<div className="font-tertiary-font text-custom-grey rounded-[20px] border-[2px] border-secondary-blue px-6 mobile:px-8 max-w-[540px] mobile:max-w-none">
			<div className="pt-4 flex justify-center text-secondary-blue font-semibold text-[18px] mobile:text-[3vw]">
				<p>Paga con la mayor comodidad</p>
			</div>
			<div className="w-[95%] m-auto h-[1.5px] mobile:h-[2px] bg-secondary-blue separator" />
			<div
				className="
                    flex mobile:flex-col justify-items-center 
                    items-center mt-4 mb-4 gap-0 text-[15px] mobile:text-[3vw]
                "
			>
                <div className='flex w-full justify-center'>
                    <div className="flex flex-col items-center gap-2 px-5 mobile:px-6 border-r-[2px] border-secondary-blue mobile:justify-center min-w-[120px] mobile:min-w-0">
                        <Image
                            src={paymentOptions[0].src}
                            alt={paymentOptions[0].alt}
                            width={paymentOptions[0].width}
                            height={paymentOptions[0].height}
                            className={paymentOptions[0].className}
                        />
                        <p>{paymentOptions[0].subtitle}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-5 mobile:px-6 border-r-[2px] border-secondary-blue mobile:border-r-0 min-w-[120px] mobile:min-w-0">
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
                <div className="hidden mobile:block w-[95%] m-auto h-[1.5px] bg-secondary-blue separator" />
                <div className='flex w-full justify-center'>
                    <div className="flex flex-col items-center gap-2 px-5 mobile:px-[3.4rem] border-r-[2px] border-secondary-blue min-w-[120px] mobile:min-w-0">
                        <Image
                            src={paymentOptions[2].src}
                            alt={paymentOptions[2].alt}
                            width={paymentOptions[2].width}
                            height={paymentOptions[2].height}
                            className={paymentOptions[2].className}
                        />
                        <p>{paymentOptions[2].subtitle}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-5 mobile:px-6 min-w-[120px] mobile:min-w-0">
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
			</div>
		</div>
	)
}

export default PaymentMethods
