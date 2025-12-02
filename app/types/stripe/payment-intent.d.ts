export interface PaymentIntentRequest {
	amount: number;
	currency: string;
	cartIDs: string[];
	automatic_payment_methods?: {
		enabled: boolean,
	},
	userId: string;
	fieldsValue: FormsFields;
}
