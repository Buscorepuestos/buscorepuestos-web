'use client'
import React, { useEffect, useState, Suspense, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../../../app/redux/features/shoppingCartSlice'
import { useStripe } from '@stripe/react-stripe-js'
import { updatePurchase } from '../../../services/purchase/purchase'
import { useSearchParams } from 'next/navigation'
import { createBill } from '../../../services/billing/billing.service'
import { userService } from '../../../services/user/userService'
import { updateUser } from '../../../services/mailchimp/mailchimp'
import { captureScalapayOrder } from '../../../services/checkout/scalapay.service';
import { BillingModel } from '../../../types/billing'
import Swal from 'sweetalert2'
import Image from 'next/image'
import './success.css'

const PaymentSuccessContent = () => {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<PaymentSuccess />
		</Suspense>
	)
}

const PaymentSuccess = () => {
	const [billingData, setBillingData] = useState<any>(null)
	const [extraData, setExtraData] = useState<any>(null)
	const [cart, setCart] = useState<[]>([])
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const hasCaptureBeenCalled = useRef(false);
	const [errorMessage, setErrorMessage] = useState('');
	const stripe = useStripe()
	const router = useRouter()
	const dispatch = useDispatch()
	const searchParams = useSearchParams()

	// useEffect(() => {
	// 	const payment_intent_id = searchParams.get('payment_intent')
	// 	const client_secret = searchParams.get('payment_intent_client_secret')
	// 	const pagoSummup = searchParams.get('pagoSumup')
	// 	const scalapayOrderToken = searchParams.get('orderToken');
	//     const scalapayStatus = searchParams.get('status');

	// 	const createBilling = async () => {
	// 		try {
	// 			const storedBillingData = localStorage.getItem('billingData')
	// 			const storedExtraData = localStorage.getItem('extraData')
	// 			const cart = localStorage.getItem('copyCart')
	// 			const userAddress = localStorage.getItem('userAddress')

	// 			if (storedBillingData && cart) {
	// 				const parsedBillingData = JSON.parse(storedBillingData)
	// 				const parsedCart = JSON.parse(cart)
	// 				const parsedEmailData = storedExtraData
	// 					? JSON.parse(storedExtraData)
	// 					: null
	// 				const parsedAddressData = userAddress
	// 					? JSON.parse(userAddress)
	// 					: null

	// 				setBillingData(parsedBillingData)
	// 				setExtraData(parsedEmailData)
	// 				setCart(parsedCart)
	// 				dispatch(clearCart())

	// 				const billingExecuted =
	// 					localStorage.getItem('billingExecuted')
	// 				if (!billingExecuted) {
	// 					if (!pagoSummup) {
	// 						await createBill(parsedBillingData)
	// 						parsedBillingData.Compras.forEach(async (purchaseId: any) => {
	// 							await updatePurchase(purchaseId);
	// 						});
	// 						await userService.createUserAddresses(
	// 							parsedAddressData
	// 						)
	// 					}
	// 					await userService.updateUser({
	// 						id: parsedBillingData.Usuarios[0],
	// 						['correo electronico']: parsedEmailData?.email,
	// 					})
	// 					localStorage.setItem('billingExecuted', 'true')
	// 				}
	// 			} else {
	// 				console.error('No billing data or cart found')
	// 			}
	// 		} catch (error) {
	// 			console.error('Error creating billing:', error)
	// 		}
	// 	}

	// 	const finalizeScalapayPayment = async (token: string) => {
	// 		if (hasCaptureBeenCalled.current) {
	//             console.log("La captura de Scalapay ya ha sido iniciada. Saltando ejecución duplicada.");
	//             return;
	//         }
	//         // Marcamos que hemos iniciado el proceso para evitar futuras ejecuciones
	//         hasCaptureBeenCalled.current = true;
	//         try {
	//             console.log(`Iniciando captura para Scalapay orderToken: ${token}`);
	//             const captureResponse = await captureScalapayOrder(token);

	//             if (captureResponse.status === 'APPROVED') {
	//                 console.log('Captura de Scalapay exitosa. Procediendo a crear la factura.');
	//                 // Si la captura es exitosa, creamos la factura y limpiamos el carrito
	//                 await createBilling();
	//                 setStatus('success');
	//             } else {
	//                 throw new Error('El pago con Scalapay fue denegado.');
	//             }
	//         } catch (error: any) {
	//             console.error("Error al finalizar el pago con Scalapay:", error);
	//             setErrorMessage(error.message || 'Ocurrió un error al confirmar tu pago.');
	//             setStatus('error');
	//         }
	//     };

	// 	const getPaymentIntent = async (paymentIntentId: string) => {
	// 		if (!stripe || !paymentIntentId) return null

	// 		try {
	// 			const { paymentIntent } =
	// 				await stripe.retrievePaymentIntent(paymentIntentId)
	// 			return paymentIntent
	// 		} catch (error) {
	// 			console.error('Error retrieving payment intent:', error)
	// 			return null
	// 		}
	// 	}

	// 	const verifyPayment = async () => {
	// 		if (payment_intent_id) {
	// 			const paymentIntent = client_secret
	// 				? await getPaymentIntent(client_secret)
	// 				: null
	// 			if (paymentIntent) {
	// 				if (paymentIntent.status === 'succeeded') {
	// 					await createBilling()
	// 				} else {
	// 					Swal.fire({
	// 						title: 'Error en el pago',
	// 						text: 'Ha ocurrido un error al procesar tu pago',
	// 						icon: 'error',
	// 						confirmButtonText: 'Aceptar',
	// 					}).then(() => router.push('/'))
	// 				}
	// 			}
	// 		}
	// 		if (scalapayOrderToken && scalapayStatus === 'SUCCESS') {
	//             const billingExecuted = localStorage.getItem('billingExecuted');
	//             if (!billingExecuted) {
	//                 await finalizeScalapayPayment(scalapayOrderToken);
	//             } else {
	//                 // Si ya se ejecutó, simplemente mostramos los datos
	//                 await createBilling();
	//                 setStatus('success');
	//             }
	//         } else if (scalapayStatus === 'FAILURE') {
	//             setErrorMessage('El pago con Scalapay ha fallado.');
	//             setStatus('error');
	//         }
	// 	}

	// 	verifyPayment()

	// 	if (pagoSummup === 'true') {
	// 		createBilling()
	// 	}
	// }, [dispatch, router, searchParams, stripe])

	// const PaymentSuccess = () => {
	// ... tus estados ...
	const hasBeenProcessed = useRef(false);

	useEffect(() => {
		const source = searchParams.get('source');
		const payment_intent_id = searchParams.get('payment_intent');
		const client_secret = searchParams.get('payment_intent_client_secret')
		const pagoSummup = searchParams.get('pagoSumup');
		const scalapayOrderToken = searchParams.get('orderToken');
		if (!stripe && payment_intent_id) {
			console.log("Esperando a que la instancia de Stripe esté lista...");
			return;
		}
		if (hasBeenProcessed.current) return;

		const processPayment = async () => {
			hasBeenProcessed.current = true;

			const pendingOrderJSON = localStorage.getItem('pendingOrder');
			if (!pendingOrderJSON) {
				console.warn("No se encontró 'pendingOrder' en localStorage.");
				// Si no hay datos, puede que ya se haya procesado.
				// Intentamos cargar los datos de la última factura si existen
				const lastBilling = localStorage.getItem('lastBillingSuccess');
				if (lastBilling) {
					const parsedData = JSON.parse(lastBilling);
					setBillingData(parsedData.billingData);
					setExtraData(parsedData.extraData);
					setCart(parsedData.cart);
					setStatus('success');
				} else {
					setStatus('error');
					setErrorMessage('No se encontraron datos del pedido.');
				}
				return;
			}

			const pendingOrder = JSON.parse(pendingOrderJSON);
			const { billingData, cart, extraData } = pendingOrder;

			const purchaseIds = billingData.Compras;
			const userId = billingData.Usuarios[0];

			// Rellenamos los estados para mostrar la info al final
			setCart(cart);
			dispatch(clearCart());

			try {
				let paymentSuccessful = false;
				interface PaymentIdField {
					'Id Pago Scalapay'?: string | undefined;
					'Id Pago Stripe'?: string | undefined;
					'Id Pago Summup'?: string | undefined;
				}
				let paymentIdField: PaymentIdField = {}; // Objeto para el campo de ID de pago

				const getPaymentIntent = async (paymentIntentId: string) => {
					if (!stripe || !paymentIntentId) return null
					try {
						const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentId)
						return paymentIntent
					} catch (error) {
						console.error('Error retrieving payment intent:', error)
						return null
					}
				}

				// 1. VERIFICAR PAGO Y OBTENER ID
				if (source === 'scalapay' && pendingOrder.paymentMethod === 'scalapay') {
					if (scalapayOrderToken) {
						const captureResponse = await captureScalapayOrder(scalapayOrderToken);
						paymentSuccessful = captureResponse.status === 'APPROVED';
						if (paymentSuccessful) {
							paymentIdField = { 'Id Pago Scalapay': scalapayOrderToken };
						}
					}
				} else if (payment_intent_id && client_secret && pendingOrder.paymentMethod === 'stripe') {
					const paymentIntent = client_secret
						? await getPaymentIntent(client_secret)
						: null
					paymentSuccessful = paymentIntent?.status === 'succeeded';
					if (paymentSuccessful && paymentIntent) {
						paymentIdField = { 'Id Pago Stripe': paymentIntent.id };
					}
				} else if (pagoSummup === 'true' && pendingOrder.paymentMethod === 'sumup') {
					paymentSuccessful = true;
					const transactionCode = searchParams.get('transaction_code');
					paymentIdField = transactionCode ? { 'Id Pago Summup': transactionCode } : {};
				}

				// 2. CONSTRUIR Y EJECUTAR LÓGICA DE FACTURACIÓN SI EL PAGO FUE EXITOSO
				if (paymentSuccessful) {
					try {
						// Construimos el objeto final de facturación
						const finalBillingData: BillingModel = {
							...paymentIdField, // Añade el campo de ID de pago correcto
							Compras: purchaseIds,
							Usuarios: [userId!],
							transfer: false,
							address: billingData.address,
							country: billingData.country,
							location: billingData.location,
							addressNumber: billingData.addressNumber,
							name: billingData.name,
							cp: billingData.cp,
							nif: billingData.nif,
							phone: Number(billingData.phone),
							province: billingData.province,
						};

						// Rellenamos los estados para la UI
						setBillingData(finalBillingData);
						setExtraData(pendingOrder.extraData);

						// Ejecutamos todas las acciones post-pago
						await createBill(finalBillingData);
						try {
							await updateUser({
								firstName: billingData.name,
								email: extraData.email,
								address: billingData.address,
								addressExtra: billingData.addressNumber,
								zip: billingData.cp,
								state: billingData.province,
							});
						} catch (updateUserError) {
							console.error("Error en updateUser (no crítico para el pago):", updateUserError);
						}
						await userService.createUserAddresses({
							user: [userId!],
							name: billingData.name,
							nif: billingData.nif,
							address: billingData.address,
							country: billingData.country,
							location: billingData.location,
							addressNumber: billingData.addressNumber,
							phone: Number(billingData.phone),
							province: billingData.province,
							cp: billingData.cp,
							["Correo electrónico"]: extraData.email,
						});
						const metodo = paymentIdField['Id Pago Scalapay'] ? 'plazos' : paymentIdField['Id Pago Stripe'] ? 'tarjeta' : 'tarjeta';
						purchaseIds.forEach(async (purchaseId: any) => {
							await updatePurchase(purchaseId, metodo);
						});

						setStatus('success');
						console.log("Factura creada y compras actualizadas.");

						// Guardamos una copia para recargas de página y limpiamos el pendiente
						localStorage.setItem('lastBillingSuccess', JSON.stringify({
							billingData: finalBillingData,
							extraData: pendingOrder.extraData,
							cart: cart
						}));
						localStorage.removeItem('pendingOrder');
					} catch (billingError) {
						console.error("Error en el proceso de facturación:", billingError);
						throw new Error('Ocurrió un error al generar tu factura.');
					}
				} else {
					throw new Error('El pago no fue exitoso o fue cancelado.');
				}
			} catch (error: any) {
				console.error("Error procesando el pago:", error);
				setErrorMessage(error.message || 'Ocurrió un error al procesar tu pedido.');
				setStatus('error');
			}
		};

		processPayment();

	}, [dispatch, router, searchParams, stripe, status]);

	if (status === 'loading') {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
				<p className="mt-4 text-lg font-semibold">Procesando tu pedido, por favor espera...</p>
			</div>
		);
	}

	if (status === 'error') {
		Swal.fire({
			title: 'Error en el pago',
			text: errorMessage || 'Ha ocurrido un error al procesar tu pago.',
			icon: 'error',
			confirmButtonText: 'Volver al carrito',
		}).then(() => router.push('/verificacion-pago'));
		return null; // No renderizar nada mientras se muestra el Swal
	}

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
									<strong>Código postal:</strong> {extraData?.billingZip}
								</p>

								<p className="font-bold text-xl md:text-2xl lg:text-3xl mobile:text-[2rem] pt-6 mb-4 text-secondary-blue border-b-2 pb-3">
									Productos
								</p>
								<div className="space-y-5">
									{cart.map((product: any) => (
										<div key={product.id} className="flex items-center gap-5">
											<Image
												src={product.images[0]}
												alt={product.title}
												width={90}
												height={90}
												className="rounded-lg object-cover flex-shrink-0"
											/>
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
}

export default PaymentSuccessContent
