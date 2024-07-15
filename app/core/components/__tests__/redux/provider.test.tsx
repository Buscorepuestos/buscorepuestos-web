import { describe, test, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { Providers } from '../../../../redux/provider';
import React from 'react';

afterEach(cleanup);

const TestComponent = () => {
    return <div>Test Component</div>;
};

describe('Providers', () => {
    test('should render children within the Redux provider', () => {
        const { getByText } = render(
            <Providers>
                <TestComponent />
            </Providers>
        );

        expect(getByText('Test Component')).toBeTruthy();
    });
});