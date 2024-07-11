import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import { createBill } from '../../../services/billing/billing.service'
import StripeForm from '../checkout/StripeForm'

vi.mock('@stripe/react-stripe-js', () => ({
	PaymentElement: vi.fn(() => <div data-testid="payment-element" />),
	useElements: vi.fn(),
	useStripe: vi.fn(),
}))

vi.mock('../../../services/billing/billing.service', () => ({
	createBill: vi.fn(),
}))

const mockUseElements = useElements as vi.Mock
const mockUseStripe = useStripe as vi.Mock
const mockCreateBill = createBill as vi.Mock

describe('StripeForm', () => {
	beforeEach(() => {
		mockUseElements.mockReturnValue({})
		mockUseStripe.mockReturnValue({
			retrievePaymentIntent: vi.fn().mockResolvedValue({
				paymentIntent: { id: 'pi_123', status: 'succeeded' },
			}),
			confirmPayment: vi.fn().mockResolvedValue({}),
		})
		mockCreateBill.mockResolvedValue({})
	})
	afterEach(() => {
		vi.clearAllMocks();
		cleanup();
	});


	test('should handle form submission when stripe is undefined', async () => {
		// Mock useStripe to return null
		mockUseStripe.mockReturnValueOnce(null);

		render(<StripeForm clientSecret="test_secret" label={'Pay now'}/>);

		const submitButton = screen.getByText('Pay now');
		fireEvent.click(submitButton);

		// Ensure createBill is not called since stripe is null
		expect(mockCreateBill).not.toHaveBeenCalled();

		// Ensure no error messages or other side effects occur
		expect(screen.queryByText('Payment succeeded!')).not.toBeUndefined();
		expect(screen.queryByText('An unexpected error occurred.')).not.toBeUndefined();
	});

	test('should render payment form', () => {
		const { getByText, getByTestId, getAllByText } = render(<StripeForm clientSecret="test_secret" label={'Pagar ahora'} />)
		expect(getByTestId('payment-element')).toBeDefined()
		expect(getByText('Pagar ahora')).toBeDefined()
	})

	test('should handle form submission', async () => {
		mockUseStripe.mockReturnValue({
			retrievePaymentIntent: vi.fn().mockResolvedValue({
				paymentIntent: { id: 'pi_123', status: 'succeeded' },
			}),
			confirmPayment: vi.fn().mockResolvedValue({}),
		})

		const { getByText } = render(<StripeForm clientSecret="test_secret" label={'Pagar ahora'}/>)

		const submitButton = screen.getByText('Pagar ahora')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(mockCreateBill).toHaveBeenCalledWith(
				{
				'Id Pago Stripe': undefined,
				Compras: ['recV9AQVCb64NveMF'],
				Usuarios: ['recxNb1bKbkcrueq1'],
				transfer: false,
				address: 'Direccion de prueba',
				country: 'España',
				location: 'Las Palmas de Gran Canarias',
				addressNumber: '14',
				name: 'Carlos',
				cp: '3012',
				nif: '3456fg',
				phone: 66666666,
				province: 'Las Palmas',

				})
		})
		expect(getByText('Payment succeeded!')).toBeDefined()
	})

	test('should handle errors in form submission', async () => {
		mockUseStripe.mockReturnValueOnce({
			retrievePaymentIntent: vi.fn().mockResolvedValue({
				paymentIntent: { id: 'pi_123', status: 'requires_payment_method' },
			}),
			confirmPayment: vi.fn().mockResolvedValue({
				error: { type: 'card_error', message: 'Card error' },
			}),
		})

		render(<StripeForm clientSecret="test_secret" label={'Pagar'} />)

		const submitButton = screen.getByText('Pagar')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(screen.getByText('Card error')).toBeDefined();
		});
	})

	test('should handle processing payment status ', async () => {
		mockUseStripe.mockReturnValueOnce({
			retrievePaymentIntent: vi.fn().mockResolvedValue({
				paymentIntent: { id: 'pi_123', status: 'processing' },
			}),
			confirmPayment: vi.fn().mockResolvedValue({
			}),
		})

		render(<StripeForm clientSecret="test_secret" label={'Pagar'} />)

		const submitButton = screen.getByText('Pagar')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(screen.getByText('Your payment is processing.')).toBeDefined();
		});
	})

	test('should handle another payment status ', async () => {
		mockUseStripe.mockReturnValueOnce({
			retrievePaymentIntent: vi.fn().mockResolvedValue({
				paymentIntent: { id: 'pi_123', status: 'another status' },
			}),
			confirmPayment: vi.fn().mockResolvedValue({
			}),
		})

		render(<StripeForm clientSecret="test_secret" label={'Pagar'} />)

		const submitButton = screen.getByText('Pagar')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(screen.getByText('Something went wrong.')).toBeDefined();
		});
	})

	test('should handle unexpected error', async () => {
		mockUseStripe.mockReturnValueOnce({
			retrievePaymentIntent: vi.fn().mockResolvedValue({
				paymentIntent: { id: 'pi_123', status: 'another status' },
			}),
			confirmPayment: vi.fn().mockResolvedValue({
				error: { type: 'error-x', message: 'Unexpected Error' },
			}),
		})

		render(<StripeForm clientSecret="test_secret" label={'Pagar'} />)

		const submitButton = screen.getByText('Pagar')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(screen.getByText('An unexpected error occurred.')).toBeDefined();
		});
	})

	test('should not submit the form if elements is null', async () => {
		mockUseElements.mockReturnValueOnce(null);

		render(<StripeForm clientSecret="test_secret" label={'Pagar ahora'}/>);

		const submitButton = screen.getByText('Pagar ahora');
		fireEvent.click(submitButton);

		// Ensure createBill is not called since elements is null
		expect(mockCreateBill).not.toHaveBeenCalled();

		// Ensure no error messages or other side effects occur
		expect(screen.queryByText('Payment succeeded!')).not.toBeUndefined();
		expect(screen.queryByText('An unexpected error occurred.')).not.toBeUndefined();
	});

})
