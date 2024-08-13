import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { PaymentIntent, StripePaymentElementOptions } from '@stripe/stripe-js'
import { createBill } from '../../../services/billing/billing.service'
import { clearCart } from '../../../redux/features/shoppingCartSlice'
import { useDispatch } from 'react-redux'
import { updatePurchase } from '../../../services/purchase/purchase'
import { FormsFields } from '../../../verificacion-pago/page'


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
	const userId = localStorage.getItem('airtableUserId')

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

	const updatePurchases = async () => {
		props.purchaseIds.forEach(async (purchaseId) => {
			await updatePurchase(purchaseId)
		})
	}

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return
		}

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

		setIsLoading(true)
		await updatePurchases()
		dispatch(clearCart())              
		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: 'http://localhost:4000',
			},
		})

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
		if (error) {
			if (
				error.type === 'card_error' ||
				error.type === 'validation_error'
			) {
				setMessage(error.message as string)
			} else {
				setMessage('An unexpected error occurred.')
			}
		}

		setIsLoading(false)
	}

	const paymentElementOptions: StripePaymentElementOptions = {
		layout: {
			type: 'tabs',
		},
	};

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement
				id="payment-element"
				options={paymentElementOptions}
			/>
			<button 
				disabled={isLoading || !stripe || !elements} 
				id="submit" 
				type='submit'
			>
				<span id="button-text">
					{isLoading ? (
						<div data-testid="spinner" className="spinner" id="spinner"></div>
					) : (
						props.label
					)}
				</span>
			</button>
			{/* Show any error or success messages */}
			{<div id="payment-message">{message}</div>}
		</form>
	)
}

export default StripeForm