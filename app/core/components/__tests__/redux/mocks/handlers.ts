import { http, HttpResponse } from 'msw';
import { ProductMongoInterface } from '../../../../../redux/interfaces/product.interface';
import { BaseInterface } from '../../../../../redux/interfaces/base.interface';

// Mock de productos
const mockProduct: ProductMongoInterface = {
    _id: '1',
    title: 'Mock Product',
    images: [],
    url: '',
    budgets: [],
    productName: '',
    references: [],
    price: 0,
    color: '',
    engine: '',
    engineCode: '',
    frame: '',
    gearbox: '',
    gearboxCode: '',
    version: '',
    year: 0,
    stock: true,
    distributor: '',
    distributorReference: '',
    mainReference: '',
    buscorepuestosReference: '',
    createdAt: '',
    observations: '',
    shipmentPrice: 0,
    increasedPrice: 0,
    category: '',
    brand: '',
    articleModel: '',
    isNewProduct: false,
    addedToBudget: false,
    inBudget: false
};

// Mock de distribuidores
interface DistributorFields {
    fields: {
        Provincia: string;
        'Media de valoración': number;
    };
}

const mockDistributor: BaseInterface<DistributorFields> = {
    data: {
        fields: {
            Provincia: 'Mock Provincia',
            'Media de valoración': 5
        }
    },
    message: 'Mock message'
};

// Mock de handlers
export const handlers = [
    // Manejador para obtener un producto por ID
    http.get('https://buscorepuestos-dev.herokuapp.com/api/products/product-mongo/:id', () => {
        return HttpResponse.json({
            data: mockProduct,
            message: 'Mock message'
        });
    }),
    // Manejador para obtener un distribuidor por ID
    http.get('https://buscorepuestos-dev.herokuapp.com/api/distributors/:id', () => {
        return HttpResponse.json(mockDistributor);
    })
];