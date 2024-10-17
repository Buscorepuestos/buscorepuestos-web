'use client'
import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Button, { ButtonProps } from '../Button';
import { ProductMongoInterface } from '../../../redux/interfaces/product.interface';
import { useAppDispatch } from '../../../redux/hooks';
import { addItemToCart, CartItem, removeItemFromCart, savePurchaseAsync, removePurchaseAsync } from '../../../redux/features/shoppingCartSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { updateMetasyncProduct } from '../../../services/products/products.service';
import { updateAlgoliaProductStock } from '../../../services/algolia/updateStock.service';


interface ProductPriceProps {
    price: string;
    shippingInfo: string;
    warningImgSrc: string;
    originalPrice: number;
    discount: string;
    button1Props: ButtonProps;
    button2Props: ButtonProps;
    data: ProductMongoInterface;
    stock?: number | undefined;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
    price,
    shippingInfo,
    warningImgSrc,
    originalPrice,
    discount,
    button1Props,
    button2Props,
    data,
    stock
}) => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    let [globalStock, setGlobalStock] = useState<boolean>(true);

    const [existingItem, setExistingItem] = useState<CartItem | null>(null);
    
    const handleAddToCart = () => {
        dispatch({ type: 'auth/checkUserStatus' });
        setTimeout(() => {
            dispatch(addItemToCart(data));
            dispatch(savePurchaseAsync({ product: data, userId: localStorage.getItem('airtableUserId') ?? '' }));
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Producto añadido al carrito",
                showConfirmButton: false,
                timer: 1500
            });
        }, 1500);
    };

    const handleRemoveFromCart = () => {
        dispatch(removeItemFromCart(data._id));
        dispatch(removePurchaseAsync({ productId: data._id, purchaseId: existingItem!.purchaseId! }));
    }

    const cart = useSelector((state: RootState) => state.cart.items);

    useEffect(() => {
        const item = cart.find((item) => item._id === data._id);
        setExistingItem(item!);
    }, [cart, data._id]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Verificamos si localStorage está disponible antes de despachar la acción
            dispatch({ type: 'auth/checkUserStatus' });
        }

    }, [dispatch]);

    useEffect(() => {
        if (stock !== undefined) {
            if (stock > 0) {
                setGlobalStock(false);
                (async () => {
                    await updateMetasyncProduct(data._id, { 
                        "id": data._id,
                        "data": {
                            "stock": false
                        }
                    });
                    await updateAlgoliaProductStock(data._id, false);
                })();
            }
        }
    }, [globalStock, stock, data._id, dispatch]);

    const buynow = () => {
        dispatch(addItemToCart(data));
        dispatch(savePurchaseAsync({ product: data, userId: localStorage.getItem('airtableUserId') ?? '' }));
        router.push('/verificacion-pago');
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
                {
                    data.stock === false || globalStock === false ? (
                        <Button 
                            labelName='Producto no disponible' 
                            type='secondary'
                            bg='bg-alter-grey'
                            borderColor='border-alter-grey'
                            hoverBg='hover:bg-alter-grey'
                            hoverText='white'
                            cursor='cursor-not-allowed'
                        />
                    ) : (
                        <>
                            {
                                existingItem ? (
                                    <Button
                                        labelName='Quitar de la cesta'
                                        type='secondary'
                                        bg='bg-secondary-blue'
                                        borderColor='border-secondary-blue'
                                        hoverBg='hover:bg-custom-white'
                                        hoverText='hover:text-secondary-blue'
                                        cursor='cursor-pointer'
                                        onClick={handleRemoveFromCart}
                                    />
                                ) : (
                                    <>
                                    <Button {...button1Props} onClick={handleAddToCart} />
                                    <Button {...button2Props} onClick={buynow}/>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default ProductPrice;
