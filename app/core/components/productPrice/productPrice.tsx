'use client'
import React from 'react';
import Image from 'next/image';
import Button, { ButtonProps } from '../Button';
import { ProductMongoInterface } from '../../../redux/interfaces/product.interface';
import { useAppDispatch } from '@/app/redux/hooks';
import { addItemToCart } from '@/app/redux/features/shoppingCartSlice';

interface ProductPriceProps {
    price: string;
    shippingInfo: string;
    warningImgSrc: string;
    originalPrice: number;
    discount: string;
    button1Props: ButtonProps;
    button2Props: ButtonProps;
    data: ProductMongoInterface;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
    price,
    shippingInfo,
    warningImgSrc,
    originalPrice,
    discount,
    button1Props,
    button2Props,
    data
}) => {

    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        dispatch(addItemToCart(data));
    };

    return (
        <div className='flex flex-col justify-center items-center font-tertiary-font'>
            <p className='text-[32px] xl:text-[2.5vw] lg:text-[2.8vw] md:text-[3.2vw] sm:text-[3.5vw] text-primary-blue font-semibold'>
                {price}€
            </p>
            <p className='font-semibold xl:text-[1vw] sm:text-[1.8vw]'>
                {shippingInfo}
            </p>
            <div className='text-custom-orange gap-3 flex items-center'>
                <Image
                    src={warningImgSrc}
                    alt='warning'
                    width={20}
                    height={20}
                    className='sm:w-[17px] sm:h-[17px] md:w-[22px] md:h-[22px]'
                />
                <p className='text-[2.8vw] xl:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw]'>
                    Precio medio pieza original nueva:  
                    <span className='font-semibold line-through'> {originalPrice}€ </span>
                </p>
                <p className='text-[2.8vw] xl:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw] bg-custom-orange text-custom-white rounded-2xl px-1 flex items-center'>
                    {discount}
                </p>
            </div>
            <div className='flex gap-7 mt-7'>
                <Button {...button1Props} onClick={handleAddToCart} />
                <Button {...button2Props} />
            </div>
        </div>
    );
};

export default ProductPrice;
