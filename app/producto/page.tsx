'use client'
import React, { useEffect, useState } from 'react'
import Carousel from '../core/components/carousel/carousel'
import ProductTitle from '../core/components/productTitle/productTitle'
import SupplierRating from '../core/components/supplierRating/supplierRating'
import './product.css'

const TestImages = [
    {
        image: '/faro1.jpg',
    },
    {
        image: '/faro2.jpg',
    },
    {
        image: '/faro3.jpg',
    },
    {
        image: '/faro4.jpg',
    },
    {
        image: '/faro5.jpg',
    },
]

export default function Product() {

    const [isWideScreen, setIsWideScreen] = useState(false);

    useEffect(() => {
		const handleResize = () => {
			setIsWideScreen(window.innerWidth < 640);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

    return (
        <div>
            <div className='my-[4vw] grid grid-cols-2 mobile:flex mobile:flex-col gap-10 px-[5vw] xl:px-[10vw]'>
                <div>
                    {
                        isWideScreen && (
                            <ProductTitle 
                                title="Parachoques delantero Mitsubishi Evo VIII 2004"
                                refNumber="5FG8715S52SA"
                                productName="MITSUBISHI EVO VIII 2004"
                                imageSrc="/COMPARTIR.svg"
                            />
                        )
                    }
                    <Carousel 
                        images={TestImages}
                    />
                </div>
                <div>
                    {
                        !isWideScreen && (
                            <ProductTitle 
                                title="Parachoques delantero Mitsubishi Evo VIII 2004"
                                refNumber="5FG8715S52SA"
                                productName="MITSUBISHI EVO VIII 2004"
                                imageSrc="/COMPARTIR.svg"
                            />
                        )
                    }
                    <div>
                        <SupplierRating 
                            valoration={4} 
                            location="Huelva" 
                            title="Valoración del proveedor" 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
