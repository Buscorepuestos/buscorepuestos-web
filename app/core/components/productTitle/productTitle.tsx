import React from 'react'
import Image from 'next/image'
import ShareButton from '../shareButton/shareButton'

interface ProductTitleProps {
	title: string
	refNumber: string
	productName: string
	imageSrc: string
}

const ProductTitle: React.FC<ProductTitleProps> = ({
	title,
	refNumber,
	productName,
	imageSrc,
}: ProductTitleProps) => {
	return (
		<div>
			<div className="w-full h-[2px] bg-secondary-blue mb-[0.6vw] mobile:mb-2" />
			<div className="mobile:grid mobile:grid-cols-custom-layout-mobile mobile:items-center sm:px-10">
				<div>
					<div className="grid grid-cols-custom-layout mobile:flex items-center mb-0 md:gap-3 sm:gap-4">
						<h1 className="lg:text-[1.3vw] md:text-[1.5vw] sm:text-[1.8vw] mobile:text-[4vw] font-tertiary-font font-extrabold overflow-hidden truncate w-auto text-dark-grey">
							{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
						</h1>
						<h2 className="mobile:hidden text-[0.8vw] lg:text-[0.9vw] sm:text-[1.3vw] font-tertiary-font flex justify-center text-dark-grey font-light">
							<span className="ref">Ref.</span>
							{refNumber}
						</h2>
						<div className='mobile:hidden'>
							<ShareButton
								imageSrc={imageSrc}
								productName={productName}
								title={title}
							/>
						</div>
					</div>
					<h2 className="lg:text-[1.1vw] md:text-[1.5vw] sm:text-[1.8vw] mobile:text-[3.4vw] font-tertiary-font font-semibold text-dark-grey uppercase mt-2">
						{productName}
					</h2>
					<h2
						className="hidden mobile:block text-[3.5vw] font-tertiary-font text-dark-grey font-normal mt-2"
						role="ref-mobile"
					>
						<span className="ref">Ref.</span>
						{refNumber}
					</h2>
				</div>
				<div className="hidden mobile:flex mobile:justify-center">
					<ShareButton
						imageSrc={imageSrc}
						productName={productName}
						title={title}
					/>
				</div>
			</div>
			<div className="w-full h-[2px] bg-secondary-blue mt-4" />
		</div>
	)
}

export default ProductTitle
