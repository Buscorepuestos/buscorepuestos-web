import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { useGetProductByIdQuery, useGetDistributorByIdQuery } from '../../../../redux/services/productService';
import { Provider } from 'react-redux';
import { store } from '../../../../redux/store';
import React from 'react';

// Componente de prueba para los hooks
const TestComponent = ({params} : {params: { id: string }}) => {
    const { data, error, isLoading } = useGetProductByIdQuery({ id: params.id });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return <div>{data ? `Product: ${data.title}` : 'No product data'}</div>;
}

const TestDistributorComponent = ({ id }: { id: string }) => {
    const { data, error, isLoading } = useGetDistributorByIdQuery({ id });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return <div>{data ? `Distributor: ${data.data?.fields.Provincia}` : 'No distributor data'}</div>;
};

afterEach(cleanup);

describe('productService API', () => {
    test('should fetch product data successfully', async () => {
        const { findByText } = render(
            <Provider store={store}>
                <TestComponent params={
                    { id: '1' }
                }/>
            </Provider>
        );

        // Verificar que el texto esperado esté presente
        expect(await findByText('Product: Mock Product')).toBeTruthy();
    });

    test('should fetch distributor data successfully', async () => {
        const { findByText } = render(
            <Provider store={store}>
                <TestDistributorComponent id="1" />
            </Provider>
        );

        // Verificar que el texto esperado esté presente
        expect(await findByText('Distributor: Mock Provincia')).toBeTruthy();
    });
});