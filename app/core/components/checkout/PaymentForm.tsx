import { loadStripe } from '@stripe/stripe-js'
import StripeForm from './StripeForm'
import { Elements } from '@stripe/react-stripe-js'
import { FormsFields } from '@/app/verificacion-pago/page'
import { environment } from '../../../environment/environment'

const stripePromise = loadStripe(environment.stripe_publishable_key)

export default function PaymentForm(props: {
	clientSecret: string,
	purchaseIds: string[],
	fieldsValues: FormsFields,
}) {

	const appearance = {
		theme: 'stripe' as 'stripe', 
	}
	const options = {
		clientSecret: props.clientSecret,
		appearance,
	}

	return (
		<Elements stripe={stripePromise} options={options}>
			<StripeForm 
				clientSecret={props.clientSecret} 
				label={'Pagar ahora'} 
				purchaseIds={props.purchaseIds}
				fieldsValues={props.fieldsValues}
			/>
		</Elements>
	);
}

