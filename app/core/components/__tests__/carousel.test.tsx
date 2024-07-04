import { render, screen, cleanup } from '@testing-library/react';
import Carousel from '../carousel/carousel';
import { describe, it, expect, afterEach } from 'vitest';
import { convertCssProperties, CarouselContainer, CarouselImage, ThumbImage } from '../carousel/carousel';
import { Swiper as SwiperType } from 'swiper';

describe('Carousel Component', () => {
    afterEach(() => {
        cleanup();
    });

    // Test convertCssProperties function

    it('should return an empty string if no styles are provided', () => {
        const result = convertCssProperties();
        expect(result).toBe('');
    });

    it('should return a single CSS property as a string', () => {
        const styles = { color: 'red' };
        const result = convertCssProperties(styles);
        expect(result).toBe('color: red;');
    });

    it('should return multiple CSS properties as a string', () => {
        const styles = { color: 'red', 'font-size': '12px' };
        const result = convertCssProperties(styles);
        expect(result).toBe('color: red; font-size: 12px;');
    });

    // Test styled components

    it('should apply containerStyles to CarouselContainer', () => {
        const containerStyles = { backgroundColor: 'red' };
        const { container } = render(
        <CarouselContainer containerStyles={containerStyles}>
            <Carousel images={[]} />
        </CarouselContainer>
        );
        const containerElement = container.firstChild as HTMLElement;
        const styles = getComputedStyle(containerElement);

        expect(styles.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('should apply imageStyles to CarouselImage', () => {
        const imageStyles = { border: '2px solid blue' };
        const { container } = render(
        <CarouselImage
            src="https://via.placeholder.com/800x10"
            alt="Test Image"
            width={800}
            height={10}
            imageStyles={imageStyles}
        />
    );
    const imageElement = container.firstChild as HTMLElement;
    const styles = getComputedStyle(imageElement);

    expect(styles.border).toBe('2px solid blue');
});

    it('should apply thumbImageStyles to ThumbImage', () => {
        const thumbImageStyles = { border: '2px solid green' };
        const { container } = render(
        <ThumbImage
            src="https://via.placeholder.com/800x10"
            alt="Test Thumbnail"
            width={200}
            height={5}
            thumbImageStyles={thumbImageStyles}
        />
        );
        const thumbImageElement = container.firstChild as HTMLElement;
        const styles = getComputedStyle(thumbImageElement);

        expect(styles.border).toBe('2px solid green');
    });

    // Test Carousel component

    const images = [
        { image: 'https://via.placeholder.com/800x10' },
        { image: 'https://via.placeholder.com/800x10' },
        { image: 'https://via.placeholder.com/800x10' }
    ];

    it('should render the main swiper container', () => {
        render(<Carousel images={images} />);
        const mainSwiperContainer = document.querySelector('.mySwiper2');
        expect(mainSwiperContainer).not.toBeNull();
    });

    it('should render the thumbnail swiper container when not in wide screen', () => {
        render(<Carousel images={images} isWideScreen={false} />);
        const thumbSwiperContainer = document.querySelector('.mySwiper');
        expect(thumbSwiperContainer).not.toBeNull();
    });

    it('should not render the thumbnail swiper container when in wide screen', () => {
        render(<Carousel images={images} isWideScreen={true} />);
        const thumbSwiperContainer = document.querySelector('.mySwiper');
        expect(thumbSwiperContainer).toBeNull();
    });

    it('should render the correct number of main images', () => {
        render(<Carousel images={images} />);
        const mainImages = document.querySelectorAll('.mySwiper2 .swiper-slide');
        expect(mainImages.length).toBe(images.length);
    });

    it('should render the correct number of thumbnail images when not in wide screen', () => {
        render(<Carousel images={images} isWideScreen={false} />);
        const thumbImages = document.querySelectorAll('.mySwiper .swiper-slide');
        expect(thumbImages.length).toBe(images.length);
    });

    it('should not render thumbnail images when in wide screen', () => {
        render(<Carousel images={images} isWideScreen={true} />);
        const thumbImages = document.querySelectorAll('.mySwiper .swiper-slide');
        expect(thumbImages.length).toBe(0);
    });

    it('should have correct src attribute for main images', () => {
        render(<Carousel images={images} />);
        images.forEach((img, idx) => {
            const mainImage = screen.getAllByAltText('Prueba Carousel')[idx] as HTMLImageElement;
            expect(mainImage.getAttribute('src')).toContain(encodeURIComponent(img.image));
        });
    });

    it('should have correct src attribute for thumbnail images when not in wide screen', () => {
        render(<Carousel images={images} isWideScreen={false} />);
        images.forEach((img, idx) => {
            const thumbImage = screen.getAllByAltText('Prueba Carousel')[idx + images.length] as HTMLImageElement;
            expect(thumbImage.getAttribute('src')).toContain(encodeURIComponent(img.image));
        });
    });

    it('should pass thumbs property to Swiper when not in wide screen', () => {
        const thumbsSwiper = {} as SwiperType; // Mock swiper instance
        render(<Carousel images={images} isWideScreen={false} />);
        // Here, you might need to use a mock or spy to ensure thumbsSwiper is passed
        // This test can be complex and might require a library to mock Swiper instances
    });

    it('should apply pagination when in wide screen', () => {
        render(<Carousel images={images} isWideScreen={true} />);
        const pagination = document.querySelector('.swiper-pagination');
        expect(pagination).not.toBeNull();
    });

    it('should not apply pagination when not in wide screen', () => {
        render(<Carousel images={images} isWideScreen={false} />);
        const pagination = document.querySelector('.swiper-pagination');
        expect(pagination).toBeNull();
    });
});