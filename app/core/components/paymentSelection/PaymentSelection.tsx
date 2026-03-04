'use client'
import React, { useState, useEffect, useMemo } from 'react';
import SumupPayment from '../sumupPayment/sumupPayment';
import TransferPayment from '../transferPayment/transferPayment';
import { createScalapayOrder } from '../../../services/checkout/scalapay.service';
import ScalapayWidget from '../scalapayWidget/ScalapayWiget';
import { FormsFields } from '../checkoutPage/CheckoutPage';
import { useAppDispatch } from '../../../redux/hooks'; 
import { savePurchaseAsync } from '../../../redux/features/shoppingCartSlice';
import Image from 'next/image';
import Swal from 'sweetalert2';
import api from '../../../api/api';

const PaymentSelection = ({
	fieldsValue,
	numberPriceRounded,
	numberPrice,
	items,
	totalPrice,
	isSwitchOn,
	setFieldsValue,
	isProductPage,
	isPhoneValid,
	onPhoneValidationFail,
}: {
	purchaseIds: string[]
	fieldsValue: FormsFields
	numberPriceRounded: number
	numberPrice: number
	setIsScrolledInputs: React.Dispatch<
		React.SetStateAction<{
			name: boolean; email: boolean; nif: boolean; phoneNumber: boolean;
			shippingAddress: boolean; addressExtra: boolean; zip: boolean;
			city: boolean; province: boolean; country: boolean;
		}>
	>
	isScrolledInputs: {
		name: boolean; email: boolean; nif: boolean; phoneNumber: boolean;
		shippingAddress: boolean; addressExtra: boolean; zip: boolean;
		city: boolean; province: boolean; country: boolean;
	}
	items: any[]
	totalPrice: string
	isSwitchOn: boolean
	setFieldsValue: React.Dispatch<React.SetStateAction<FormsFields>>
	isProductPage: boolean
	isPhoneValid: boolean
	onPhoneValidationFail: () => void
}) => {
	const dispatch = useAppDispatch();
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		'stripe' | 'sumup' | 'transferencia' | 'scalapay' | null
	>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [isFormValid, setIsFormValid] = useState(false)
	const [isCartReady, setIsCartReady] = useState(false);

	const userId = typeof window !== 'undefined' ? localStorage.getItem('airtableUserId') : null

	const { purchaseIds, isReady, hasError } = useMemo(() => {
        const ids = items.map(item => item.purchaseId).filter(Boolean) as string[];
        const allSaved = items.length > 0 && items.every(item => item.saveStatus === 'saved');
        // Detectamos si algún item falló
        const anyError = items.some(item => item.saveStatus === 'error');
        return { purchaseIds: ids, isReady: allSaved, hasError: anyError };
    }, [items]);

	// Actualizamos el estado local `isCartReady`
	useEffect(() => {
		setIsCartReady(isReady);
	}, [isReady])

	useEffect(() => {

        if (items.length > 0) {
            items.forEach(item => {
                // Si el item no tiene ID de compra y no se está guardando actualmente, reintentamos
                if (!item.purchaseId && item.saveStatus !== 'saved' && item.saveStatus !== 'saving') {
                    console.log(`Reintentando sincronización para: ${item.title}`);
                    const currentUserId = userId || localStorage.getItem('airtableUserId') || '';
                    
                    // Solo intentamos si tenemos usuario, si no, el authMiddleware debería encargarse
                    if (currentUserId) {
                        dispatch(savePurchaseAsync({
                            product: { ...item } as any, // Cast necesario porque CartItem extiende ProductMongoInterface
                            userId: currentUserId,
                        }));
                    }
                }
            });
        }
    }, [dispatch, items, userId]);

	useEffect(() => {

		const phoneDigits = fieldsValue.phoneNumber.replace(/\D/g, '');

		const isFieldsComplete =
			fieldsValue.shippingAddress && fieldsValue.country && fieldsValue.city &&
			fieldsValue.addressExtra && fieldsValue.name && fieldsValue.email &&
			fieldsValue.zip && fieldsValue.nif && fieldsValue.phoneNumber &&
			fieldsValue.province && phoneDigits.length >= 9;;

		setIsFormValid(!!isFieldsComplete);
	}, [fieldsValue]);

	useEffect(() => {
		if (!isFormValid) {
			setSelectedPaymentMethod(null);
		}
	}, [isFormValid]);

	const backToInputRefWhenError = () => {
		// Esta función se mantiene igual para guiar al usuario a campos vacíos.
	};

	const isAssisted = items.some(item => item.origin === 'kommo');

	const prepareLocalStorageForRedirect = (paymentMethod: 'stripe' | 'scalapay' | 'sumup' | 'transferencia') => {
		console.log(`Guardando datos del pedido en localStorage para ${paymentMethod}...`);

		const pendingOrder = {
			paymentMethod,
			billingData: {
				Compras: purchaseIds,
				Usuarios: [userId!],
				transfer: paymentMethod === 'transferencia',
				address: fieldsValue.shippingAddress,
				country: fieldsValue.country,
				location: fieldsValue.city,
				addressNumber: fieldsValue.addressExtra,
				name: fieldsValue.name,
				cp: fieldsValue.zip,
				nif: fieldsValue.nif,
				phone: Number(fieldsValue.phoneNumber),
				province: fieldsValue.province,
			},
			extraData: {
				email: fieldsValue.email,
				billingAddress: fieldsValue.billingAddress,
				billingAddressExtra: fieldsValue.billingAddressExtra,
				billingProvince: fieldsValue.billingProvince,
				billingZip: fieldsValue.billingZip,
				isAssisted: isAssisted,
			},
			cart: items,
		};

		localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
	};

	const handlePaymentSelection = async (method: 'stripe' | 'sumup' | 'transferencia' | 'scalapay') => {
		if (!isCartReady) {
			Swal.fire({
				icon: 'info',
				title: 'Un momento...',
				text: 'Estamos preparando tu carrito. Por favor, espera unos segundos.',
				timer: 2000,
				showConfirmButton: false,
			});
			return;
		}

		if (!isFormValid) {
			backToInputRefWhenError();
			Swal.fire({
				icon: 'warning',
				title: 'Faltan datos',
				text: 'Por favor, completa todos los campos de envío antes de continuar.',
			});
			return;
		}

		const phoneDigits = fieldsValue.phoneNumber.replace(/\D/g, '');
		if (phoneDigits.length < 9) {
			onPhoneValidationFail(); // hace scroll + foco al campo en CheckoutPage
			Swal.fire({
				icon: 'warning',
				title: 'Teléfono inválido',
				text: 'Por favor, introduce un número de teléfono válido (mínimo 9 dígitos).',
			});
			return;
		}

		setSelectedPaymentMethod(method);

		if (isSwitchOn) {
			setFieldsValue((prevState) => ({
				...prevState,
				billingAddress: fieldsValue.shippingAddress,
				billingAddressExtra: fieldsValue.addressExtra,
				billingZip: fieldsValue.zip,
				billingProvince: fieldsValue.province,
			}));
		}

		if (method === 'stripe') {
			const prepareLocalStorageForRedirect = () => {
				const isAssisted = items.some(item => item.origin === 'kommo');
				const userId = localStorage.getItem('airtableUserId');
				const pendingOrder = {
					paymentMethod: 'stripe',
					billingData: {
						Compras: purchaseIds,
						Usuarios: [userId!],
						transfer: false,
						address: fieldsValue.shippingAddress,
						country: fieldsValue.country,
						location: fieldsValue.city,
						addressNumber: fieldsValue.addressExtra,
						name: fieldsValue.name,
						cp: fieldsValue.zip,
						nif: fieldsValue.nif,
						phone: Number(fieldsValue.phoneNumber),
						province: fieldsValue.province,
					},
					extraData: {
						email: fieldsValue.email,
						billingAddress: fieldsValue.billingAddress,
						billingAddressExtra: fieldsValue.billingAddressExtra,
						billingProvince: fieldsValue.billingProvince,
						billingZip: fieldsValue.billingZip,
						isAssisted: isAssisted,
					},
					cart: JSON.parse(localStorage.getItem('cart') || '[]'),
				};
				localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
			};
			prepareLocalStorageForRedirect();
			setIsProcessing(true);
			try {
				const response = await api.post('/stripe/create-checkout-session', {
					items,
					userId,
					purchaseIds,
					fieldsValue,
					isAssisted: isAssisted,
				});

				const { url } = response.data;
				if (url) {
					// Redirigir al usuario a la página de pago de Stripe
					window.location.href = url;
				} else {
					throw new Error("No se recibió la URL de checkout de Stripe.");
				}
			} catch (error: any) {
				console.error("Error al crear la sesión de checkout de Stripe:", error);
				Swal.fire('Error', error.response?.data?.message || 'No se pudo iniciar el pago. Inténtalo de nuevo.', 'error');
			} finally {
				setIsProcessing(false);
			}
		}
	};

	const handleScalapayPayment = async () => {
		setIsProcessing(true);
		prepareLocalStorageForRedirect('scalapay');

		try {
			// No guardamos en localStorage aquí, el backend se encarga de todo.
			const response = await createScalapayOrder({
				purchaseIds,
				userId: userId!,
				fieldsValue, // <-- Pasamos el objeto completo del formulario
				items, // <-- Pasamos los items para calcular el total en el backend
				isAssisted: isAssisted,
			});

			if (response.checkoutUrl) {
				window.location.href = response.checkoutUrl;
			} else {
				throw new Error('La respuesta del servidor no contenía una URL de checkout.');
			}
		} catch (error: any) {
			console.error('Error al preparar el pago con Scalapay:', error);
			Swal.fire('Error', error.message || 'No se pudo iniciar el pago con Scalapay.', 'error');
			setIsProcessing(false);
		}
	};

	const renderPaymentOptions = (enabledForm: boolean, enabledCart: boolean) => {
		const getButtonStyle = (method: string) => {
			if (!enabledForm || !enabledCart) {
				return 'bg-light-grey text-alter-grey border-light-grey cursor-not-allowed';
			}

			// Si está seleccionado, aplicamos el fondo azul directamente y quitamos el bg-white
			if (selectedPaymentMethod === method) {
				return 'bg-secondary-blue text-white border-secondary-blue';
			}

			// Si no está seleccionado pero está habilitado
			return 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white';
		};

		const iconSrc = (method: string, defaultSrc: string, selectedSrc: string) => selectedPaymentMethod === method ? selectedSrc : defaultSrc;

		return (
			<div>
				{!isCartReady && items.length > 0 && !hasError && (
                    <div className="flex justify-center items-center my-4 p-2 bg-yellow-100 border border-yellow-300 rounded-md">
                        <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                        <p className="ml-3 text-sm text-yellow-800">Sincronizando carrito...</p>
                    </div>
                )}
				{hasError && (
                    <div className="flex flex-col justify-center items-center my-4 p-2 bg-red-100 border border-red-300 rounded-md">
                        <p className="text-sm text-red-800 font-bold">Hubo un error sincronizando tu carrito.</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700"
                        >
                            Reintentar
                        </button>
                    </div>
                )}
				<div className="flex mobile:flex-wrap justify-between mb-6 gap-3">
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('sumup')}
						className={`w-full flex ${isProductPage ? 'sm:flex-col' : ''} 
					gap-3 items-center justify-center px-6 py-2 border-[1px] 
					rounded-xl transition-all duration-300 ${getButtonStyle('sumup')}
					xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[3vw]
					`}
					>
						<Image src={iconSrc('sumup', '/tarjeta.svg', '/tarjeta-blanca.svg')} alt="tarjeta" width={46} height={46} className="w-14 h-14 rounded-md" />
						Pago con tarjeta
					</button>
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('transferencia')}
						className={`w-full flex ${isProductPage ? 'sm:flex-col' : ''} 
					gap-3 items-center justify-center px-6 py-2 border-[1px] 
					rounded-xl transition-all duration-300 ${getButtonStyle('transferencia')}
					xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[3vw]
					`}
					>
						<Image src={iconSrc('transferencia', '/transferencia.svg', '/Transferencia-white.svg')} alt="transferencia" width={46} height={46} className="w-14 h-14 rounded-md" />
						Transferencia
					</button>
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('stripe')}
						className={`w-full flex ${isProductPage ? 'sm:flex-col gap-3' : 'gap-6'} 
					items-center justify-center px-4 py-2 border-[1px] rounded-xl transition-all 
					duration-300 ${getButtonStyle('stripe')}
					xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[3vw]
					`}
					>
						<div className="flex gap-4">
							<Image src="/klarna.png" alt="klarna" width={56} height={56} className={`w-10 h-10 rounded-md ${isProductPage && 'xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-10 sm:h-10'}`} />
							<Image src="/paypal.png" alt="paypal" width={56} height={56} className={`w-10 h-10 rounded-md ${isProductPage && 'xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-10 sm:h-10'}`} />
						</div>
						<span>En 3 plazos, Paypal</span>
					</button>
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('scalapay')}
						className={`w-full flex ${isProductPage ? 'sm:flex-col' : ''} items-center 
					justify-center px-4 py-4 border-[1px] rounded-xl transition-all duration-300 
					${getButtonStyle('scalapay')}
					xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[3vw] gap-3
					`}
					>
						<Image src="/scalapay3.png" alt="scalapay" width={80} height={20} />
						<span>Paga en 3 o 4 plazos</span>
					</button>
				</div>
			</div>
		);
	};


	return (
		<div className={`${!isProductPage && 'w-full mx-auto p-4 bg-white shadow-lg rounded-lg'}`}>
			<div style={{ display: 'none' }}>
				<span id="checkout-total-price-for-widget">{totalPrice}</span>
			</div>

			{renderPaymentOptions(isFormValid, isCartReady)}

			{!isFormValid && (
				<p className="text-center text-sm text-red-500 my-4">
					*Para activar los métodos de pago, todos los campos de envío deben estar completos.
				</p>
			)}

			<div className="mt-8">
				{selectedPaymentMethod === 'sumup' && (
					<div className="flex justify-center">
						<SumupPayment
							purchaseIds={purchaseIds}
							fieldsValue={fieldsValue}
							numberPriceRounded={numberPrice}
							items={items}
							userId={userId}
							billingData={{
								Compras: purchaseIds,
								Usuarios: [userId!],
								transfer: false,
								address: fieldsValue.billingAddress,
								country: fieldsValue.country,
								location: fieldsValue.city,
								addressNumber: fieldsValue.billingAddressExtra,
								name: fieldsValue.name,
								cp: fieldsValue.billingZip,
								nif: fieldsValue.nif,
								phone: Number(fieldsValue.phoneNumber),
								province: fieldsValue.billingProvince,
							}}
							extraData={{
								email: fieldsValue.email,
								isAssisted: isAssisted,
							}}
						/>
					</div>
				)}
				{selectedPaymentMethod === 'transferencia' && (
					<div className="flex justify-center">
						<TransferPayment
							totalPrice={totalPrice}
							purchaseIds={purchaseIds}
							fieldsValue={fieldsValue}
							isAssisted={isAssisted}
							onTransferPayment={() => prepareLocalStorageForRedirect('transferencia')}
						/>
					</div>
				)}
				{/* {selectedPaymentMethod === 'stripe' ? (
					<div className="flex justify-center">
						{isProcessing ? (
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
						) : (
							<StripePaymentHandler
								purchaseIds={purchaseIds}
								fieldsValue={fieldsValue}
								items={items}
								userId={userId!}
							/>
						)}
					</div>
				) : null} */}
				{selectedPaymentMethod === 'scalapay' && (
					<div className="flex flex-col justify-center items-center">
						<ScalapayWidget amountSelector="#checkout-total-price-for-widget" type="checkout" />
						{!isProcessing ? (
							<button
								onClick={handleScalapayPayment}
								className="w-1/2 mt-4 bg-custom-black font-tertiary-font  text-custom-white font-bold py-3 px-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-secondary-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<p className='text-[1.8rem] mobile:text-[1.3rem]'>Pagar con Scalapay</p>
							</button>
						) : (
							<div className="w-full flex justify-center mt-4">
								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default PaymentSelection;
