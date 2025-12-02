// import React, { useState, useEffect, useRef } from 'react'
// import PaymentForm from '../checkout/PaymentForm'
// import SumupPayment from '../sumupPayment/sumupPayment'
// import TransferPayment from '../transferPayment/transferPayment'
// import { FormsFields } from '../../../core/components/checkoutPage/CheckoutPage'
// import { createPaymentIntent } from '../../../services/checkout/stripe.service'
// import ScalapayWidget from '../scalapayWidget/ScalapayWiget'
// import { createScalapayOrder } from '../../../services/checkout/scalapay.service'
// import { CreateOrderPayload } from '../../../types/scalapay'
// import Image from 'next/image'
// import Swal from 'sweetalert2'

// const PaymentSelection = ({
// 	purchaseIds,
// 	fieldsValue,
// 	numberPriceRounded,
// 	numberPrice,
// 	nameRef,
// 	emailRef,
// 	nifRef,
// 	phoneNumberRef,
// 	shippingAddressRef,
// 	addressExtraRef,
// 	zipRef,
// 	cityRef,
// 	provinceRef,
// 	countryRef,
// 	setIsScrolledInputs,
// 	isScrolledInputs,
// 	items,
// 	totalPrice,
// 	isSwitchOn,
// 	setFieldsValue,
// 	isProductPage,
// }: {
// 	purchaseIds: string[]
// 	fieldsValue: FormsFields
// 	numberPriceRounded: number
// 	numberPrice: number
// 	nameRef: React.RefObject<HTMLInputElement>
// 	emailRef: React.RefObject<HTMLInputElement>
// 	nifRef: React.RefObject<HTMLInputElement>
// 	phoneNumberRef: React.RefObject<HTMLInputElement>
// 	shippingAddressRef: React.RefObject<HTMLInputElement>
// 	addressExtraRef: React.RefObject<HTMLInputElement>
// 	zipRef: React.RefObject<HTMLInputElement>
// 	cityRef: React.RefObject<HTMLInputElement>
// 	provinceRef: React.RefObject<HTMLInputElement>
// 	countryRef: React.RefObject<HTMLInputElement>
// 	setIsScrolledInputs: React.Dispatch<
// 		React.SetStateAction<{
// 			name: boolean
// 			email: boolean
// 			nif: boolean
// 			phoneNumber: boolean
// 			shippingAddress: boolean
// 			addressExtra: boolean
// 			zip: boolean
// 			city: boolean
// 			province: boolean
// 			country: boolean
// 		}>
// 	>
// 	isScrolledInputs: {
// 		name: boolean
// 		email: boolean
// 		nif: boolean
// 		phoneNumber: boolean
// 		shippingAddress: boolean
// 		addressExtra: boolean
// 		zip: boolean
// 		city: boolean
// 		province: boolean
// 		country: boolean
// 	}
// 	items: any[]
// 	totalPrice: string
// 	isSwitchOn: boolean
// 	setFieldsValue: React.Dispatch<React.SetStateAction<FormsFields>>
// 	isProductPage: boolean
// }) => {
// 	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
// 		'stripe' | 'sumup' | 'transferencia' | 'scalapay' | null
// 	>(null)

// 	const [widgetIsDesktop, setWidgetIsDesktop] = useState(false);
// 	const [widgetIsMobile, setWidgetIsMobile] = useState(false);
// 	useEffect(() => {
// 		const handleResize = () => {
// 			if (window.innerWidth < 640) {
// 				setWidgetIsMobile(true);
// 				setWidgetIsDesktop(false);
// 			} else {
// 				setWidgetIsMobile(false);
// 				setWidgetIsDesktop(true);
// 			}
// 		};
// 		window.addEventListener('resize', handleResize);
// 		handleResize();
// 		return () => window.removeEventListener('resize', handleResize);
// 	}, []);

