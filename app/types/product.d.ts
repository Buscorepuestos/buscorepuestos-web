export interface IProductMongoose {
	_id: string;
	airtableId?: string;
	airtableIdFromProviderDashboard?: string;
	buscorepuestosReference: string;
	title: string;
	productName?: string;
	idVehicle?: string;
	codArticulo?: string;
	idEmpresa?: string;
	refLocal?: string;
	isMetasync?: boolean;
	peso?: number;
	buscorepuestosPrice?: number;
	increasedPrice?: number;
	discount?: number;
	images: string[];
	url: string;
	distributor?: string;
	budgets?: string[];
	stock?: boolean;
	distributorReference: string;
	mainReference?: string;
	references: string[];
	observations: string;
	price: number;
	shipmentPrice?: number;
	engine?: string;
	gearbox: string;
	engineCode?: string;
	gearboxCode?: string;
	color?: string;
	year: number;
	frame: string;
	version: string;
	doors: number;
	authorized?: boolean;
	enhancedImageScript?: boolean;
	updatedPriceScript?: boolean;
	createdAt: Date;
	updatedAt?: Date;
	category?: string;
	subcategory?: string;
	brand: string;
	articleModel: string;
	isNewProduct: boolean;
	km?: number;
	fuel?: string;
	discountPercent?: number;
	supplement?: number;
	noIvaAppliedDiscount?: number;
}
