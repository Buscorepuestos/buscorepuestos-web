import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, test } from 'vitest';
import PaymentForm from '../../checkout/PaymentForm'

vi.mock('@stripe/react-stripe-js', () => ({
	Elements: ({ children }) => <div>{children}</div>,
	loadStripe: () => ({})
}));

vi.mock('../../checkout/StripeForm', () => ({
	__esModule: true,
	default: ({ clientSecret }) => <div data-testid="stripe-form">{clientSecret}</div>,
}));

describe('PaymentForm', () => {
	test('renders StripeForm with the correct clientSecret', () => {
		const clientSecret = 'test_client_secret';
		render(<PaymentForm clientSecret={clientSecret} />);

		// Check if the StripeForm component is rendered with the correct clientSecret
		const stripeForm = screen.getByTestId('stripe-form');
		expect(stripeForm).toBeDefined();
		expect(stripeForm.textContent).toBe(clientSecret);
	});
});
