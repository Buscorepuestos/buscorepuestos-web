import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51P4jfZ01jERzk1YWCaZjfadeUUdmvdOxkfR9wmyqiEHpK7u7rhhdHoGT9HnUKSnhUeq15oXjHVQcwKdJC4SymqwL00SZF1AZdq');

const StripeForm = () => {
	const options = {
		// passing the client secret obtained from the server
		clientSecret: 'pi_3PYvXt01jERzk1YW1WDci3yV_secret_SfrH9IfBIBauJTZcMvuNQVNvO',
	};
	return (
		<Elements stripe={stripePromise} options={options}>

		<form>
			<PaymentElement />
			<button>Submit</button>
		</form>
		</Elements>
	);
};

export default StripeForm;
