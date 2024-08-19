import { describe, test, expect } from 'vitest';
import api from '../../../../api/api'

describe('API Instance', () => {
	test('should have the correct baseURL', () => {
		expect(api.defaults.baseURL).toBe('https://buscorepuestos.herokuapp.com/api');
	});

	test('should have the correct headers', () => {
		expect(api.defaults.headers['Content-Type']).toBe('application/json');
	});

	test('should create an instance of Axios', () => {
		expect(api).toHaveProperty('get');
		expect(api).toHaveProperty('post');
		expect(api).toHaveProperty('put');
		expect(api).toHaveProperty('delete');
	});
});
