import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeFormComponent from './StripeFormComponent'; // Renombramos el formulario real
import { FormsFields } from '../checkoutPage/CheckoutPage';
import { environment } from '../../../environment/environment';

// Carga la instancia de Stripe una sola vez
const stripePromise = loadStripe(environment.stripe_publishable_key, {
	locale: 'es',
});

export default function PaymentFormWrapper(props: {
	clientSecret: string;
	purchaseIds: string[];
	fieldsValues: FormsFields;
	items: any[];
}) {
	if (!props.clientSecret || props.items.length === 0) {
        // Muestra un loader o mensaje si aún no está listo
		return (
            <div className="flex justify-center my-4 items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                <p className="ml-3">Cargando pasarela de pago...</p>
            </div>
        );
	}

    // Configuración para el componente Elements
	const appearance = { theme: 'stripe' as const };
	const options = {
		clientSecret: props.clientSecret,
		appearance,
		locale: 'es' as const,
	};

	return (
        <Elements stripe={stripePromise} options={options}>
            <StripeFormComponent
                label={'Pagar ahora'}
                purchaseIds={props.purchaseIds}
                fieldsValues={props.fieldsValues}
            />
        </Elements>
	);
}
