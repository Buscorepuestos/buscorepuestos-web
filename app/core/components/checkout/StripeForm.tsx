// import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
// import { useEffect, useState } from 'react'
// import { PaymentIntent, StripePaymentElementOptions } from '@stripe/stripe-js'
// import { createBill } from '../../../services/billing/billing.service'
// import { clearCart } from '../../../redux/features/shoppingCartSlice'
// import { useDispatch } from 'react-redux'
// import { updatePurchase } from '../../../services/purchase/purchase'
// import { FormsFields } from '../../../verificacion-pago/page'
// import { environment } from '../../../environment/environment'

// const StripeForm = (props: { 
// 	clientSecret: string; 
// 	label: 'Pagar ahora'; 
// 	purchaseIds: string[];
// 	fieldsValues: FormsFields;
// }) => {
// 	const dispatch = useDispatch()
// 	const stripe = useStripe()
// 	const elements = useElements()

// 	const [message, setMessage] = useState('')
// 	const [isLoading, setIsLoading] = useState(false)
// 	const [payment, setPayment] = useState<PaymentIntent | undefined>(undefined)
// 	const [isFormValid, setIsFormValid] = useState(false)
// 	const [isPaymentElementComplete, setIsPaymentElementComplete] = useState(false)
// 	let userId: string | null = null
// 	if (typeof window !== 'undefined') {
// 		userId = localStorage.getItem('airtableUserId')
// 	}

// 	useEffect(() => {
// 		if (!stripe) {
// 			return
// 		}

// 		stripe
// 			.retrievePaymentIntent(props.clientSecret)
// 			.then(({ paymentIntent }) => {
// 				setPayment(paymentIntent)
// 				switch (paymentIntent?.status) {
// 					case 'succeeded':
// 						setMessage('Payment succeeded!')
// 						break
// 					case 'processing':
// 						setMessage('Your payment is processing.')
// 						break
// 					case 'requires_payment_method':
// 						setMessage('')
// 						break
// 					default:
// 						setMessage('Something went wrong.')
// 						break
// 				}
// 			})
// 	}, [stripe, props.clientSecret])

// 	// Function to check if all required fields are filled
// 	useEffect(() => {
// 		const fields = props.fieldsValues
// 		const isFieldsComplete =
// 			fields.shippingAddress &&
// 			fields.country &&
// 			fields.city &&
// 			fields.addressExtra &&
// 			fields.name &&
// 			fields.zip &&
// 			fields.nif &&
// 			fields.phoneNumber &&
// 			fields.province

// 		setIsFormValid((isFieldsComplete && isPaymentElementComplete) || false)
// 	}, [props.fieldsValues, isPaymentElementComplete])

// 	const updatePurchases = async () => {
// 		props.purchaseIds.forEach(async (purchaseId) => {
// 			await updatePurchase(purchaseId)
// 		})
// 	}

// 	const handleSubmit = async (e: { preventDefault: () => void }) => {
// 		e.preventDefault()

// 		if (!stripe || !elements) {
// 			return
// 		}

// 		setIsLoading(true)             
// 		const { error } = await stripe.confirmPayment({
// 			elements,
// 			confirmParams: {
// 				return_url: environment.base_url,
// 			},
// 		})

// 		if (error) {
// 			if (error.type === 'card_error' || error.type === 'validation_error') {
// 				setMessage(error.message as string)
// 			} else {
// 				setMessage('An unexpected error occurred.')
// 			}
// 		} else {
// 			await createBill({
// 				'Id Pago Stripe': payment?.id as string,
// 				Compras: props.purchaseIds,
// 				Usuarios: [userId!],
// 				transfer: false,
// 				address: props.fieldsValues.shippingAddress,
// 				country: props.fieldsValues.country,
// 				location: props.fieldsValues.city,
// 				addressNumber: props.fieldsValues.addressExtra,
// 				name: props.fieldsValues.name,
// 				cp: props.fieldsValues.zip,
// 				nif: props.fieldsValues.nif,
// 				phone: Number(props.fieldsValues.phoneNumber),
// 				province: props.fieldsValues.province,
// 			})
// 			await updatePurchases()
// 			dispatch(clearCart()) 
// 		}

// 		setIsLoading(false)
// 	}

// 	const handleChange = (event: any) => {
// 		setIsPaymentElementComplete(event.complete)
// 	}

// 	const paymentElementOptions: StripePaymentElementOptions = {
// 		layout: {
// 			type: 'tabs',
// 		},
// 	}

// 	return (
// 		<form id="payment-form" onSubmit={handleSubmit}>
// 			<PaymentElement
// 				id="payment-element"
// 				options={paymentElementOptions}
// 				onChange={handleChange}
// 			/>
// 			<button 
// 				disabled={isLoading || !stripe || !elements || !isFormValid} 
// 				id="submit" 
// 				type='submit'
// 				className='button-pay'
// 			>
// 				<span id="button-text">
// 					{isLoading ? (
// 						<div data-testid="spinner" className="spinner" id="spinner"></div>
// 					) : (
// 						props.label
// 					)}
// 				</span>
// 			</button>
// 			{<div id="payment-message">{message}</div>}
// 		</form>
// 	)
// }

