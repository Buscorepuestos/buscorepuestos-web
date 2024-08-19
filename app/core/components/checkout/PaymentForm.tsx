import { loadStripe } from '@stripe/stripe-js'
import StripeForm from './StripeForm'
import { Elements } from '@stripe/react-stripe-js'
import { FormsFields } from '@/app/verificacion-pago/page'

const stripePromise = loadStripe('pk_test_51P4jfZ01jERzk1YWCaZjfadeUUdmvdOxkfR9wmyqiEHpK7u7rhhdHoGT9HnUKSnhUeq15oXjHVQcwKdJC4SymqwL00SZF1AZdq')

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

