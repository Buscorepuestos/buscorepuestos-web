import api from '../../api/api';
import { ProductMongoInterface } from '@/app/redux/interfaces/product.interface';

export const savePurchase = async (product: ProductMongoInterface, userId: string): Promise<{ purchaseId: string }> => {

    const purchase = {
        "Artículos": [product._id],
        "Datos de facturación": "",
        "Dirección de envío": "",
        "Estado": "Cesta de Compra",
        "Información adicional": "",
        "Nombre": "",
        "Pago del Cliente": "Pago sin confirmar",
        "Población": "",
        "Provincia": "",
        "código postal": "",
        "dirección de envío misma a dirección de facturación": false,
        "Quantity": "1",
        "Usuarios": [userId] 
    };

    try {
        const response = await api.post('/purchases', {
            data: purchase,
        });
        const purchaseId = response.data.data.fields.id;
        return { purchaseId };
    } catch (error) {
        console.error('Error saving purchase:', error);
        throw error;
    }
};

export const deletePurchase = async (purchaseId: string): Promise<void> => {
    try {
        await api.delete(`/purchases/${purchaseId}`);
    } catch (error) {
        console.error('Error deleting purchase:', error);
        throw error;
    }
};

export const updatePurchase = async (purchaseId: string, metodo?: string): Promise<void> => {

    const purchase = {
        id: purchaseId,
        "Pago del Cliente": "Pago Confirmado",
        "Estado": "Pendiente de Compra a Distribuidor",
        "Metodo": metodo || "tarjeta"
    };

    try {
        await api.patch(`/purchases/${purchaseId}`, {
            data: purchase,
        });
    } catch (error) {
        console.error('Error updating purchase:', error);
        throw error;
    }
};

export const updateTransferPurchase = async (purchaseId: string, imgTransfer: string): Promise<void> => {
    
    console.log(imgTransfer);

    const purchase = {
        id: purchaseId,
        "Estado": "Verificación de Pago",
        "Metodo": "transferencia",
        "Transferencia": [{ url: imgTransfer }]

    };

    try {
        await api.patch(`/purchases/${purchaseId}`, {
            data: purchase,
        });
    } catch (error) {
        console.error('Error updating purchase:', error);
        throw error;
    }
};
