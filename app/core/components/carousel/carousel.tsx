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
import styled, { css } from 'styled-components';

import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';

interface CarouselProps {
    images: { image: string }[];
    className?: string;
    containerStyles?: React.CSSProperties;
    imageStyles?: React.CSSProperties;
    thumbImageStyles?: React.CSSProperties;
    isWideScreen?: boolean;
}

export const convertCssProperties = (styles?: React.CSSProperties) => {
    if (!styles) return '';
    return Object.entries(styles)
        .map(([key, value]) => `${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}: ${value};`)
        .join(' ');
};

export const CarouselContainer = styled.div<{ containerStyles?: React.CSSProperties }>`
    ${(props) => props.containerStyles && css`${convertCssProperties(props.containerStyles)}`}

    width: 100%;

    .mySwiper2 {
        width: 100%;
        height: 26vw;
    }

    @media (max-width: 640px) {
        .mySwiper2 {
            height: 75vw;
        }
    }

    .mySwiper .swiper-slide {
        opacity: 0.4;
    }

    .mySwiper .swiper-slide-thumb-active {
        opacity: 1;
    }

    @media (max-width: 640px) {
        .swiper-wrapper {
            width: 85vw;
        }
    }
`;

export const CarouselImage = styled(Image)<{ imageStyles?: React.CSSProperties }>`
    ${(props) => props.imageStyles && css`${convertCssProperties(props.imageStyles)}`}
    height: 25vw;
    border-radius: 1rem;

    @media (max-width: 640px) {
        height: 65vw;
    }
`;

export const ThumbImage = styled(Image)<{ thumbImageStyles?: React.CSSProperties }>`
    ${(props) => props.thumbImageStyles && css`${convertCssProperties(props.thumbImageStyles)}`}
    height: 5.5vw;
    border-radius: 1rem;

    @media (max-width: 640px) {
        height: 10.5vw;
    }
`;

export default function Carousel(
    { 
        images, 
        className = '', 
        containerStyles, 
        imageStyles, 
        thumbImageStyles, 
        isWideScreen 
    }: CarouselProps) {

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType>();
    
    return (
        <CarouselContainer containerStyles={containerStyles} className={className}>
            <Swiper
                spaceBetween={10}
                navigation={false}
                thumbs={!isWideScreen ? { swiper: thumbsSwiper } : undefined}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                pagination={isWideScreen ? {clickable: true} : false}
                className="mySwiper2"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <CarouselImage 
                            src={image.image}
                            alt="Prueba Carousel"
                            width={800}
                            height={10}
                            imageStyles={imageStyles}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            {
                !isWideScreen && (
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <ThumbImage
                                    src={image.image}
                                    alt="Prueba Carousel"
                                    width={200}
                                    height={5}
                                    thumbImageStyles={thumbImageStyles}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )
            }
        </CarouselContainer>
    );
}