// 	const [selectedPaymentMethodDisabled, setSelectedPaymentMethodDisabled] =
// 		useState<'stripe' | 'sumup' | 'transferencia' | 'scalapay' | null>(null)
// 	const [clientSecretExists, setClientSecretExists] = useState(false)
// 	const [clientSecret, setClientSecret] = useState<string | null>(null)
// 	const [isProcessingScalapay, setIsProcessingScalapay] = useState(false);
// 	const prevPurchaseIdsRef = useRef<string[]>([])
// 	const createPayuPaymentIntent = async () => {
// 		const res = await createPaymentIntent({
// 			amount: numberPriceRounded,
// 			currency: 'eur',
// 			cartIDs: purchaseIds,
// 			automatic_payment_methods: { enabled: true },
// 			userId: userId || '',
// 		})
// 		setClientSecret(res.data.client_secret)
// 		setClientSecretExists(true)
// 		return res
// 	}
// 	let userId: string | null = null
// 	if (typeof window !== 'undefined') {
// 		userId = localStorage.getItem('airtableUserId')
// 	}

// 	const handlePaymentSelection = (
// 		method: 'stripe' | 'sumup' | 'transferencia' | 'scalapay'
// 	) => {
// 		setSelectedPaymentMethod(method)
// 		if (isSwitchOn) {
// 			setFieldsValue((prevState) => ({
// 				...prevState,
// 				billingAddress: fieldsValue.shippingAddress,
// 				billingAddressExtra: fieldsValue.addressExtra,
// 				billingZip: fieldsValue.zip,
// 				billingProvince: fieldsValue.province,
// 			}))
// 		}
// 		if (
// 			method === 'stripe' &&
// 			!clientSecretExists &&
// 			JSON.stringify(prevPurchaseIdsRef.current) !==
// 			JSON.stringify(purchaseIds)
// 		) {
// 			createPayuPaymentIntent()
// 			prevPurchaseIdsRef.current = purchaseIds
// 		}
// 	}

// 	const handlePaymentSelectionDisabled = (
// 		method: 'stripe' | 'sumup' | 'transferencia' | 'scalapay'
// 	) => {
// 		setSelectedPaymentMethodDisabled(method)
// 	}

// 	const [isFormValid, setIsFormValid] = useState(false)

// 	useEffect(() => {
// 		const isFieldsComplete =
// 			fieldsValue.shippingAddress &&
// 			fieldsValue.country &&
// 			fieldsValue.city &&
// 			fieldsValue.addressExtra &&
// 			fieldsValue.name &&
// 			fieldsValue.email &&
// 			fieldsValue.zip &&
// 			fieldsValue.nif &&
// 			fieldsValue.phoneNumber &&
// 			fieldsValue.province

// 		setIsFormValid(!!isFieldsComplete)
// 	}, [fieldsValue])

// 	useEffect(() => {
// 		if (isFormValid) {
// 			setIsScrolledInputs({
// 				name: false,
// 				email: false,
// 				nif: false,
// 				phoneNumber: false,
// 				shippingAddress: false,
// 				addressExtra: false,
// 				zip: false,
// 				city: false,
// 				province: false,
// 				country: false,
// 			})
// 		}
// 	}, [isFormValid, setIsScrolledInputs])

// 	useEffect(() => {
// 		if (!isFormValid) {
// 			setSelectedPaymentMethod(null)
// 		}
// 	}, [isFormValid])

// 	const backToInputRefWhenError = () => {
// 		if (!isFormValid) {
// 			if (!countryRef.current?.value) {
// 				countryRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					country: true,
// 				})
// 			}
// 			if (!provinceRef.current?.value) {
// 				provinceRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					province: true,
// 				})
// 			}
// 			if (!cityRef.current?.value) {
// 				cityRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					city: true,
// 				})
// 			}
// 			if (!zipRef.current?.value) {
// 				zipRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					zip: true,
// 				})
// 			}
// 			if (!addressExtraRef.current?.value) {
// 				addressExtraRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					addressExtra: true,
// 				})
// 			}
// 			if (!shippingAddressRef.current?.value) {
// 				shippingAddressRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					shippingAddress: true,
// 				})
// 			}
// 			if (!phoneNumberRef.current?.value) {
// 				phoneNumberRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					phoneNumber: true,
// 				})
// 			}
// 			if (!nifRef.current?.value) {
// 				nifRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					nif: true,
// 				})
// 			}
// 			if (!emailRef.current?.value) {
// 				emailRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					email: true,
// 				})
// 			}
// 			if (!nameRef.current?.value) {
// 				nameRef.current?.scrollIntoView({
// 					behavior: 'smooth',
// 					block: 'center',
// 				})
// 				setIsScrolledInputs({
// 					...isScrolledInputs,
// 					name: true,
// 				})
// 			}
// 		}
// 	}

