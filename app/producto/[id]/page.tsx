'use client'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@/app/redux/hooks'
import { addItemToCart } from '@/app/redux/features/shoppingCartSlice'
import Carousel from '../../core/components/carousel/carousel'
import ProductTitle from '../../core/components/productTitle/productTitle'
import SupplierRating from '../../core/components/supplierRating/supplierRating'
import ProductInfo from '../../core/components/productInfo/productInfo'
import PaymentMethod from '../../core/components/paymentMethod/paymentMethod'
import ProductPrice from '../../core/components/productPrice/productPrice'
import { useGetProductByIdQuery, useGetDistributorByIdQuery } from '../../redux/services/productService'
import '../product.css'

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

export default function Product({ params } : { params: { id: string } }) {

    const dispatch = useAppDispatch();

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

    const [isWideScreen, setIsWideScreen] = useState(false);

    const { data, error, isLoading, isFetching } = useGetProductByIdQuery({ id: params.id });
    const { data: distributorData } = useGetDistributorByIdQuery({ id: data?.distributor || '' });

    if (isLoading || isFetching) return <div>Loading...</div>
    if (error) return <div> <p>Error: {error.toString()} </p> </div>

    const buscoRepuestoPriceNew = () => {
        if (data?.buscorepuestosPrice) {
            const priceWithMarkup = data.buscorepuestosPrice * 1.3;
            const rounder = Math.ceil(priceWithMarkup / 10) * 10; 
            return rounder;
        }
    };
    const discountRounded = Math.ceil(data?.discount || 0);
    const buscoRepuestoPrice = (data?.buscorepuestosPrice || 0).toFixed(2);
    const { "Media de valoración": valoracion, Provincia } = distributorData?.data?.fields || {};

    const handleAddToCart = () => {
        if (data) {
            dispatch(addItemToCart(data));
        }
    };

    return (
        <div>
            <div className='w-full mobile:w-[100vw] mt-[4vw] mb-[2vw] grid grid-cols-2 mobile:flex mobile:flex-col gap-10 mobile:gap-0 px-[5vw] xl:px-[10vw] mobile:px-[3vw]'>
                <div>
                    {
                        isWideScreen && data &&  (
                            <div className='mobile:mb-10'>
                                <ProductTitle 
                                    title={data.title}
                                    refNumber={data.mainReference}
                                    productName={data.version}
                                    imageSrc="/COMPARTIR.svg"
                                    isWideScreen={isWideScreen}
                                />
                            </div>
                        )
                    }
                    <Carousel 
                        images={data?.images.map(image => ({ image })) || []}
                        isWideScreen={isWideScreen}
                    />
                </div>
                {
                    isWideScreen && (
                        <div className="w-full h-[2px] bg-secondary-blue mb-6 mobile:mb-[2vw]" />
                    )
                }
                <div className='bg-neutro-grey'>
                    {
                        !isWideScreen && data && (
                            <ProductTitle 
                                title={data.title}
                                refNumber={data.mainReference}
                                productName={data.version}
                                imageSrc="/COMPARTIR.svg"
                                isWideScreen={isWideScreen}
                            />
                        )
                    }
                    <div className="mt-[1.5vw] ml-10 mobile:mt-[4vw]">
                        <SupplierRating 
                            valoration={valoracion || 0} 
                            location={Provincia || ''}
                            title="Valoración del proveedor" 
                        />
                    </div>
                    <div className="mt-[1.5vw] ml-10 flex justify-center">
                        <ProductPrice
                            price={buscoRepuestoPrice}
                            shippingInfo='Envío e IVA incluido'
                            warningImgSrc='/info.svg'
                            originalPrice={buscoRepuestoPriceNew() || 0}
                            discount={discountRounded ? `${discountRounded}%` : ''}
                            button1Props={{ type: 'secondary', labelName: 'Añadir a la cesta', onClick: handleAddToCart }}
                            button2Props={{ type: 'primary', labelName: 'Comprar' }}
                        />
                    </div>
                    <div className="w-[93%] m-auto h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
                    <div>
                        {
                            data && (
                                <ProductInfo 
                                    vehicleVersion={data.version}
                                    engine={data.engine}
                                    engineCode={data.engineCode}
                                    oemReference={data.mainReference}
                                    observations={data.observations}
                                />
                            )
                        }
                    </div>
                </div>
                {
                    isWideScreen && (
                        <div className="w-full h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
                    )
                }
            </div>
            <div className='flex flex-col px-[5vw] xl:px-[10vw] mobile:px-[3vw]'>
                <div className='flex justify-end mobile:justify-center mb-6'>
                    <PaymentMethod 
                        isWideScreen={isWideScreen}
                        paymentOptions={paymentOptions}
                    />
                </div>
            </div>
        </div>
    )
}