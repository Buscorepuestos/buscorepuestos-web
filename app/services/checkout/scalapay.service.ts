// app/services/checkout/scalapay.service.ts
import api from '../../api/api';
import { CreateOrderPayload, ScalapayCreateOrderResponse } from '../../types/scalapay'

export interface ScalapayCaptureResponse {
    status: 'APPROVED' | 'DECLINED';
    token: string;
    totalAmount: {
        amount: string;
        currency: string;
    };
    merchantReference: string;
    // ... otros campos que pueda devolver
}

/**
 * Llama al backend para capturar un pago previamente autorizado por Scalapay.
 * @param orderToken - El token del pedido obtenido en la redirección.
 * @returns La respuesta de la API de captura.
 */
export const captureScalapayOrder = async (orderToken: string): Promise<ScalapayCaptureResponse> => {
    try {
        const response = await api.post<ScalapayCaptureResponse>('/scalapay/capture-order', { orderToken });
        return response.data;
    } catch (error: any) {
        console.error('Error al capturar la orden de Scalapay:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'No se pudo finalizar el pago con Scalapay.');
    }
};


/**
 * Llama al backend para crear una orden en Scalapay.
 * @param payload - Los datos del pedido, incluyendo IDs de compra, consumidor y dirección de envío.
 * @returns La respuesta de la API de Scalapay, que incluye la `checkoutUrl`.
 */
export const createScalapayOrder = async (payload: CreateOrderPayload): Promise<ScalapayCreateOrderResponse> => {
    try {
        const response = await api.post<ScalapayCreateOrderResponse>('/scalapay/prepare-order', payload);
        return response.data;
    } catch (error: any) {
        console.error('Error al crear la orden de Scalapay:', error.response?.data || error.message);
        // Lanza un error con el mensaje del backend si está disponible
        throw new Error(error.response?.data?.message || 'No se pudo iniciar el pago con Scalapay.');
    }
};