// 	const savePendingOrderToLocalStorage = (paymentMethod: 'scalapay') => {
// 		console.log(`Guardando datos del pedido en localStorage para ${paymentMethod}...`);

// 		// Creamos un objeto que identifique el método de pago
// 		const pendingOrder = {
// 			paymentMethod,
// 			billingData: {
// 				Compras: purchaseIds,
// 				Usuarios: [userId!],
// 				transfer: false,
// 				address: fieldsValue.shippingAddress,
// 				country: fieldsValue.country,
// 				location: fieldsValue.city,
// 				addressNumber: fieldsValue.addressExtra,
// 				name: fieldsValue.name,
// 				cp: fieldsValue.zip,
// 				nif: fieldsValue.nif,
// 				phone: Number(fieldsValue.phoneNumber),
// 				province: fieldsValue.province,
// 			},
// 			extraData: {
// 				email: fieldsValue.email,
// 				billingAddress: fieldsValue.billingAddress,
// 				billingAddressExtra: fieldsValue.billingAddressExtra,
// 				billingProvince: fieldsValue.billingProvince,
// 				billingZip: fieldsValue.billingZip,
// 			},
// 			cart: JSON.parse(localStorage.getItem('cart') || '[]'),
// 		};

// 		// Limpiamos datos antiguos y guardamos el nuevo objeto
// 		localStorage.removeItem('pendingOrder');
// 		localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
// 	};


// 	const handleScalapayPayment = async () => {
// 		// Doble validación por si acaso
// 		if (!isFormValid) {
// 			Swal.fire({
// 				icon: 'warning',
// 				title: 'Faltan datos',
// 				text: 'Por favor, completa todos los campos de envío antes de continuar.',
// 			});
// 			backToInputRefWhenError(); // Llama a tu función para hacer scroll al campo que falta
// 			return;
// 		}
// 		setIsProcessingScalapay(true);

// 		savePendingOrderToLocalStorage('scalapay');

// 		// 1. Construir el payload con los datos del formulario
// 		const payload: CreateOrderPayload = {
// 			purchaseIds: purchaseIds,
// 			consumer: {
// 				firstName: fieldsValue.name.split(' ')[0], // Tomamos el primer nombre
// 				lastName: fieldsValue.name.split(' ').slice(1).join(' ') || fieldsValue.name.split(' ')[0], // El resto como apellido
// 				email: fieldsValue.email,
// 				phoneNumber: fieldsValue.phoneNumber,
// 			},
// 			shipping: {
// 				name: fieldsValue.name,
// 				countryCode: "ES", // Asumimos España
// 				postcode: fieldsValue.zip,
// 				suburb: fieldsValue.city,
// 				line1: `${fieldsValue.shippingAddress}, ${fieldsValue.addressExtra}`,
// 			},
// 		};

// 		try {
// 			// 2. Llamar al servicio del backend
// 			const response = await createScalapayOrder(payload);

// 			// 3. Redirigir al usuario si todo va bien
// 			if (response.checkoutUrl) {
// 				console.log('Redirigiendo a Scalapay:', response.checkoutUrl);
// 				window.location.href = response.checkoutUrl;
// 			} else {
// 				throw new Error('La respuesta de Scalapay no contenía una URL de checkout.');
// 			}
// 		} catch (error: any) {
// 			console.error('Error en el proceso de pago con Scalapay:', error);
// 			Swal.fire({
// 				icon: 'error',
// 				title: 'Error en el pago',
// 				text: error.message || 'No se pudo conectar con Scalapay. Por favor, intenta con otro método de pago.',
// 			});
// 			setIsProcessingScalapay(false);
// 		}
// 	};

