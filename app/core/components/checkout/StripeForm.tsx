import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { PaymentIntent, StripePaymentElementOptions } from '@stripe/stripe-js'
import { createBill } from '../../../services/billing/billing.service'
import { useDispatch } from 'react-redux'
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

	const createbilling = async () => {
		const billingData = {
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
		}

		const extraData = {
			email: props.fieldsValues.email,
			billingAddress: props.fieldsValues.billingAddress,
			billingAddressExtra: props.fieldsValues.billingAddressExtra,
			billingProvince: props.fieldsValues.billingProvince,
			billingZip: props.fieldsValues.billingZip,

		}

		const userAddressData = {
				user: [userId!],
				name: props.fieldsValues.name,
				nif: props.fieldsValues.nif,
				address: props.fieldsValues.shippingAddress,
				country: props.fieldsValues.country,
				location: props.fieldsValues.city,
				addressNumber: props.fieldsValues.addressExtra,
				phone: Number(props.fieldsValues.phoneNumber),
				province: props.fieldsValues.province,
				cp: props.fieldsValues.zip,
				["Correo electrónico"]: props.fieldsValues.email
			}
	
		try {
			const storedBillingData = localStorage.getItem('billingData')
			const storedEmailData = localStorage.getItem('extraData')
			const cart = localStorage.getItem('cart')
			const executedBill = localStorage.getItem('billingExecuted')
			const userAddress = localStorage.getItem('userAddress')
			if (cart) {
				const copyCartExist = localStorage.getItem('copyCart')
				if (copyCartExist) {
					localStorage.removeItem('copyCart')
				}
				const copyCart = JSON.parse(cart)
				localStorage.setItem('copyCart', JSON.stringify(copyCart))
			}
			if (executedBill) {
				localStorage.removeItem('billingExecuted')
			}
			if (storedBillingData) {
				localStorage.removeItem('billingData')
			}
			if (storedEmailData) {
				localStorage.removeItem('extraData')
			}
			if (userAddress) {
				localStorage.removeItem('userAddress')
			}
			localStorage.setItem('userAddress', JSON.stringify(userAddressData))
			localStorage.setItem('billingData', JSON.stringify(billingData))
			localStorage.setItem('extraData', JSON.stringify(extraData))
		} catch (error) {
			console.error('Error saving billing data to localStorage:', error)
		}
	}

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()

		await createbilling()

		if (!stripe || !elements) {
			return
		}

		setIsLoading(true)             
		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${environment.base_url}/pago-exitoso`,
			},
		})
		

		if (error) {
			if (error.type === 'card_error' || error.type === 'validation_error') {
				setMessage(error.message as string)
			} else {
				setMessage('An unexpected error occurred.')
			}
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

			{!isFormValid && missingFieldMessage && (
				<p style={{ color: 'red', marginTop: '10px' }}>
					{missingFieldMessage}
				</p>
			)}
		</form>
	)
}

export default StripeForm
