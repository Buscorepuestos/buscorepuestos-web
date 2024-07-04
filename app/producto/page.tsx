import React from 'react'
import Carousel from '../core/components/carousel/carousel'

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
        <div className='my-[4vw] grid grid-cols-2 mobile:flex mobile:flex-col gap-10 px-[5vw] xl:px-[10vw]'>
            <div>
                <Carousel 
                    images={TestImages}
                />
            </div>
            <div>
                <h1>Product 2</h1>
            </div>
        </div>
    )
}
