'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import './carousel.css';
import { FreeMode, Navigation, Thumbs, Pagination, Zoom } from 'swiper/modules';

interface CarouselProps {
    images: { image: string }[];
}

export default function Carousel({ images }: CarouselProps) {
    const swiperRef = useRef<SwiperType | null>(null);
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
                zoom={{ maxRatio: 3, minRatio: 1 }}
                spaceBetween={10}
                navigation={false}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Pagination, Zoom]}
                pagination={{ clickable: true }}
                className="mySwiper2 mainSwiper"
                onClick={toggleExpandedView}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className="swiper-zoom-container">
                            <Image
                                src={image.image}
                                alt={`Main Carousel Image ${index}`}
                                width={800}
                                height={10}
                                className="carousel-image-p"
                            />
                        </div>
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
                    {/* Botón X — zona oscura superior derecha */}
                    <button
                        className="absolute top-[18rem] left-4 z-20 text-white bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-70 transition"
                        onClick={(e) => { e.stopPropagation(); closeModal(); }}
                        aria-label="Cerrar imagen"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div
                        className="w-full lg:max-w-[90rem] md:max-w-[70rem] relative"
                        onClick={(e) => e.stopPropagation()} // Evita que el clic en el swiper cierre el modal
                    >
                        {/* Franja izquierda */}
                        <div
                            className="
                                absolute left-0 top-0 h-full w-16 z-10
                                flex items-center justify-center cursor-pointer
                                bg-transparent
                                hover:bg-white/10 active:bg-white/20
                                transition-all duration-200
                                group
                            "
                            onClick={() => swiperRef.current?.slidePrev()}
                        >
                            <div className="
                                bg-black/40 rounded-full p-2
                                group-hover:bg-black/70 group-hover:scale-110
                                transition-all duration-200
                            ">
                                <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-200"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Franja derecha */}
                        <div
                            className="
                                absolute right-0 top-0 h-full w-16 z-10
                                flex items-center justify-center cursor-pointer
                                bg-transparent
                                hover:bg-white/10 active:bg-white/20
                                transition-all duration-200
                                group
                            "
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            <div className="
                                bg-black/40 rounded-full p-2
                                group-hover:bg-black/70 group-hover:scale-110
                                transition-all duration-200
                            ">
                                <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-200"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <Swiper
                            zoom={{ maxRatio: 3, minRatio: 1 }}
                            onSwiper={(swiper) => { swiperRef.current = swiper; }}
                            spaceBetween={10}
                            navigation={false}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs, Pagination, Zoom]}
                            pagination={{ clickable: true }}
                            className="mySwiper3 mainSwiper"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <div className="swiper-zoom-container">
                                        <Image
                                            src={image.image}
                                            alt={`Expanded Carousel Image ${index}`}
                                            width={1200}
                                            height={15}
                                            className="carousel-image-expanded"
                                        />
                                    </div>
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
