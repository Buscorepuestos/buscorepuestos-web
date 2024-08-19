import { server } from './server';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Configura MSW antes de que empiecen las pruebas
beforeAll(() => server.listen());

// Restablece los handlers después de cada prueba
afterEach(() => server.resetHandlers());

// Cierra el servidor después de todas las pruebas
afterAll(() => server.close());