// export default StripeForm

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { PaymentIntent, StripePaymentElementOptions } from '@stripe/stripe-js'
import { createBill } from '../../../services/billing/billing.service'
import { clearCart } from '../../../redux/features/shoppingCartSlice'
import { useDispatch } from 'react-redux'
import { updatePurchase } from '../../../services/purchase/purchase'
import { FormsFields } from '../../../verificacion-pago/page'
import { environment } from '../../../environment/environment'

const StripeForm = (props: { 
	clientSecret: string; 
	label: 'Pagar ahora'; 
	purchaseIds: string[];
	fieldsValues: FormsFields;
}) => {
	const dispatch = useDispatch()
	const stripe = useStripe()
	const elements = useElements()

	const [message, setMessage] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [payment, setPayment] = useState<PaymentIntent | undefined>(undefined)
	const [isFormValid, setIsFormValid] = useState(false)
	const [isPaymentElementComplete, setIsPaymentElementComplete] = useState(false)
	const [missingFieldMessage, setMissingFieldMessage] = useState('')

	let userId: string | null = null
	if (typeof window !== 'undefined') {
		userId = localStorage.getItem('airtableUserId')
	}

	useEffect(() => {
		if (!stripe) {
			return
		}

		stripe
			.retrievePaymentIntent(props.clientSecret)
			.then(({ paymentIntent }) => {
				setPayment(paymentIntent)
				switch (paymentIntent?.status) {
					case 'succeeded':
						setMessage('Payment succeeded!')
						break
					case 'processing':
						setMessage('Your payment is processing.')
						break
					case 'requires_payment_method':
						setMessage('')
						break
					default:
						setMessage('Something went wrong.')
						break
				}
			})
	}, [stripe, props.clientSecret])

	// Function to check if all required fields are filled
	useEffect(() => {
		const fields = props.fieldsValues
		let missingField = ''
		if (!fields.name) missingField = 'Por favor, ingresa tu nombre completo.'
		else if (!fields.email) missingField = 'Por favor, ingresa tu correo electrónico.'
		else if (!fields.nif) missingField = 'Por favor, ingresa tu NIF o identificación fiscal.'
		else if (!fields.phoneNumber) missingField = 'Por favor, ingresa tu número de teléfono.'
		else if (!fields.shippingAddress) missingField = 'Por favor, ingresa tu dirección.'
		else if (!fields.addressExtra) missingField = 'Por favor, ingresa el número de tu dirección.'
		else if (!fields.zip) missingField = 'Por favor, ingresa tu código postal.'
		else if (!fields.city) missingField = 'Por favor, ingresa tu ciudad.'
		else if (!fields.province) missingField = 'Por favor, ingresa tu provincia.'
		else if (!fields.country) missingField = 'Por favor, ingresa tu país.'
		
		setMissingFieldMessage(missingField)
		setIsFormValid((!missingField && isPaymentElementComplete) || false)
	}, [props.fieldsValues, isPaymentElementComplete])

	const updatePurchases = async () => {
		props.purchaseIds.forEach(async (purchaseId) => {
			await updatePurchase(purchaseId)
		})
	}

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()

		if (!stripe || !elements) {
			return
		}

		setIsLoading(true)             
		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: environment.base_url,
			},
		})

		if (error) {
			if (error.type === 'card_error' || error.type === 'validation_error') {
				setMessage(error.message as string)
			} else {
				setMessage('An unexpected error occurred.')
			}
		} else {
			await createBill({
				'Id Pago Stripe': payment?.id as string,
				Compras: props.purchaseIds,
				Usuarios: [userId!],
				transfer: false,
				address: props.fieldsValues.shippingAddress,
				country: props.fieldsValues.country,
				location: props.fieldsValues.city,
				addressNumber: props.fieldsValues.addressExtra,
				name: props.fieldsValues.name,
				cp: props.fieldsValues.zip,
				nif: props.fieldsValues.nif,
				phone: Number(props.fieldsValues.phoneNumber),
				province: props.fieldsValues.province,
			})
			await updatePurchases()
			dispatch(clearCart()) 
		}

		setIsLoading(false)
	}

	const handleChange = (event: any) => {
		setIsPaymentElementComplete(event.complete)
	}

	const paymentElementOptions: StripePaymentElementOptions = {
		layout: {
			type: 'tabs',
		},
	}

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement
				id="payment-element"
				options={paymentElementOptions}
				onChange={handleChange}
			/>
			<button 
				disabled={isLoading || !stripe || !elements || !isFormValid} 
				id="submit" 
				type='submit'
				className='button-pay'
			>
				<span id="button-text">
					{isLoading ? (
						<div data-testid="spinner" className="spinner" id="spinner"></div>
					) : (
						props.label
					)}
				</span>
			</button>

			{message && <div id="payment-message">{message}</div>}

			{/* Display missing field message */}
			{!isFormValid && missingFieldMessage && (
				<p style={{ color: 'red', marginTop: '10px' }}>
					{missingFieldMessage}
				</p>
			)}
		</form>
	)
}

export default StripeForm
