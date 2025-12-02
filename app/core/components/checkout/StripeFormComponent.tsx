'use client';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { FormsFields } from '../checkoutPage/CheckoutPage';
import { environment } from '../../../environment/environment';
import { updateUser } from '../../../services/mailchimp/mailchimp';

// Este componente AHORA se llama StripeFormComponent
const StripeFormComponent = (props: { 
	label: 'Pagar ahora'; 
	purchaseIds: string[];
	fieldsValues: FormsFields;
}) => {
	const stripe = useStripe();
	const elements = useElements();

	const [message, setMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

    // La lógica para validar el formulario se puede mantener aquí
    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        const fields = props.fieldsValues;
        const isComplete = fields.name && fields.email && fields.nif && fields.phoneNumber && fields.shippingAddress && fields.addressExtra && fields.zip && fields.city && fields.province && fields.country;
        setIsFormValid(!!isComplete);
    }, [props.fieldsValues]);


	const prepareLocalStorageForRedirect = () => {
        const userId = localStorage.getItem('airtableUserId');
        const pendingOrder = {
            paymentMethod: 'stripe',
            billingData: {
				Compras: props.purchaseIds,
				Usuarios: [userId!],
				transfer: false,
				address: props.fieldsValues.shippingAddress,
				country: props.fieldsValues.country,
				location: props.fieldsValues.city,
				addressNumber: props.fieldsValues.addressExtra,
				name: props.fieldsValues.name,
				cp: props.fieldsValues.zip,
				nif: props.fieldsValues.nif,
				phone: Number(props.fieldsValues.phoneNumber),
				province: props.fieldsValues.province,
			},
            extraData: { 
				email: props.fieldsValues.email,
				billingAddress: props.fieldsValues.billingAddress,
				billingAddressExtra: props.fieldsValues.billingAddressExtra,
				billingProvince: props.fieldsValues.billingProvince,
				billingZip: props.fieldsValues.billingZip,
			},
            cart: JSON.parse(localStorage.getItem('cart') || '[]'),
        };
        localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js no ha cargado todavía.
			return;
		}

		setIsLoading(true);
        prepareLocalStorageForRedirect(); // Guardar los datos antes de la redirección

		// Actualizar Mailchimp en segundo plano
        updateUser({ firstName: props.fieldsValues.name, email: props.fieldsValues.email })
            .catch(err => console.error("Error no crítico actualizando Mailchimp:", err));

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/pago-exitoso`,
			},
		});

		// Este punto solo se alcanza si hay un error inmediato (ej. datos de tarjeta inválidos).
		if (error.type === "card_error" || error.type === "validation_error") {
			setMessage(error.message || 'Ocurrió un error con los datos de pago.');
		} else {
			setMessage("Ocurrió un error inesperado.");
		}
		
		setIsLoading(false);
	};

	const paymentElementOptions: StripePaymentElementOptions = {
		layout: 'tabs',
	};

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement id="payment-element" options={paymentElementOptions} />
			<button disabled={isLoading || !stripe || !elements || !isFormValid} id="submit" className='button-pay'>
				<span id="button-text">
					{isLoading ? <div className="spinner" id="spinner"></div> : props.label}
				</span>
			</button>
			{message && <div id="payment-message" style={{color: 'red'}}>{message}</div>}
            {!isFormValid && <p style={{ color: 'red', marginTop: '10px', fontSize: '12px' }}>Completa todos los campos de envío para activar el pago.</p>}
		</form>
	);
};

export default StripeFormComponent;