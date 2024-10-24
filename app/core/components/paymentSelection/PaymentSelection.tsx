import React, { useState, useEffect } from 'react'
import PaymentForm from '../checkout/PaymentForm'
import SumupPayment from '../sumupPayment/sumupPayment'
import { FormsFields } from '../../../verificacion-pago/page'
import Image from 'next/image'

const PaymentSelection = ({
	clientSecret,
	purchaseIds,
	fieldsValue,
	numberPriceRounded,
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
}: {
	clientSecret: string
	purchaseIds: string[]
	fieldsValue: FormsFields
	numberPriceRounded: number
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
	setIsScrolledInputs: React.Dispatch<React.SetStateAction<{
		name: boolean;
		email: boolean;
		nif: boolean;
		phoneNumber: boolean;
		shippingAddress: boolean;
		addressExtra: boolean;
		zip: boolean;
		city: boolean;
		province: boolean;
		country: boolean;
	}>>
	isScrolledInputs: { 
		name: boolean;
		email: boolean;
		nif: boolean;
		phoneNumber: boolean;
		shippingAddress: boolean;
		addressExtra: boolean;
		zip: boolean;
		city: boolean;
		province: boolean;
		country: boolean;
	},
	items: any[]
}) => {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		'stripe' | 'sumup' | null
	>(null)

	const handlePaymentSelection = (method: 'stripe' | 'sumup') => {
		setSelectedPaymentMethod(method)
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

	const backToInputRefWhenError = () => {
		if (!isFormValid) {
			if (!nameRef.current?.value) {
				nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					name: true,
				})
			}
			if (!emailRef.current?.value) {
				emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					email: true,
				})
			}
			if (!nifRef.current?.value) {
				nifRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					nif: true,
				})
			}
			if (!phoneNumberRef.current?.value) {
				phoneNumberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					phoneNumber: true,
				})
			}
			if (!shippingAddressRef.current?.value) {
				shippingAddressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					shippingAddress: true,
				})
			}
			if (!addressExtraRef.current?.value) {
				addressExtraRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					addressExtra: true,
				})
			}
			if (!zipRef.current?.value) {
				zipRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					zip: true,
				})
			}
			if (!cityRef.current?.value) {
				cityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					city: true,
				})
			}
			if (!provinceRef.current?.value) {
				provinceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					province: true,
				})
			}
			if (!countryRef.current?.value) {
				countryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				setIsScrolledInputs({
					...isScrolledInputs,
					country: true,
				})
			}
		}
	}

	return (
		<div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
			<div className="flex justify-between mb-6 gap-4">
				<button
					onClick={() => {
						handlePaymentSelection('sumup')
						setTimeout(() => {
							backToInputRefWhenError()
						}, 200)
					}}
					className={`w-full flex gap-3 items-center justify-center px-6 py-2 ml-2 border-[1px] rounded-lg transition-all duration-300 
            ${
				selectedPaymentMethod === 'sumup'
					? 'bg-secondary-blue text-white border-secondary-blue'
					: 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'
			} xl:text-[1vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[2.7vw]`}
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
						handlePaymentSelection('stripe')
						setTimeout(() => {
							backToInputRefWhenError()
						}, 200)
					}}
					className={`w-full flex gap-3 items-center justify-center px-6 py-2 mr-2 border-[1px] rounded-lg transition-all duration-300 
            ${
				selectedPaymentMethod === 'stripe'
					? 'bg-secondary-blue text-white border-secondary-blue'
					: 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white'
			} xl:text-[1vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw] mobile:text-[2.7vw]`}
				>
					<Image
						src="/klarna.png"
						alt="klarna"
						width={46}
						height={46}
						className="w-10 h-10 rounded-md"
					/>
					<Image
						src="/paypal.png"
						alt="paypal"
						width={46}
						height={46}
						className="w-10 h-10 rounded-md"
					/>
					Otros métodos de pago
				</button>
			</div>

			<div className="mt-8">
				{selectedPaymentMethod === 'sumup' && (
					<div className="flex justify-center">
						<SumupPayment
							purchaseIds={purchaseIds}
							fieldsValue={fieldsValue}
							numberPriceRounded={numberPriceRounded}
							items={items}
						/>
					</div>
				)}
				{selectedPaymentMethod === 'stripe' && (
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
				)}
			</div>
			{!isFormValid && selectedPaymentMethod === 'sumup' ? (
				<p className="text-center text-sm text-red-500">
					*Para realizar el pago con tarjeta, todos los campos deben
					estar completos.
				</p>
			) : null}
			{
				items.length === 0 ? (
					<p className="text-center text-sm text-red-500">
						*No hay productos en el carrito.
					</p>
				) : null
			}
		</div>
	)
}

export default PaymentSelection
