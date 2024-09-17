'use client'
import PaymentWidget from '../services/sumup/sumupWidget'
import { useEffect, useState } from 'react'
import { environment } from '../environment/environment'

export default function CheckoutPage() {
	const [checkoutId, setCheckoutId] = useState(null)

	useEffect(() => {
		const fetchCheckoutId = async () => {
			const response = await fetch(`${environment.api.url}/sumup/create-checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: 1000, // Monto en centavos
					currency: 'EUR',
					description: 'Compra de producto',
				}),
			})
			const data = await response.json()
			setCheckoutId(data.checkoutId)
		}

		fetchCheckoutId()
	}, [])

	return (
		<div className='mt-64'>
			{checkoutId ? (
				<PaymentWidget checkoutId={checkoutId} />
			) : (
				<p>Cargando pago por sumup..</p>
			)}
		</div>
	)
}
