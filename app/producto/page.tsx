import React from 'react'
import Carousel from '../core/components/carousel/carousel'
import ProductTitle from '../core/components/productTitle/productTitle'

export default function Product() {

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

    return (
        <div>
            <div className='my-[4vw] grid grid-cols-2 mobile:flex mobile:flex-col gap-10 px-[5vw] xl:px-[10vw]'>
                <div className='mobile:order-2'>
                    <Carousel 
                        images={TestImages}
                    />
                </div>
                <div className='mobile:order-1'>
                <ProductTitle 
                    title="Parachoques delantero Mitsubishi Evo VIII 2004"
                    refNumber="5FG8715S52SA"
                    productName="MITSUBISHI EVO VIII 2004"
                    imageSrc="/COMPARTIR.svg"
                />
                </div>
            </div>
        </div>
    )
}
