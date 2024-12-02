import React, { useState, useEffect, useRef } from 'react'
import PaymentForm from '../checkout/PaymentForm'
import SumupPayment from '../sumupPayment/sumupPayment'
import TransferPayment from '../transferPayment/transferPayment'
import { FormsFields } from '../../../verificacion-pago/page'
import { createPaymentIntent } from '../../../services/checkout/stripe.service'
import Image from 'next/image'

const PaymentSelection = ({
	purchaseIds,
	fieldsValue,
	numberPriceRounded,
	numberPrice,
	nameRef,
	emailRef,
	nifRef,
	phoneNumberRef,
	shippingAddressRef,
	addressExtraRef,
	zipRef,
	cityRef,
	provinceRef,
	countryRef,
	setIsScrolledInputs,
	isScrolledInputs,
	items,
	totalPrice,
	isSwitchOn,
	setFieldsValue,
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
			name: boolean
			email: boolean
			nif: boolean
			phoneNumber: boolean
			shippingAddress: boolean
			addressExtra: boolean
			zip: boolean
			city: boolean
			province: boolean
			country: boolean
		}>
	>
	isScrolledInputs: {
		name: boolean
		email: boolean
		nif: boolean
		phoneNumber: boolean
		shippingAddress: boolean
		addressExtra: boolean
		zip: boolean
		city: boolean
		province: boolean
		country: boolean
	}
	items: any[]
	totalPrice: string
	isSwitchOn: boolean
	setFieldsValue: React.Dispatch<React.SetStateAction<FormsFields>>
}) => {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		'stripe' | 'sumup' | 'transferencia' | null
	>(null)

	const [selectedPaymentMethodDisabled, setSelectedPaymentMethodDisabled] =
		useState<'stripe' | 'sumup' | 'transferencia' | null>(null)
	const [clientSecretExists, setClientSecretExists] = useState(false)
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const prevPurchaseIdsRef = useRef<string[]>([])
	const createPayuPaymentIntent = async () => {
		const res = await createPaymentIntent({
			amount: numberPriceRounded,
			currency: 'eur',
			cartIDs: purchaseIds,
			automatic_payment_methods: { enabled: true },
		})
		setClientSecret(res.data.client_secret)
		setClientSecretExists(true)
		return res
	}

	const handlePaymentSelection = (
		method: 'stripe' | 'sumup' | 'transferencia'
	) => {
		setSelectedPaymentMethod(method)
		if (isSwitchOn) {
			setFieldsValue((prevState) => ({
				...prevState,
				billingAddress: fieldsValue.shippingAddress,
				billingAddressExtra: fieldsValue.addressExtra,
				billingZip: fieldsValue.zip,
				billingProvince: fieldsValue.province,
			}))
		}
		if (
			method === 'stripe' &&
			!clientSecretExists &&
			JSON.stringify(prevPurchaseIdsRef.current) !==
				JSON.stringify(purchaseIds)
		) {
			createPayuPaymentIntent()
			prevPurchaseIdsRef.current = purchaseIds
		}
	}

	const handlePaymentSelectionDisabled = (
		method: 'stripe' | 'sumup' | 'transferencia'
	) => {
		setSelectedPaymentMethodDisabled(method)
	}

	const [isFormValid, setIsFormValid] = useState(false)

	useEffect(() => {
		const isFieldsComplete =
			fieldsValue.shippingAddress &&
			fieldsValue.country &&
			fieldsValue.city &&
			fieldsValue.addressExtra &&
			fieldsValue.name &&
			fieldsValue.email &&
			fieldsValue.zip &&
			fieldsValue.nif &&
			fieldsValue.phoneNumber &&
			fieldsValue.province

		setIsFormValid(!!isFieldsComplete)
	}, [fieldsValue])

	useEffect(() => {
		if (isFormValid) {
			setIsScrolledInputs({
				name: false,
				email: false,
				nif: false,
				phoneNumber: false,
				shippingAddress: false,
				addressExtra: false,
				zip: false,
				city: false,
				province: false,
				country: false,
			})
		}
	}, [isFormValid, setIsScrolledInputs])

	useEffect(() => {
		if (!isFormValid) {
			setSelectedPaymentMethod(null)
		}
	}, [isFormValid])

	const backToInputRefWhenError = () => {
		if (!isFormValid) {
			if (!countryRef.current?.value) {
				countryRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					country: true,
				})
			}
			if (!provinceRef.current?.value) {
				provinceRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					province: true,
				})
			}
			if (!cityRef.current?.value) {
				cityRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					city: true,
				})
			}
			if (!zipRef.current?.value) {
				zipRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					zip: true,
				})
			}
			if (!addressExtraRef.current?.value) {
				addressExtraRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					addressExtra: true,
				})
			}
			if (!shippingAddressRef.current?.value) {
				shippingAddressRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					shippingAddress: true,
				})
			}
			if (!phoneNumberRef.current?.value) {
				phoneNumberRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					phoneNumber: true,
				})
			}
			if (!nifRef.current?.value) {
				nifRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					nif: true,
				})
			}
			if (!emailRef.current?.value) {
				emailRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					email: true,
				})
			}
			if (!nameRef.current?.value) {
				nameRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
				setIsScrolledInputs({
					...isScrolledInputs,
					name: true,
				})
			}
		}
	}

	return (
		<div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
			{isFormValid ? (
				<div className="flex justify-between mb-6 gap-4">
					<button
						onClick={() => {
							handlePaymentSelection('sumup')
							setTimeout(() => {
								backToInputRefWhenError()
							}, 200)
						}}
						className={`w-full flex gap-3 items-center justify-center px-6 py-2 border-[1px] rounded-lg transition-all duration-300 
				${
					selectedPaymentMethod === 'sumup'
						? 'bg-secondary-blue text-white border-secondary-blue'
						: 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'
				} xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[2.7vw]
				mobile:flex mobile:flex-col mobile:gap-2 mobile:items-center mobile:justify-center
				`}
					>
						{selectedPaymentMethod === 'sumup' ? (
							<Image
								src="/tarjeta-blanca.svg"
								alt="stripe"
								width={46}
								height={46}
								className="w-14 h-14 rounded-md"
							/>
						) : (
							<Image
								src="/tarjeta.svg"
								alt="stripe"
								width={46}
								height={46}
								className="w-14 h-14 rounded-md"
							/>
						)}
						Pago con tarjeta
					</button>
					<button
						onClick={() => {
							handlePaymentSelection('transferencia')
							setTimeout(() => {
								backToInputRefWhenError()
							}, 200)
						}}
						className={`w-full flex gap-3 items-center justify-center px-6 py-2 border-[1px] rounded-lg transition-all duration-300 
				${
					selectedPaymentMethod === 'transferencia'
						? 'bg-secondary-blue text-white border-secondary-blue'
						: 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'
				} xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[2.7vw]
				mobile:flex mobile:flex-col mobile:gap-2 mobile:items-center mobile:justify-center
				`}
					>
						{selectedPaymentMethod === 'transferencia' ? (
							<Image
								src="/Transferencia-white.svg"
								alt="transferencia"
								width={46}
								height={46}
								className="w-14 h-14 rounded-md"
							/>
						) : (
							<Image
								src="/transferencia.svg"
								alt="transferencia"
								width={46}
								height={46}
								className="w-14 h-14 rounded-md"
							/>
						)}
						Transferencia
					</button>
					<button
						onClick={() => {
							handlePaymentSelection('stripe')
							setTimeout(() => {
								backToInputRefWhenError()
							}, 200)
						}}
						className={`w-full flex gap-3 items-center justify-center px-4 py-2  border-[1px] rounded-lg transition-all duration-300 
				${
					selectedPaymentMethod === 'stripe'
						? 'bg-secondary-blue text-white border-secondary-blue'
						: 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'
				} xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[2.7vw]
				mobile:flex mobile:flex-col
				`}
					>
						<div className="flex gap-4 ">
							<Image
								src="/klarna.png"
								alt="klarna"
								width={56}
								height={56}
								className="w-10 h-10 rounded-md"
							/>
							<Image
								src="/paypal.png"
								alt="paypal"
								width={56}
								height={56}
								className="w-10 h-10 rounded-md"
							/>
						</div>
						<pre>
							En 3 plazos, <br />
							Paypal
						</pre>
					</button>
				</div>
			) : (
				<div className="flex justify-between mb-6 gap-4">
					<button
						onClick={() => {
							handlePaymentSelectionDisabled('sumup')
							setTimeout(() => {
								backToInputRefWhenError()
							}, 200)
						}}
						className={`
							w-full flex gap-3 items-center justify-center px-6 py-2 
							border-[1px] rounded-lg transition-all duration-300 
							bg-light-grey text-alter-grey border-light-grey
							xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] 
							mobile:text-[2.7vw] mobile:flex mobile:flex-col mobile:gap-2 
							mobile:items-center mobile:justify-center
						`}
					>
						<Image
							src="/tarjeta-gris.svg"
							alt="stripe"
							width={46}
							height={46}
							className="w-14 h-14 rounded-md"
						/>
						Pago con tarjeta
					</button>
					<button
						onClick={() => {
							handlePaymentSelectionDisabled('transferencia')
							setTimeout(() => {
								backToInputRefWhenError()
							}, 200)
						}}
						className={`
							w-full flex gap-3 items-center justify-center px-6 py-2 
							border-[1px] rounded-lg transition-all duration-300 
							bg-light-grey text-alter-grey border-light-grey
							xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] 
							mobile:text-[2.7vw] mobile:flex mobile:flex-col mobile:gap-2 
							mobile:items-center mobile:justify-center
						`}
					>
						<Image
							src="/transferencia-gris.svg"
							alt="transferencia"
							width={46}
							height={46}
							className="w-14 h-14 rounded-md"
						/>
						Transferencia
					</button>
					<button
						onClick={() => {
							handlePaymentSelectionDisabled('stripe')
							setTimeout(() => {
								backToInputRefWhenError()
							}, 200)
						}}
						className={`
							w-full flex gap-3 items-center justify-center px-4 py-2  
							border-[1px] rounded-lg transition-all duration-300 	
							bg-light-grey text-alter-grey border-light-grey
							xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] 
							mobile:text-[2.7vw] mobile:flex mobile:flex-col
						`}
					>
						<div className="flex gap-4 ">
							<Image
								src="/klarna.png"
								alt="klarna"
								width={56}
								height={56}
								className="w-10 h-10 rounded-md"
							/>
							<Image
								src="/paypal.png"
								alt="paypal"
								width={56}
								height={56}
								className="w-10 h-10 rounded-md"
							/>
						</div>
						<pre>
							En 3 plazos, <br />
							Paypal
						</pre>
					</button>
				</div>
			)}

			<div className="mt-8">
				{selectedPaymentMethod === 'sumup' && (
					<div className="flex justify-center">
						<SumupPayment
							purchaseIds={purchaseIds}
							fieldsValue={fieldsValue}
							numberPriceRounded={numberPrice}
							items={items}
						/>
					</div>
				)}
				{selectedPaymentMethod === 'transferencia' && isFormValid && (
					<div className="flex justify-center">
						<TransferPayment
							totalPrice={totalPrice}
							purchaseIds={purchaseIds}
							fieldsValue={fieldsValue}
						/>
					</div>
				)}
				{selectedPaymentMethod === 'stripe' && clientSecret ? (
					<div className="flex justify-center">
						{clientSecret && (
							<PaymentForm
								clientSecret={clientSecret}
								purchaseIds={purchaseIds}
								fieldsValues={fieldsValue}
								items={items}
							/>
						)}
					</div>
				) : selectedPaymentMethod === 'stripe' && !clientSecret ? (
					<div className="flex justify-center my-4">
						<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
					</div>
				): null}
			</div>
			{!isFormValid && selectedPaymentMethodDisabled === 'sumup' ? (
				<p className="text-center text-sm text-red-500">
					*Para realizar el pago con tarjeta, todos los campos deben
					estar completos.
				</p>
			) : null}
			{!isFormValid &&
			selectedPaymentMethodDisabled === 'transferencia' ? (
				<p className="text-center text-sm text-red-500">
					*Para realizar el pago con transferencia, todos los campos
					deben estar completos.
				</p>
			) : null}
			{!isFormValid && selectedPaymentMethodDisabled === 'stripe' ? (
				<p className="text-center text-sm text-red-500">
					*Para realizar el pago con Klarna o Paypal, todos los campos
					deben estar completos.
				</p>
			) : null}
			{items.length === 0 ? (
				<p className="text-center text-sm text-red-500">
					*No hay productos en el carrito.
				</p>
			) : null}
		</div>
	)
}

export default PaymentSelection
