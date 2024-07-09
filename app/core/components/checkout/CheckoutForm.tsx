
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
import { loadStripe } from '@stripe/stripe-js'
import StripeForm from './StripeForm'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_test_51P4jfZ01jERzk1YWCaZjfadeUUdmvdOxkfR9wmyqiEHpK7u7rhhdHoGT9HnUKSnhUeq15oXjHVQcwKdJC4SymqwL00SZF1AZdq')

export default function CheckoutForm(props: {
	clientSecret: string
}) {

	const appearance = {
		theme: 'stripe',
	}
	const options = {
		clientSecret: props.clientSecret,
		appearance,
	}

	return (
		<Elements stripe={stripePromise} options={options}>
			<StripeForm clientSecret={props.clientSecret} />
		</Elements>
	);

}
