'use client'
import { useEffect, useState } from 'react'
import { createPaymentIntent } from '../services/checkout/stripe.service'
import PaymentForm from '../core/components/checkout/PaymentForm'
import './stripe.css'

export default function App() {

	const [clientSecret, setClientSecret] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		const createIntent = () => {
			try {
				// Mock data
				createPaymentIntent({
					amount: 200,
					currency: 'eur',
					cartIDs: ['recV9AQVCb64NveMF'],
					automatic_payment_methods: { enabled: true },
				}).then((res) =>
					setClientSecret(res.data.client_secret),
				)
			} catch (error) {
				setError(error)
			}
		}

		createIntent()
	}, [])


	return (
		<div>
			{clientSecret && <PaymentForm clientSecret={clientSecret} />}
		</div>
	)
};