// 	return (
// 		<div className={`${!isProductPage && 'w-full mx-auto p-4 bg-white shadow-lg rounded-lg'}`}>
// 			<div style={{ display: 'none' }}>
// 				<span id="checkout-total-price-for-widget">{totalPrice}</span>
// 			</div>
// 			{isFormValid ? (
// 				<div className="flex mobile:flex-wrap justify-between mb-6 gap-3">
// 					<button
// 						onClick={() => {
// 							handlePaymentSelection('sumup')
// 							setTimeout(() => {
// 								backToInputRefWhenError()
// 							}, 200)
// 						}}
// 						className={`w-full flex ${isProductPage ? 'sm:flex-col' : ''} gap-3 items-center justify-center px-6 py-2 border-[1px] rounded-xl transition-all duration-300 
// 				${selectedPaymentMethod === 'sumup'
// 								? 'bg-secondary-blue text-white border-secondary-blue'
// 								: 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'
// 							} xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[3vw]
				
// 				`}
// 					>
// 						{selectedPaymentMethod === 'sumup' ? (
// 							<Image
// 								src="/tarjeta-blanca.svg"
// 								alt="stripe"
// 								width={46}
// 								height={46}
// 								className="w-14 h-14 rounded-md"
// 							/>
// 						) : (
// 							<Image
// 								src="/tarjeta.svg"
// 								alt="stripe"
// 								width={46}
// 								height={46}
// 								className="w-14 h-14 rounded-md"
// 							/>
// 						)}
// 						Pago con tarjeta
// 					</button>
// 					{
// 						widgetIsMobile && selectedPaymentMethod === 'sumup' && (
// 							<div>
// 								{selectedPaymentMethod === 'sumup' && (
// 									<div className="flex justify-center">
// 										<SumupPayment
// 											purchaseIds={purchaseIds}
// 											fieldsValue={fieldsValue}
// 											numberPriceRounded={numberPrice}
// 											items={items}
// 										/>
// 									</div>
// 								)}
// 							</div>
// 						)
// 					}
// 					<button
// 						onClick={() => {
// 							handlePaymentSelection('transferencia')
// 							setTimeout(() => {
// 								backToInputRefWhenError()
// 							}, 200)
// 						}}
// 						className={`w-full flex ${isProductPage ? 'sm:flex-col' : ''} gap-3 items-center justify-center px-6 py-2 border-[1px] rounded-xl transition-all duration-300 
// 				${selectedPaymentMethod === 'transferencia'
// 								? 'bg-secondary-blue text-white border-secondary-blue'
// 								: 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'
// 							} xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[3vw]
				
// 				`}
// 					>
// 						{selectedPaymentMethod === 'transferencia' ? (
// 							<Image
// 								src="/Transferencia-white.svg"
// 								alt="transferencia"
// 								width={46}
// 								height={46}
// 								className="w-14 h-14 rounded-md"
// 							/>
// 						) : (
// 							<Image
// 								src="/transferencia.svg"
// 								alt="transferencia"
// 								width={46}
// 								height={46}
// 								className="w-14 h-14 rounded-md"
// 							/>
// 						)}
// 						Transferencia
// 					</button>
// 					<div className='sm:hidden'>
// 						{selectedPaymentMethod === 'transferencia' && isFormValid && (
// 							<div className="flex justify-center">
// 								<TransferPayment
// 									totalPrice={totalPrice}
// 									purchaseIds={purchaseIds}
// 									fieldsValue={fieldsValue}
// 								/>
// 							</div>
// 						)}
// 					</div>
// 					<button
// 						onClick={() => {
// 							handlePaymentSelection('stripe')
// 							setTimeout(() => {
// 								backToInputRefWhenError()
// 							}, 200)
// 						}}
// 						className={`w-full flex ${isProductPage ? 'sm:flex-col gap-3' : 'gap-6'}  items-center justify-center px-4 py-2  
// 						border-[1px] rounded-xl transition-all duration-300 
// 						${selectedPaymentMethod === 'stripe'
// 								? 'bg-secondary-blue text-white border-secondary-blue'
// 								: 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'
// 							} xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[3vw] 
						
