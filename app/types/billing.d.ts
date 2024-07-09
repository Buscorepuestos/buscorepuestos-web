import { AirtableAttachment } from './airtable-base/airtable-types'

export interface BillingModel {
	"Fecha creación"?: Date;
	"Factura BR"?: AirtableAttachment[];
	"Factura Distribuidor"?: AirtableAttachment[];
	"N Factura"?: number;
	"Usuarios": string[];
	"Compras": string[];
	"Distribuidores"?: string[];
	"Comercial/Att.Cliente"?: string[];
	"Artículos/stock"?: string[];
	"WhatsApp (from Usuarios)"?: string;
	"Correo electrónico (from Usuarios)"?: string;
	"Nombre Cliente/Empresa (from Usuarios)"?: string;
	"DNI/CIF (from Usuarios)"?: string;
	"Description (from Compras)"?: string;
	"Unit Price (from Compras)"?: string;
	name: string;
	nif: string;
	address: string;
	addressNumber: string;
	additionalInformation?: string;
	location: string;
	province: string;
	cp: string;
	country: string;
	phone: number;
	transfer: boolean;
	"Id Orden Redsys"?: string;
	"Total factura"?: number;
	"Id Pago Stripe"?: string;
}
