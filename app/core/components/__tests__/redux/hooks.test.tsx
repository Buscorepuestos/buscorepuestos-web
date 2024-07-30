import { describe, test, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../redux/store';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import React from 'react';

afterEach(cleanup);

// Componente de prueba que usa los hooks personalizados
const TestComponent = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state);

    return (
        <div>
            <span>Dispatch function: {typeof dispatch === 'function' ? 'Exists' : 'Does not exist'}</span>
            <span>State exists: {state ? 'Yes' : 'No'}</span>
        </div>
    );
};

describe('hooks', () => {
    test('useAppDispatch should return the dispatch function', () => {
        const { getByText } = render(
            <Provider store={store}>
                <TestComponent />
            </Provider>
        );

        expect(getByText('Dispatch function: Exists')).toBeTruthy();
    });

    test('useAppSelector should return the state', () => {
        const { getByText } = render(
            <Provider store={store}>
                <TestComponent />
            </Provider>
        );

        expect(getByText('State exists: Yes')).toBeTruthy();
    });
});