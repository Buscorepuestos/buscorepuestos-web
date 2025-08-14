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
