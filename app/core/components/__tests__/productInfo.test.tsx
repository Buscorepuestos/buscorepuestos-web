import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ProductInfo from '../productInfo/productInfo';

describe('ProductInfo', () => {
    afterEach(() => {
        cleanup();
    });

    const props = {
        vehicleVersion: 'MINI MINI 5-TRG. (F55) 2015',
        engine: 'Cooper 136CV / 100KW',
        engineCode: 'B38A15A',
        oemReference: 'BFO',
        observations: `
            Modelo especial Importado. Leo molestie per fermentum tempor porttitor, 
            nisi facilisis sodales nullam, feugiat mollis at lobortis. Curae mollis 
            vehicula facilisis non convallis leo tempor magnis nascetur eros, 
            neque hac platea sociosqu purus dignissim habitant proin. 
            Lacus vulputate inceptos facilisis vel varius tristique nascetur, 
            malesuada curabitur nec fringilla mollis cum ut, habitasse parturient 
            consequat donec montes eros.
        `
    };

    it('renders the product information correctly', () => {
        render(<ProductInfo {...props} />);

        expect(screen.queryByText('Versión del vehículo')).not.toBeNull();
        expect(screen.queryByText(props.vehicleVersion)).not.toBeNull();
        expect(screen.queryByText('Motor')).not.toBeNull();
        expect(screen.queryByText(props.engine)).not.toBeNull();
        expect(screen.queryByText('Código del motor')).not.toBeNull();
        expect(screen.queryByText(props.engineCode)).not.toBeNull();
        expect(screen.queryByText('Referencia principal OEM')).not.toBeNull();
        expect(screen.queryByText(props.oemReference)).not.toBeNull();
        expect(screen.queryByText('Observaciones')).not.toBeNull();

       // Se normaliza el texto esperado y el texto renderizado
        const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim();
        const normalizedObservations = normalizeText(props.observations);
        const renderedText = screen.getByText(/Modelo especial Importado./).textContent;
        const normalizedRenderedText = normalizeText(renderedText!);

       // Se verifica el contenido de observaciones después de normalizar el texto
        expect(normalizedRenderedText).toBe(normalizedObservations);
    });
});