// 						`}
// 					>
// 						<div className={`flex gap-4`}>
// 							<Image
// 								src="/klarna.png"
// 								alt="klarna"
// 								width={56}
// 								height={56}
// 								className={`w-10 h-10 rounded-md ${isProductPage && 'xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-10 sm:h-10'}`}
// 							/>
// 							<Image
// 								src="/paypal.png"
// 								alt="paypal"
// 								width={56}
// 								height={56}
// 								className={`w-10 h-10 rounded-md ${isProductPage && 'xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-10 sm:h-10'}`}
// 							/>
// 						</div>
// 						<pre>
// 							En 3 plazos, <br />
// 							Paypal
// 						</pre>
// 					</button>
// 					<div className='sm:hidden'>
// 						{selectedPaymentMethod === 'stripe' && clientSecret ? (
// 							<div className="flex justify-center">
// 								{clientSecret && (
// 									<PaymentForm
// 										clientSecret={clientSecret}
// 										purchaseIds={purchaseIds}
// 										fieldsValues={fieldsValue}
// 										items={items}
// 									/>
// 								)}
// 							</div>
// 						) : selectedPaymentMethod === 'stripe' && !clientSecret ? (
// 							<div className="flex justify-center my-4">
// 								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
// 							</div>
// 						) : null}
// 					</div>
// 					<button
// 						onClick={() => handlePaymentSelection('scalapay')}
// 						className={`w-full flex ${isProductPage ? 'sm:flex-col' : ''} items-center justify-center px-4 py-4 border-[1px] rounded-xl transition-all duration-300 
//                             ${selectedPaymentMethod === 'scalapay' ? 'bg-secondary-blue text-white border-secondary-blue' : 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'}
//                             xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[3vw] gap-4`
// 						}
// 					>
// 						<Image
// 							src="/scalapay3.png" // Necesitarás descargar el logo de Scalapay y ponerlo en /public
// 							alt="scalapay"
// 							width={80} // Ajusta el tamaño
// 							height={20}
// 						/>
// 						<span>Paga en 3 o 4 plazos</span>
// 					</button>
// 					<div className='sm:hidden w-full'>
// 						{selectedPaymentMethod === 'scalapay' && (
// 							<div className="flex flex-col w-full justify-center items-center">
// 								<div className="">
// 									<ScalapayWidget
// 										amountSelector="#checkout-total-price-for-widget"
// 										type="checkout"
// 									/>
// 								</div>
// 								<div className="mt-2 flex justify-center w-full">
// 									<button
// 										onClick={handleScalapayPayment}
// 										disabled={isProcessingScalapay || !isFormValid}
// 										className="w-1/2 mobile:w-[70vw] text-sm mt-4 bg-custom-black font-tertiary-font  text-custom-white font-bold py-3 px-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-secondary-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// 									>
// 										{isProcessingScalapay ? (
// 											<div className="w-6 h-6 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
// 										) : (
// 											'Pagar con Scalapay'
// 										)}
// 									</button>
// 								</div>
// 							</div>
// 						)}
// 					</div>
// 				</div>
// 			) : (
// 				<div className="flex justify-between mb-6 gap-4 mobile:flex-wrap">
// 					<button
// 						onClick={() => {
// 							handlePaymentSelectionDisabled('sumup')
// 							setTimeout(() => {
// 								backToInputRefWhenError()
// 							}, 200)
// 						}}
// 						className={`
// 							w-full flex ${isProductPage ? 'sm:flex-col' : ''} gap-3 items-center justify-center px-6 py-2 
// 							border-[1px] rounded-lg transition-all duration-300 
// 							bg-light-grey text-alter-grey border-light-grey
// 							xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] 
// 							mobile:text-[3vw]
// 						`}
// 					>
// 						<Image
// 							src="/tarjeta-gris.svg"
// 							alt="stripe"
// 							width={46}
// 							height={46}
// 							className="w-14 h-14 rounded-md"
// 						/>
// 						Pago con tarjeta
// 					</button>
// 					<button
// 						onClick={() => {
// 							handlePaymentSelectionDisabled('transferencia')
// 							setTimeout(() => {
// 								backToInputRefWhenError()
// 							}, 200)
// 						}}
// 						className={`
// 							w-full flex ${isProductPage ? 'sm:flex-col' : ''} gap-3 items-center justify-center px-6 py-2 
// 							border-[1px] rounded-lg transition-all duration-300 
// 							bg-light-grey text-alter-grey border-light-grey
// 							xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] 
// 							mobile:text-[3vw] 
// 						`}
// 					>
// 						<Image
// 							src="/transferencia-gris.svg"
// 							alt="transferencia"
// 							width={46}
// 							height={46}
// 							className="w-14 h-14 rounded-md"
// 						/>
// 						Transferencia
// 					</button>
// 					<button
// 						onClick={() => {
// 							handlePaymentSelectionDisabled('stripe')
// 							setTimeout(() => {
// 								backToInputRefWhenError()
// 							}, 200)
// 						}}
// 						className={`
// 							w-full flex ${isProductPage ? 'sm:flex-col gap-3' : 'gap-6'} items-center justify-center px-4 py-2  
// 							border-[1px] rounded-lg transition-all duration-300 	
// 							bg-light-grey text-alter-grey border-light-grey
// 							xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] 
// 							mobile:text-[3vw]
// 						`}
// 					>
// 						<div className={`flex gap-4`}>
// 							<Image
// 								src="/klarna.png"
// 								alt="klarna"
// 								width={86}
// 								height={56}
// 								className={`w-10 h-10 rounded-md ${isProductPage && 'xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-10 sm:h-10'}`}
// 							/>
// 							<Image
// 								src="/paypal.png"
// 								alt="paypal"
// 								width={56}
// 								height={56}
// 								className={`w-10 h-10 rounded-md ${isProductPage && 'xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-10 sm:h-10'}`}
// 							/>
// 						</div>
// 						{/* <pre>
// 							En 3 plazos, <br />
// 							Paypal
// 						</pre> */}
// 						En 3 plazos, Paypal
// 					</button>
// 					<button
// 						onClick={() => {
// 							handlePaymentSelectionDisabled('scalapay')
// 							setTimeout(() => {
// 								backToInputRefWhenError()
// 							}, 200)
// 						}}
// 						className={`
// 							w-full flex ${isProductPage ? 'sm:flex-col' : ''} items-center justify-center px-4 py-4
// 							border-[1px] rounded-lg transition-all duration-300 
// 							bg-light-grey text-alter-grey border-light-grey
// 							xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw]
// 							mobile:text-[3vw] gap-4
// 						`}
// 					>
// 						<Image
// 							src="/scalapay3.png" // Necesitarás descargar el logo de Scalapay y ponerlo en /public
// 							alt="scalapay"
// 							width={80} // Ajusta el tamaño
// 							height={20}
// 						/>
// 						<span>Paga en 3 o 4 plazos</span>
// 					</button>
// 				</div>
// 			)}

