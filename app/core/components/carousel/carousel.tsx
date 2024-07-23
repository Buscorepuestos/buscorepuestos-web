'use client'
import React, { useState } from 'react';
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import './carousel.css';

import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';

interface CarouselProps {
    images: { image: string }[];
}

export default function Carousel(
    { 
        images
    }: CarouselProps) {

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType>();
    
    return (
        <div className='carousel-container'>
            <Swiper
                spaceBetween={10}
                navigation={false}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                pagination={{clickable: true}}
                className="mySwiper2 mainSwiper"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Image 
                            src={image.image}
                            alt="Prueba Carousel"
                            width={800}
                            height={10}
                            className='carousel-image-p'
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='mobile:hidden'>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper thumbsSwiper"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image
                                src={image.image}
                                alt="Prueba Carousel"
                                width={200}
                                height={5}
                                className='carousel-thumb-images'
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}