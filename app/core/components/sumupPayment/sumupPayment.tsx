'use client'
import PaymentWidget from '../../../services/sumup/sumupWidget'
import { useEffect, useState } from 'react'
import { environment } from '../../../environment/environment'
import { FormsFields } from '../../../verificacion-pago/page'
import { CartItem } from '../../../redux/features/shoppingCartSlice'

export default function SumupPayment({
	purchaseIds,
	fieldsValue,
	numberPriceRounded,
	items,
}: {
	purchaseIds: string[]
	fieldsValue: FormsFields,
	numberPriceRounded: number
	items: CartItem[],
}) {
	const [checkoutId, setCheckoutId] = useState(null)
	
	//funcion para arrojar el titulo de los articulos y su _id y para poder pasarlos a la description de sumup
	const itemsTitle = items.map((item) => {
		return `${item.title} - ${item._id}`
	})

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
					description: `${
						itemsTitle.length > 1
							? itemsTitle.join(', ')
							: itemsTitle[0]
					}`,
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