// 			<div className="mt-8 mobile:hidden">
// 				{selectedPaymentMethod === 'sumup' && (
// 					<div className="flex justify-center">
// 						<SumupPayment
// 							purchaseIds={purchaseIds}
// 							fieldsValue={fieldsValue}
// 							numberPriceRounded={numberPrice}
// 							items={items}
// 						/>
// 					</div>
// 				)}
// 				{selectedPaymentMethod === 'transferencia' && isFormValid && (
// 					<div className="flex justify-center">
// 						<TransferPayment
// 							totalPrice={totalPrice}
// 							purchaseIds={purchaseIds}
// 							fieldsValue={fieldsValue}
// 						/>
// 					</div>
// 				)}
// 				{selectedPaymentMethod === 'stripe' && clientSecret ? (
// 					<div className="flex justify-center">
// 						{clientSecret && (
// 							<PaymentForm
// 								clientSecret={clientSecret}
// 								purchaseIds={purchaseIds}
// 								fieldsValues={fieldsValue}
// 								items={items}
// 							/>
// 						)}
// 					</div>
// 				) : selectedPaymentMethod === 'stripe' && !clientSecret ? (
// 					<div className="flex justify-center my-4">
// 						<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
// 					</div>
// 				) : null}
// 				{selectedPaymentMethod === 'scalapay' && (
// 					<div className="flex flex-col justify-center">
// 						<div className="flex justify-center">
// 							<ScalapayWidget
// 								amountSelector="#checkout-total-price-for-widget"
// 								type="checkout"
// 							/>
// 						</div>
// 						<div className="flex justify-center mt-2">
// 							<button
// 								onClick={handleScalapayPayment}
// 								disabled={isProcessingScalapay || !isFormValid}
// 								className="w-1/2 mt-4 bg-custom-black font-tertiary-font  text-custom-white font-bold py-3 px-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-secondary-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// 							>
// 								{isProcessingScalapay ? (
// 									<>
// 										<div className="w-5 h-5 border-2 border-[#0d5045] border-t-transparent border-solid rounded-full animate-spin"></div>
// 										<span className='text-[1.8rem]'>Procesando...</span>
// 									</>
// 								) : (
// 									<p className='text-[1.8rem]'>Pagar con Scalapay</p>
// 								)}
// 							</button>
// 						</div>
// 					</div>
// 				)}
// 			</div>
// 			{!isFormValid && selectedPaymentMethodDisabled === 'sumup' ? (
// 				<p className="text-center text-sm text-red-500">
// 					*Para realizar el pago con tarjeta, todos los campos deben
// 					estar completos.
// 				</p>
// 			) : null}
// 			{!isFormValid &&
// 				selectedPaymentMethodDisabled === 'transferencia' ? (
// 				<p className="text-center text-sm text-red-500">
// 					*Para realizar el pago con transferencia, todos los campos
// 					deben estar completos.
// 				</p>
// 			) : null}
// 			{!isFormValid && selectedPaymentMethodDisabled === 'stripe' ? (
// 				<p className="text-center text-sm text-red-500">
// 					*Para realizar el pago con Klarna o Paypal, todos los campos
// 					deben estar completos.
// 				</p>
// 			) : null}
// 			{items.length === 0 ? (
// 				<p className="text-center text-sm text-red-500">
// 					*No hay productos en el carrito.
// 				</p>
// 			) : null}
// 		</div>
// 	)
// }

