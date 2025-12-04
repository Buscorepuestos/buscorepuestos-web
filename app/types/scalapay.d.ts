import React from 'react';
import { FormsFields } from '../../../core/components/checkoutPage/CheckoutPage'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'scalapay-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'amount-selectors'?: string;
                environment?: string; // Cambiado a string genérico para evitar conflictos, o usa 'integration' | 'production' si prefieres estricto
                'merchant-token'?: string;
                type?: string;
                locale?: string;
            };
        }
    }

    // También añadimos la definición de Window aquí para que sea global
    interface Window {
        Scalapay?: {
            init: (config?: any) => void;
        };
        _scalapayScriptLoadingPromise?: Promise<void>;
    }
}

export interface CreateOrderPayload1 {
    purchaseIds: string[]; // IDs de las compras en Airtable/Mongo
    consumer: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };
    shipping: {
        countryCode: string; // "ES"
        name: string;
        postcode: string;
        suburb: string; // Ciudad
        line1: string;
    };
}

export interface CreateOrderPayload {
    purchaseIds: string[]; // IDs de las compras en Airtable/Mongo
    userId: string; // ID del usuario en tu sistema
    fieldsValue: FormsFields; // Valores del formulario de checkout
    items: any[]; 
}

export interface ScalapayCreateOrderResponse {
    token: string;
    expires: string; // "2021-06-25T13:00:00.000+01:00"
    checkoutUrl: string; // La URL a la que debemos redirigir al cliente
}
