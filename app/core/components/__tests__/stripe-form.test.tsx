import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { createBill } from '../../../services/billing/billing.service';
import StripeForm from '../checkout/StripeForm';
import { configureStore } from '@reduxjs/toolkit';
import shoppingCartReducer from '../../../redux/features/shoppingCartSlice';
import { Provider } from 'react-redux';

const fieldValues = {
  name: 'Carlos',
	email: 'carlos@gmail.com',
	nif: '3456fg',
	phoneNumber: '66666666',
	shippingAddress: 'Direccion de prueba',
	addressExtra: '14',
	zip: '3012',
	city: 'Las Palmas de Gran Canarias',
	province: 'Las Palmas',
	country: 'España',
	billingAddress: 'Direccion de prueba',
	billingAddressExtra: '14',
	billingZip: '3012',
	billingProvince: 'Las Palmas',
}

const purchaseId = 'recV9AQVCb64NveMF'

vi.mock('@stripe/react-stripe-js', () => ({
  PaymentElement: vi.fn(() => <div data-testid="payment-element" />),
  useElements: vi.fn(),
  useStripe: vi.fn(),
}));

vi.mock('../../../services/billing/billing.service', () => ({
  createBill: vi.fn(),
}));

const mockUseElements = useElements as vi.Mock;
const mockUseStripe = useStripe as vi.Mock;
const mockCreateBill = createBill as vi.Mock;

// Crear un store mock
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      shoppingCart: shoppingCartReducer,
    },
    preloadedState: initialState,
  });
};

// Modificar la función render para envolver en Provider
const renderWithProvider = (ui: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('StripeForm', () => {
  beforeEach(() => {
    mockUseElements.mockReturnValue({});
    mockUseStripe.mockReturnValue({
      retrievePaymentIntent: vi.fn().mockResolvedValue({
        paymentIntent: { id: 'pi_123', status: 'succeeded' },
      }),
      confirmPayment: vi.fn().mockResolvedValue({}),
    });
    mockCreateBill.mockResolvedValue({});
  });
  
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('should handle form submission when stripe is undefined', async () => {
    // Mock useStripe to return null
    mockUseStripe.mockReturnValueOnce(null);

    renderWithProvider(<StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'}/>);

    const submitButton = screen.getByText('Pagar ahora');
    fireEvent.click(submitButton);

    // Ensure createBill is not called since stripe is null
    expect(mockCreateBill).not.toHaveBeenCalled();

    // Ensure no error messages or other side effects occur
    expect(screen.queryByText('Payment succeeded!')).toBeNull();
    expect(screen.queryByText('An unexpected error occurred.')).toBeNull();
  });

  test('should render payment form', () => {
    const { getByText, getByTestId } = renderWithProvider(<StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'} />);
    expect(getByTestId('payment-element')).not.toBeNull();
    expect(getByText('Pagar ahora')).not.toBeNull();
  });

	test('should handle form submission', async () => {
		mockUseStripe.mockReturnValue({
			retrievePaymentIntent: vi.fn().mockResolvedValue({
				paymentIntent: { id: 'pi_123', status: 'succeeded' },
			}),
			confirmPayment: vi.fn().mockResolvedValue({}),
		})

		const { getByText } = renderWithProvider(<StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'}/>)

		const submitButton = screen.getByText('Pagar ahora')
		fireEvent.click(submitButton)

		setTimeout(() => {
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
        expect(getByText('Payment succeeded!')).toBeDefined()
		} ,500)
	})

  test('should handle errors in form submission', async () => {
    mockUseStripe.mockReturnValueOnce({
      retrievePaymentIntent: vi.fn().mockResolvedValue({
        paymentIntent: { id: 'pi_123', status: 'requires_payment_method' },
      }),
      confirmPayment: vi.fn().mockResolvedValue({
        error: { type: 'card_error', message: 'Card error' },
      }),
    });

    renderWithProvider(<StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'} />);

    const submitButton = screen.getByText('Pagar ahora');
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(screen.queryByText('Card error')).not.toBeNull();
    }, 500);
  });

  test('should handle processing payment status', async () => {
    mockUseStripe.mockReturnValueOnce({
      retrievePaymentIntent: vi.fn().mockResolvedValue({
        paymentIntent: { id: 'pi_123', status: 'processing' },
      }),
      confirmPayment: vi.fn().mockResolvedValue({}),
    });

    renderWithProvider(<StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'} />);

    const submitButton = screen.getByText('Pagar ahora');
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(screen.queryByText('Your payment is processing.')).not.toBeNull();
    },500);
  });

  test('should handle another payment status', async () => {
    mockUseStripe.mockReturnValueOnce({
      retrievePaymentIntent: vi.fn().mockResolvedValue({
        paymentIntent: { id: 'pi_123', status: 'another status' },
      }),
      confirmPayment: vi.fn().mockResolvedValue({}),
    });

    renderWithProvider(<StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'} />);

    const submitButton = screen.getByText('Pagar ahora');
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(screen.queryByText('Something went wrong.')).not.toBeNull();
    },500);
  });

  test('should handle unexpected error', async () => {
    mockUseStripe.mockReturnValueOnce({
      retrievePaymentIntent: vi.fn().mockResolvedValue({
        paymentIntent: { id: 'pi_123', status: 'another status' },
      }),
      confirmPayment: vi.fn().mockResolvedValue({
        error: { type: 'error-x', message: 'Unexpected Error' },
      }),
    });

    renderWithProvider(<StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'} />);

    const submitButton = screen.getByText('Pagar ahora');
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(screen.queryByText('An unexpected error occurred.')).not.toBeNull();
    },500);
  });

  test('should not submit the form if elements is null', async () => {
    mockUseElements.mockReturnValueOnce(null);

    renderWithProvider(<StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'}/>);

    const submitButton = screen.getByText('Pagar ahora');
    fireEvent.click(submitButton);

    // Ensure createBill is not called since elements is null
    expect(mockCreateBill).not.toHaveBeenCalled();

    // Ensure no error messages or other side effects occur
    expect(screen.queryByText('Payment succeeded!')).toBeNull();
    expect(screen.queryByText('An unexpected error occurred.')).toBeNull();
  });

  test('should show spinner when loading', async () => {
	mockUseStripe.mockReturnValue({
	  retrievePaymentIntent: vi.fn().mockResolvedValue({
		paymentIntent: { id: 'pi_123', status: 'succeeded' },
	  }),
	  confirmPayment: vi.fn().mockImplementation(() => {
		return new Promise((resolve) => {
		  setTimeout(() => {
			resolve({});
		  }, 100); // Simulate a delay
		});
	  }),
	});
  
	const { getByText, queryByTestId } = renderWithProvider(
	  <StripeForm purchaseIds={[purchaseId]} fieldsValues={fieldValues} clientSecret="test_secret" label={'Pagar ahora'} />
	);
  
	const submitButton = getByText('Pagar ahora');
	fireEvent.click(submitButton);
  
	// Verify the spinner is displayed while loading
	setTimeout(() => {
	  const spinner = queryByTestId('spinner');
	  expect(spinner).not.toBeNull();
	},500);
  
	// Optionally, you can also test that the spinner disappears after loading
	setTimeout(() => {
	  expect(queryByTestId('spinner')).toBeNull();
	},500);
  });
  

});
