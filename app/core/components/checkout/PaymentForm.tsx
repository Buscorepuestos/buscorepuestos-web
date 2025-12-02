'use client'

import { loadStripe } from '@stripe/stripe-js'
import StripeForm from './StripeForm'
import { Elements } from '@stripe/react-stripe-js'
import { FormsFields } from '../checkoutPage/CheckoutPage'
import { environment } from '../../../environment/environment'

const stripePromise = loadStripe(environment.stripe_publishable_key, {
	locale: 'es',
})

export default function PaymentForm(props: {
	clientSecret: string
	purchaseIds: string[]
	fieldsValues: FormsFields
	items: any[]
}) {
	const appearance = {
		theme: 'stripe' as 'stripe',
	}
	const options = {
		clientSecret: props.clientSecret,
		appearance,
	}
	console.log('Rendering PaymentForm with clientSecret:', props.clientSecret)

	return (
		<div>
			{props.items.length > 0 ? (
				<Elements stripe={stripePromise} options={options}>
					<StripeForm
						clientSecret={props.clientSecret}
						label={'Pagar ahora'}
						purchaseIds={props.purchaseIds}
						fieldsValues={props.fieldsValues}
					/>
				</Elements>
			) : (
				<p>Cargando pago por stripe..</p>
			)}
		</div>
	)
}
