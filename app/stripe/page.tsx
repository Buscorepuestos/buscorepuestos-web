'use client'
import { useEffect, useState } from 'react'
import { createPaymentIntent } from '../services/checkout/stripe.service'
import PaymentForm from '../core/components/checkout/PaymentForm'
export default function App() {

	const [clientSecret, setClientSecret] = useState<string>('')
	const [error, setError] = useState<string>('')

	useEffect(() => {
		const createIntent = async () => {
			try {
				// Mock data
				const res = await createPaymentIntent({
					amount: 200,
					currency: 'eur',
					cartIDs: ['recV9AQVCb64NveMF'],
					automatic_payment_methods: { enabled: true },
				});
				setClientSecret(res.data.client_secret);
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError('An unexpected error occurred');
				}
			}
		}

		createIntent();
	}, [])


	return (
		<div>
			{clientSecret && <PaymentForm clientSecret={clientSecret} />}
			{error && <p>Error: {error}</p>}
		</div>
	)
};

