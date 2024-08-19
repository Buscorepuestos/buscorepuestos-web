import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Configura el servidor de MSW con los handlers
export const server = setupServer(...handlers);

// Configura MSW para escuchar solicitudes antes de las pruebas
beforeAll(() => server.listen());

// Restablece los handlers después de cada prueba
afterEach(() => server.resetHandlers());

// Cierra el servidor después de todas las pruebas
afterAll(() => server.close());