'use client'
import React, { useEffect, useState } from 'react'
import Carousel from '../core/components/carousel/carousel'
import ProductTitle from '../core/components/productTitle/productTitle'
import SupplierRating from '../core/components/supplierRating/supplierRating'
import ProductInfo from '../core/components/productInfo/productInfo'
import PaymentMethod from '../core/components/paymentMethod/paymentMethod'
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

const vehicleVersion = 'MINI MINI 5-TRG. (F55) 2015';
const engine = 'Cooper 136CV / 100KW';
const engineCode = 'B38A15A';
const oemReference = 'BFO';
const observations = `
    Modelo especial Importado. Leo molestie per fermentum tempor porttitor, 
    nisi facilisis sodales nullam, feugiat mollis at lobortis. Curae mollis 
    vehicula facilisis non convallis leo tempor magnis nascetur eros, 
    neque hac platea sociosqu purus dignissim habitant proin. 
    Lacus vulputate inceptos facilisis vel varius tristique nascetur, 
    malesuada curabitur nec fringilla mollis cum ut, habitasse parturient 
    consequat donec montes eros. Modelo especial Importado. Leo molestie per 
    fermentum tempor porttitor, nisi facilisis sodales nullam, feugiat mollis 
    at lobortis. Curae mollis vehicula facilisis non convallis leo tempor magnis 
    nascetur eros, neque hac platea sociosqu purus dignissim habitant proin. 
    Lacus vulputate inceptos facilisis vel varius tristique nascetur, malesuada 
    curabitur nec fringilla mollis cum ut, habitasse parturient consequat donec 
    montes eros.
`;

const paymentOptions = [
    {   
        src: '/tarjeta.svg', 
        alt: 'tarjeta', 
        subtitle: 'Pago con tarjeta', 
        width: 56, 
        height: 56,
        className:`xl:w-[3.4vw] lg:w-[4.5vw] md:w-[4.8vw] sm:w-[6vw] mobile:w-[12vw]`
    },
    { 
        src: '/transferencia.svg', 
        alt: 'transferencia', 
        subtitle: 'Transferencia', 
        width: 50, 
        height: 50,
        className:`xl:w-[3vw] lg:w-[4vw] md:w-[4.3vw] sm:w-[5.5vw] mobile:w-[11vw]` 
    },
    { 
        src: '/contrareembolso.svg', 
        alt: 'contrareembolso', 
        subtitle: 'Contra reembolso', 
        width: 50, 
        height: 50,
        className:`xl:w-[3.1vw] lg:w-[4vw] md:w-[4.6vw] sm:w-[5.5vw] mobile:w-[11vw]`
    },
    { 
        src: '/bizum.svg', 
        alt: 'bizum', 
        subtitle: 'Paga con Bizum', 
        width: 35, 
        height: 35,
        className:`xl:w-[2.3vw] lg:w-[3vw] md:w-[3.3vw] sm:w-[4vw] mobile:w-[8.5vw]` 
    },
    { 
        src: '/plazos.svg', 
        alt: 'plazos', 
        subtitle: 'Pago a plazos', 
        width: 45, 
        height: 45,
        className:`xl:w-[3vw] lg:w-[4vw] md:w-[4.4vw] sm:w-[5.5vw] mobile:w-[11vw]` 
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
            <div className='mt-[4vw] mb-[2vw] grid grid-cols-2 mobile:flex mobile:flex-col gap-10 mobile:gap-0 px-[5vw] xl:px-[10vw] mobile:px-[3vw]'>
                <div>
                    {
                        isWideScreen && (
                            <ProductTitle 
                                title="Parachoques delantero Mitsubishi Evo VIII 2004"
                                refNumber="5FG8715S52SA"
                                productName="MITSUBISHI EVO VIII 2004"
                                imageSrc="/COMPARTIR.svg"
                                isWideScreen={isWideScreen}
                            />
                        )
                    }
                    <Carousel 
                        images={TestImages}
                        isWideScreen={isWideScreen}
                    />
                </div>
                {
                    isWideScreen && (
                        <div className="w-full h-[2px] bg-secondary-blue mb-6 mobile:mb-[2vw]" />
                    )
                }
                <div>
                    {
                        !isWideScreen && (
                            <ProductTitle 
                                title="Parachoques delantero Mitsubishi Evo VIII 2004"
                                refNumber="5FG8715S52SA"
                                productName="MITSUBISHI EVO VIII 2004"
                                imageSrc="/COMPARTIR.svg"
                                isWideScreen={isWideScreen}
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
                    <div className="w-full h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
                    <div>
                        <ProductInfo 
                            vehicleVersion={vehicleVersion}
                            engine={engine}
                            engineCode={engineCode}
                            oemReference={oemReference}
                            observations={observations}
                        />
                    </div>
                </div>
                {
                    isWideScreen && (
                        <div className="w-full h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
                    )
                }
            </div>
            <div className='flex flex-col px-[5vw] xl:px-[10vw] mobile:px-[3vw]'>
                <div className='flex justify-end mobile:justify-center'>
                    <PaymentMethod 
                        isWideScreen={isWideScreen}
                        paymentOptions={paymentOptions}
                    />
                </div>
            </div>
        </div>
    )
}