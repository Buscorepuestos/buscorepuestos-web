'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../../../app/redux/features/shoppingCartSlice'
import { useStripe } from '@stripe/react-stripe-js'
import { updatePurchase } from '../../../services/purchase/purchase'
import { useSearchParams } from 'next/navigation'
import { createBill } from '../../../services/billing/billing.service'
import { userService } from '../../../services/user/userService'
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
	const stripe = useStripe()
	const router = useRouter()
	const dispatch = useDispatch()
	const searchParams = useSearchParams()
	const pagoSummup = searchParams.get('pagoSumup')

	// useEffect(() => {
	// 	const payment_intent_id = searchParams.get('payment_intent')
	// 	const client_secret = searchParams.get('payment_intent_client_secret')

	// 	const createBilling = async () => {
	// 		const storedBillingData = localStorage.getItem('billingData')
	// 		let parsedEmailData: any

	// 		if (storedBillingData) {
	// 			try {
	// 				const parsedBillingData = JSON.parse(storedBillingData)
	// 				setBillingData(parsedBillingData)

	// 				const storedExtraData = localStorage.getItem('extraData')

	// 				if (storedExtraData) {
	// 					parsedEmailData = JSON.parse(storedExtraData)
	// 					setExtraData(parsedEmailData)
	// 				}

	// 				const cart = localStorage.getItem('copyCart')

	// 				if (cart) {
	// 					const parsedCart = JSON.parse(cart)
	// 					setCart(parsedCart)
	// 				}

	// 				dispatch(clearCart())

	// 			} catch (error) {
	// 				console.error(
	// 					'Error parsing or processing billing data:',
	// 					error
	// 				)
	// 			}
	// 		} else {
	// 			console.error('No billing data found in localStorage')
	// 		}
	// 	}

	// 	const getPaymentIntent = async (paymentIntentId: string) => {
	// 		if (!stripe || !paymentIntentId) {
	// 			return null
	// 		}

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
	// 		if (!payment_intent_id) {
	// 			return
	// 		}

	// 		const paymentIntent = client_secret
	// 			? await getPaymentIntent(client_secret)
	// 			: null

	// 		if (paymentIntent) {
	// 			if (paymentIntent?.status === 'succeeded') {
	// 				await createBilling()
	// 			} else {
	// 				Swal.fire({
	// 					title: 'Error en el pago',
	// 					text: 'Ha ocurrido un error al procesar tu pago',
	// 					icon: 'error',
	// 					confirmButtonText: 'Aceptar',
	// 				}).then((result) => {
	// 					if (result.isConfirmed) {
	// 						router.push('/')
	// 					}
	// 				})
	// 			}
	// 		}
	// 	}

	// 	verifyPayment()

	// 	const verifySummupPayment = async () => {
	// 		if (pagoSummup === 'true') {
	// 			console.log('Pago Summup')
	// 			await createBilling()
	// 		}
	// 	}

	// 	verifySummupPayment()
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [
	// 	dispatch,
	// 	router,
	// 	searchParams,
	// 	stripe,
	// ])

	// useEffect(() => {
	// 	const storedBillingData = localStorage.getItem('billingData')
	// 	const storedExtraData = localStorage.getItem('extraData')
	// 	const userAddress = localStorage.getItem('userAddress')
	// 	let parsedBillingData: any
	// 	let parsedEmailData: any
	// 	let userAddressData: any
	// 	if (storedBillingData) {
	// 		parsedBillingData = JSON.parse(storedBillingData)
	// 	}
	// 	if (storedExtraData) {
	// 		parsedEmailData = JSON.parse(storedExtraData)
	// 	}
	// 	if (userAddress) {
	// 		userAddressData = JSON.parse(userAddress)
	// 	}
	// 	const billingExecuted = async () => {
	// 			const billingExecuted =
	// 			localStorage.getItem('billingExecuted')
	// 		if (!billingExecuted) {
	// 			if (!pagoSummup) {
	// 				await createBill(parsedBillingData)
	// 				await userService.createUserAddresses(userAddressData)
	// 			}
	// 			await userService.updateUser({
	// 				id: parsedBillingData.Usuarios[0],
	// 				['correo electronico']: parsedEmailData.email,
	// 			})
	// 			// Marcar que las funciones ya se han ejecutado
	// 			localStorage.setItem('billingExecuted', 'true')
	// 		}
	// 	}
	// 	billingExecuted()
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [])

	useEffect(() => {
		const payment_intent_id = searchParams.get('payment_intent')
		const client_secret = searchParams.get('payment_intent_client_secret')
		const pagoSummup = searchParams.get('pagoSumup')

		const createBilling = async () => {
			try {
				const storedBillingData = localStorage.getItem('billingData')
				const storedExtraData = localStorage.getItem('extraData')
				const cart = localStorage.getItem('copyCart')
				const userAddress = localStorage.getItem('userAddress')

				if (storedBillingData && cart) {
					const parsedBillingData = JSON.parse(storedBillingData)
					const parsedCart = JSON.parse(cart)
					const parsedEmailData = storedExtraData
						? JSON.parse(storedExtraData)
						: null
					const parsedAddressData = userAddress
						? JSON.parse(userAddress)
						: null

					setBillingData(parsedBillingData)
					setExtraData(parsedEmailData)
					setCart(parsedCart)
					dispatch(clearCart())

					const billingExecuted =
						localStorage.getItem('billingExecuted')
					if (!billingExecuted) {
						if (!pagoSummup) {
							await createBill(parsedBillingData)
							parsedBillingData.Compras.forEach(async (purchaseId: any) => {
								await updatePurchase(purchaseId);
							});
							await userService.createUserAddresses(
								parsedAddressData
							)
						}
						await userService.updateUser({
							id: parsedBillingData.Usuarios[0],
							['correo electronico']: parsedEmailData?.email,
						})
						localStorage.setItem('billingExecuted', 'true')
					}
				} else {
					console.error('No billing data or cart found')
				}
			} catch (error) {
				console.error('Error creating billing:', error)
			}
		}

		const getPaymentIntent = async (paymentIntentId: string) => {
			if (!stripe || !paymentIntentId) return null

			try {
				const { paymentIntent } =
					await stripe.retrievePaymentIntent(paymentIntentId)
				return paymentIntent
			} catch (error) {
				console.error('Error retrieving payment intent:', error)
				return null
			}
		}

		const verifyPayment = async () => {
			if (payment_intent_id) {
				const paymentIntent = client_secret
					? await getPaymentIntent(client_secret)
					: null
				if (paymentIntent) {
					if (paymentIntent.status === 'succeeded') {
						await createBilling()
					} else {
						Swal.fire({
							title: 'Error en el pago',
							text: 'Ha ocurrido un error al procesar tu pago',
							icon: 'error',
							confirmButtonText: 'Aceptar',
						}).then(() => router.push('/'))
					}
				}
			}
		}

		verifyPayment()

		if (pagoSummup === 'true') {
			createBilling()
		}
	}, [dispatch, router, searchParams, stripe])

	return (
		<div className="flex items-center justify-center min-h-screen font-tertiary-font mt-[20rem] mb-[5rem] mobile:mt-[15rem]">
			<div className="w-full max-w-[60vw] border-[4px] border-secondary-blue p-12 rounded-xl shadow-xl bg-white">
				<p className="font-bold text-primary-blue text-[2.8rem] text-center mb-6">
					Pago exitoso
				</p>
				<p className="font-bold text-[2.8rem] text-center mb-4 text-dark-grey">
					Detalles de Facturación
				</p>
				{billingData ? (
					<div>
						<div className="sm:grid sm:grid-cols-2 justify-center justify-items-center">
							<div className="space-y-4 text-[2.3rem] text-dark-grey">
								<p className="font-bold text-[2.5rem] mb-2 text-secondary-blue">
									Datos personales
								</p>
								<p>
									<strong>Nombre y apellidos:</strong>{' '}
									{billingData.name}
								</p>
								<p>
									<strong>Teléfono:</strong>{' '}
									{billingData.phone}
								</p>
								<p>
									<strong>Email:</strong> {extraData.email}
								</p>
								<p className="font-bold text-[2.5rem] mb-2 text-secondary-blue">
									Direccion de envío
								</p>
								<p>
									<strong>Dirección:</strong>{' '}
									{billingData.address}
								</p>
								<p>
									<strong>Número de Dirección:</strong>{' '}
									{billingData.addressNumber}
								</p>
								<p>
									<strong>Provincia:</strong>{' '}
									{billingData.province}
								</p>
								<p>
									<strong>Ciudad:</strong>{' '}
									{billingData.location}
								</p>
								<p>
									<strong>País:</strong> {billingData.country}
								</p>
								<p>
									<strong>Código Postal:</strong>{' '}
									{billingData.cp}
								</p>
								<p>
									<strong>NIF:</strong> {billingData.nif}
								</p>
							</div>
							<div className="space-y-4 text-[2.3rem] text-dark-grey">
								<p className="font-bold text-[2.5rem] mb-2 text-secondary-blue">
									Dirección de facturación
								</p>
								<p>
									<strong>Dirección:</strong>{' '}
									{extraData.billingAddress}
								</p>
								<p>
									<strong>Número de Dirección:</strong>{' '}
									{extraData.billingAddressExtra}
								</p>
								<p>
									<strong>Provincia:</strong>{' '}
									{extraData.billingProvince}
								</p>
								<p>
									<strong>Código Postal:</strong>{' '}
									{extraData.billingZip}
								</p>
								<p className="font-bold text-[2.5rem] mb-2 text-secondary-blue">
									Productos
								</p>
								{cart.map((product: any) => (
									<div
										key={product.id}
										className="flex gap-2"
									>
										<Image
											src={product.images[0]}
											alt={product.title}
											width={100}
											height={100}
											className="rounded-lg"
										/>
										<p>{product.title}</p>
									</div>
								))}
							</div>
						</div>
						<div className="flex justify-center mt-6">
							<Image
								src="/nuevo-logo-buscorepuestos.png"
								alt="Logo"
								className="mb-4"
								width={350}
								height={350}
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
