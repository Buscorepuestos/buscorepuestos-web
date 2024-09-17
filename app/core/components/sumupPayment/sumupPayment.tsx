'use client'
import PaymentWidget from '../../../services/sumup/sumupWidget'
import { useEffect, useState } from 'react'
import { environment } from '../../../environment/environment'
import { FormsFields } from '../../../verificacion-pago/page'

export default function SumupPayment({
	purchaseIds,
	fieldsValue,
	numberPriceRounded,
}: {
	purchaseIds: string[]
	fieldsValue: FormsFields,
	numberPriceRounded: number
}) {
	const [checkoutId, setCheckoutId] = useState(null)

	useEffect(() => {
		const fetchCheckoutId = async () => {
			const response = await fetch(`${environment.api.url}/sumup/create-checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: numberPriceRounded,
					currency: 'EUR',
					description: 'Compra de producto',
				}),
			})
			const data = await response.json()
			setCheckoutId(data.checkoutId)
		}

		fetchCheckoutId()
	}, [numberPriceRounded])

	return (
		<div>
			{checkoutId ? (
				<PaymentWidget 
					checkoutId={checkoutId} 
					purchaseIds={purchaseIds}
					fieldsValue={fieldsValue}
				/>
			) : (
				<p>Cargando pago por sumup..</p>
			)}
		</div>
	)
}
