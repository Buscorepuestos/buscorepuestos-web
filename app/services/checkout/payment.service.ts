import api from '../../api/api';
import { BillingModel } from '../../types/billing';

export const finalizePayment = async (billingData: BillingModel) => {
    try {
        const response = await api.post('/payments/finalize', { billingData });
        return response.data;
    } catch (error: any) {
        console.error('Error al finalizar el pago:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'No se pudo completar el pedido.');
    }
};