// export default PaymentSelection
'use client'
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeFormComponent from '../checkout/StripeFormComponent';
import SumupPayment from '../sumupPayment/sumupPayment';
import TransferPayment from '../transferPayment/transferPayment';
import { createPaymentIntent } from '../../../services/checkout/stripe.service';
import { createScalapayOrder } from '../../../services/checkout/scalapay.service';
import ScalapayWidget from '../scalapayWidget/ScalapayWiget';
import { FormsFields } from '../checkoutPage/CheckoutPage';
import { environment } from '../../../environment/environment';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { CreateOrderPayload } from '../../../types/scalapay';

const stripePromise = loadStripe(environment.stripe_publishable_key, {
	locale: 'es',
});

// --- NUEVO Componente Interno para manejar Stripe ---
const StripePaymentHandler = ({ purchaseIds, fieldsValue, items, userId }: {
    purchaseIds: string[];
    fieldsValue: FormsFields;
    items: any[];
    userId: string;
}) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Usamos una variable para evitar condiciones de carrera si el componente se desmonta
        let isMounted = true; 

        const fetchClientSecret = async () => {
            try {
                const totalAmount = items.reduce((acc, item) => acc + item.buscorepuestosPrice, 0);
                const res = await createPaymentIntent({
                    amount: Math.round(totalAmount * 100),
                    currency: 'eur',
                    cartIDs: purchaseIds,
                    userId: userId,
                    fieldsValue: fieldsValue,
                    automatic_payment_methods: { enabled: true },
                });

                if (isMounted) {
                    if (res.data?.client_secret) {
                        setClientSecret(res.data.client_secret);
                    } else {
                        throw new Error("No se recibió el client_secret de Stripe.");
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error al crear PaymentIntent de Stripe:", err);
                    setError("No se pudo iniciar el pago con tarjeta. Inténtalo de nuevo.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchClientSecret();

        return () => {
            isMounted = false; // Cleanup
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <-- EJECUTAR SOLO UNA VEZ AL MONTAR

    if (isLoading) {
        return (
            <div className="flex justify-center my-4 items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !clientSecret) {
        return <p style={{ color: 'red', marginTop: '10px' }}>{error || 'Error al cargar la pasarela de pago.'}</p>;
    }

    // --- LA SOLUCIÓN CLAVE ESTÁ AQUÍ ---
    // Usamos el `clientSecret` como `key`. Cuando `clientSecret` cambia (aunque no debería en este nuevo flujo),
    // React destruirá el componente <Elements> anterior y creará uno nuevo, que es lo que Stripe necesita.
    return (
        <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' }, locale: 'es' }}>
            <StripeFormComponent
                label={'Pagar ahora'}
                purchaseIds={purchaseIds}
                fieldsValues={fieldsValue}
            />
        </Elements>
    );
};


const PaymentSelection = ({
	purchaseIds,
	fieldsValue,
	numberPriceRounded,
	numberPrice,
	items,
	totalPrice,
	isSwitchOn,
	setFieldsValue,
	isProductPage,
}: {
	purchaseIds: string[]
	fieldsValue: FormsFields
	numberPriceRounded: number
	numberPrice: number
	nameRef: React.RefObject<HTMLInputElement>
	emailRef: React.RefObject<HTMLInputElement>
	nifRef: React.RefObject<HTMLInputElement>
	phoneNumberRef: React.RefObject<HTMLInputElement>
	shippingAddressRef: React.RefObject<HTMLInputElement>
	addressExtraRef: React.RefObject<HTMLInputElement>
	zipRef: React.RefObject<HTMLInputElement>
	cityRef: React.RefObject<HTMLInputElement>
	provinceRef: React.RefObject<HTMLInputElement>
	countryRef: React.RefObject<HTMLInputElement>
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
}) => {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		'stripe' | 'sumup' | 'transferencia' | 'scalapay' | null
	>(null)
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [isFormValid, setIsFormValid] = useState(false)

	const userId = typeof window !== 'undefined' ? localStorage.getItem('airtableUserId') : null

	useEffect(() => {
		const isFieldsComplete =
			fieldsValue.shippingAddress && fieldsValue.country && fieldsValue.city &&
			fieldsValue.addressExtra && fieldsValue.name && fieldsValue.email &&
			fieldsValue.zip && fieldsValue.nif && fieldsValue.phoneNumber &&
			fieldsValue.province;

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
			},
			cart: items,
		};
		
		localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
	};

	const handlePaymentSelection = async (method: 'stripe' | 'sumup' | 'transferencia' | 'scalapay') => {
		if (!isFormValid) {
			backToInputRefWhenError();
			Swal.fire({
				icon: 'warning',
				title: 'Faltan datos',
				text: 'Por favor, completa todos los campos de envío antes de continuar.',
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

		if (method === 'stripe' && !clientSecret) {
			setIsProcessing(true);
			try {
				const res = await createPaymentIntent({
					amount: numberPriceRounded,
					currency: 'eur',
					cartIDs: purchaseIds,
					userId: userId!,
					fieldsValue,
					automatic_payment_methods: { enabled: true },
				});
				setClientSecret(res.data.client_secret);
			} catch (error) {
				console.error("Error creando PaymentIntent de Stripe:", error);
				Swal.fire('Error', 'No se pudo iniciar el pago con tarjeta. Inténtalo de nuevo.', 'error');
				setSelectedPaymentMethod(null);
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
	
	const renderPaymentOptions = (enabled: boolean) => {
		const getButtonStyle = (method: string) => {
			if (!enabled) {
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
            <div className="flex mobile:flex-wrap justify-between mb-6 gap-3">
                <button
                    onClick={() => enabled && handlePaymentSelection('sumup')}
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
                    onClick={() => enabled && handlePaymentSelection('transferencia')}
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
                    onClick={() => enabled && handlePaymentSelection('stripe')}
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
                    onClick={() => enabled && handlePaymentSelection('scalapay')}
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
        );
    };


	return (
		<div className={`${!isProductPage && 'w-full mx-auto p-4 bg-white shadow-lg rounded-lg'}`}>
			<div style={{ display: 'none' }}>
				<span id="checkout-total-price-for-widget">{totalPrice}</span>
			</div>
			
			{renderPaymentOptions(isFormValid)}

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
						/>
					</div>
				)}
				{selectedPaymentMethod === 'stripe' ? (
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
				) : null}
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
