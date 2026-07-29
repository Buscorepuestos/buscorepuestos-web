'use client'
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../../redux/features/shoppingCartSlice';
import Swal from 'sweetalert2';
import Image from 'next/image';
import './success.css';

const PaymentSuccess = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [orderData, setOrderData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const handlePaymentResult = async () => {
            const sessionId = searchParams.get('session_id'); // Stripe
            const scalapayStatus = searchParams.get('status'); // Scalapay
            const isSumupSuccess = searchParams.get('pagoSumup') === 'true'; // SumUp

            if (sessionId || scalapayStatus === 'SUCCESS' || isSumupSuccess) {
                console.log("Regreso exitoso del usuario a la página de confirmación.");
                const pendingOrderJSON = localStorage.getItem('pendingOrder');

                if (pendingOrderJSON) {
                    const pendingOrder = JSON.parse(pendingOrderJSON);
                    setOrderData(pendingOrder);

                    // Limpiar el estado del frontend
                    dispatch(clearCart());
                    localStorage.removeItem('pendingOrder');
                    localStorage.removeItem('checkoutFormData')
                    localStorage.setItem('lastBillingSuccess', pendingOrderJSON); // Guardar por si el usuario recarga

                    setStatus('success');
                } else {
                    // Esto puede pasar si el usuario recarga la página. Buscamos el backup.
                    const lastBillingJSON = localStorage.getItem('lastBillingSuccess');
                    if (lastBillingJSON) {
                        setOrderData(JSON.parse(lastBillingJSON));
                        setStatus('success');
                    } else {
                        console.warn("No se encontró 'pendingOrder' ni 'lastBillingSuccess'. Mostrando éxito genérico.");
                        // Asumimos éxito para no confundir al usuario. El webhook es la fuente de verdad.
                        setStatus('success');
                    }
                }
            } else {
                setErrorMessage('El pago fue cancelado o no se pudo completar.');
                setStatus('error');
            }
        };
        handlePaymentResult();
    }, [searchParams, dispatch]);

    useEffect(() => {
        if (status === 'error') {
            Swal.fire({
                title: 'Pago no completado',
                text: errorMessage || 'Por favor, inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Volver al carrito',
            }).then(() => {
                router.push('/verificacion-pago');
            });
        }
    }, [status, errorMessage, router])

    const {
        billingData, extraData, cart
    } = orderData || {};

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold">Confirmando tu pedido...</p>
            </div>
        );
    }

    if (status === 'error') {
        return null; // El useEffect se encarga de mostrar el Swal y redirigir
    }

    // Renderizado de la página de éxito
    return (
        <div className="flex items-center justify-center min-h-screen font-tertiary-font bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 mt-[20rem] mb-[5rem] mobile:mt-[7rem]">
            <div className="w-full max-w-lg lg:w-11/12 xl:max-w-screen-2xl border-[3px] border-secondary-blue p-6 md:p-8 lg:p-12 rounded-xl lg:rounded-2xl shadow-xl bg-white">
                <p className="font-bold text-primary-blue text-lg mobile:text-[1.5rem] text-center mb-6">
                    ¡Pago exitoso!
                </p>
                <p className="font-bold text-lg mobile:text-[1.8rem] text-center mb-10 lg:mb-16 text-dark-grey">
                    Detalles del Pedido
                </p>
                {billingData ? (
                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20">
                            {/* Columna 1 */}
                            <div className="space-y-4">
                                {/* <p className="font-bold text-xl md:text-2xl lg:text-3xl mobile:text-lg mb-4 text-secondary-blue border-b-2 pb-3">
									Datos Personales
								</p> */}
                                <p className='text-base md:text-lg text-dark-grey'>
                                    <strong>Nombre:</strong> {billingData.name}
                                </p>
                                <p className='text-base md:text-lg text-dark-grey'>
                                    <strong>Teléfono:</strong> {billingData.phone}
                                </p>
                                <p className='text-base md:text-lg  text-dark-grey'>
                                    <strong>Email:</strong> {extraData?.email}
                                </p>
                                <p className='text-base md:text-lg  text-dark-grey'>
                                    <strong>NIF:</strong> {billingData.nif}
                                </p>

                                {/* <p className="font-bold text-xl md:text-2xl lg:text-3xl mobile:text-lg pt-6 mb-4 text-secondary-blue border-b-2 pb-3">
									Dirección de Envío
								</p> */}
                                <p className='text-base md:text-lg text-dark-grey'>
                                    <strong>Dirección:</strong> {billingData.address}, {billingData.addressNumber}
                                </p>
                                <p className='text-base md:text-lg  text-dark-grey'>
                                    <strong>Localidad:</strong> {billingData.location}, {billingData.province} ({billingData.cp})
                                </p>
                                <p className='text-base md:text-lg text-dark-grey'>
                                    <strong>País:</strong> {billingData.country}
                                </p>
                            </div>

                            {/* Columna 2 */}
                            <div className="space-y-4">
                                <p className="font-bold text-xl md:text-2xl lg:text-3xl mobile:text-[2rem] mb-4 text-secondary-blue border-b-2 pb-3">
                                    Facturación
                                </p>
                                <p className='text-base md:text-lg text-dark-grey'>
                                    <strong>Dirección:</strong> {extraData?.billingAddress}, {extraData?.billingAddressExtra}
                                </p>
                                <p className='text-base md:text-lg  text-dark-grey'>
                                    <strong>Número de direccion:</strong> {extraData?.billingAddressExtra}
                                </p>
                                <p className='text-base md:text-lg  text-dark-grey'>
                                    <strong>Provincia:</strong> {extraData?.billingProvince}
                                </p>
                                <p className='text-base md:text-lg  text-dark-grey'>
                                    <strong>Código postal:</strong> {orderData.extraData?.billingZip}
                                </p>

                                <p className="font-bold text-xl md:text-2xl lg:text-3xl mobile:text-[2rem] pt-6 mb-4 text-secondary-blue border-b-2 pb-3">
                                    Productos
                                </p>
                                <div className="space-y-5">
                                    {cart.map((product: any) => (
                                        <div key={product._id} className="flex items-center gap-5">
                                            {product.images && product.images[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    width={90}
                                                    height={90}
                                                    className="rounded-lg object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-[90px] h-[90px] bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                    Sin imagen
                                                </div>
                                            )}

                                            <p className='text-base md:text-lg text-dark-grey font-medium'>{product.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex  mt-16 lg:mt-20">
                            <Image
                                src="/nuevo-logo-buscorepuestos.png"
                                alt="Logo"
                                width={150}
                                height={150}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-lg">
                        Cargando detalles de facturación...
                    </p>
                )}
            </div>
        </div>
    )
};

// Componente Wrapper para Suspense
const PaymentSuccessContent = () => (
    <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
    }>
        <PaymentSuccess />
    </Suspense>
);

export default PaymentSuccessContent;
