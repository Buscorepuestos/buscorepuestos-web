'use client'
import PaymentWidget from '../../../services/sumup/sumupWidget'
import { useEffect, useState } from 'react'
import { environment } from '../../../environment/environment'
import { FormsFields } from '../../../verificacion-pago/page'

export default function SumupPayment({
	purchaseIds,
	fieldsValue,
	numberPriceRounded,
	items,
}: {
	purchaseIds: string[]
	fieldsValue: FormsFields,
	numberPriceRounded: number
	items: any[]
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
		// eslint-disable-next-line
	}, [])

	return (
		<div>
			{checkoutId && items.length === 1 ? (
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
