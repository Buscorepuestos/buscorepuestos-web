import {  PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { PaymentIntent } from '@stripe/stripe-js'
import { createBill } from '../../../services/billing/billing.service'


const StripeForm = (props: {
	clientSecret: string,
	label: 'Pagar ahora'
}) => {
	const stripe = useStripe()
	const elements = useElements()

	const [message, setMessage] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [payment, setPayment] = useState<PaymentIntent | undefined>(undefined);

	useEffect(() => {
		if (!stripe) {
			return
		}

		stripe.retrievePaymentIntent(props.clientSecret).then(({ paymentIntent }) => {
			setPayment(paymentIntent);
			switch (paymentIntent.status) {
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
	}, [stripe])


	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return
		}

		await createBill({
			'Id Pago Stripe': payment?.id as string,
			Compras: ['recV9AQVCb64NveMF'],
			Usuarios:['recxNb1bKbkcrueq1'],
			transfer: false,
			address:'Direccion de prueba',
			country:'España',
			location:'Las Palmas de Gran Canarias',
			addressNumber:'14',
			name:'Carlos',
			cp:'3012',
			nif:'3456fg',
			phone: 66666666,
			province:'Las Palmas'
		});

		setIsLoading(true)

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
			if (error.type === 'card_error' || error.type === 'validation_error') {
				setMessage(error.message as string)
			} else {
				setMessage('An unexpected error occurred.')
			}
		}

		setIsLoading(false)
	}

	const paymentElementOptions = {
		layout: 'tabs',
	}

	return (

		<form id="payment-form" onSubmit={handleSubmit}>

			<PaymentElement id="payment-element" options={paymentElementOptions} />
			<button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : props.label}
        </span>
			</button>
			{/* Show any error or success messages */}
			{<div id="payment-message">{message}</div>}
		</form>
	)

}

export default StripeForm