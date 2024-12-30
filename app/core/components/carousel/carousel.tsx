'use client';
import React, { useState } from 'react';
import Image from 'next/image';
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

export default function Carousel({ images }: CarouselProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpandedView = () => {
        setIsExpanded(true);
        setThumbsSwiper(null);
    };

    const closeModal = () => {
        setIsExpanded(false);
        setThumbsSwiper(null); // Limpiar el estado del thumbsSwiper
    };

    return (
        <div className="carousel-container">
            {/* Main Swiper */}
            <Swiper
                spaceBetween={10}
                navigation={false}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                pagination={{ clickable: true }}
                className="mySwiper2 mainSwiper"
                onClick={toggleExpandedView}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Image
                            src={image.image}
                            alt={`Main Carousel Image ${index}`}
                            width={800}
                            height={10}
                            className="carousel-image-p"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnails */}
            <div className="mobile:hidden">
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
                                alt={`Thumbnail Carousel Image ${index}`}
                                width={200}
                                height={5}
                                className="carousel-thumb-images"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Expanded Swiper Modal */}
            {isExpanded && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center"
                    onClick={closeModal}
                >
                    <div
                        className="w-full lg:max-w-[90rem] md:max-w-[70rem]"
                        onClick={(e) => e.stopPropagation()} // Evita que el clic en el swiper cierre el modal
                    >
                        <Swiper
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs, Pagination]}
                            pagination={{ clickable: true }}
                            className="mySwiper3 mainSwiper"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <Image
                                        src={image.image}
                                        alt={`Expanded Carousel Image ${index}`}
                                        width={1200}
                                        height={15}
                                        className="carousel-image-expanded"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Thumbnails in Expanded Mode */}
                        <div className="mobile:hidden mt-4">
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                                className="mySwiper thumbsSwiper"
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <Image
                                            src={image.image}
                                            alt={`Thumbnail Expanded Image ${index}`}
                                            width={200}
                                            height={5}
                                            className="carousel-thumb-images-expanded"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
