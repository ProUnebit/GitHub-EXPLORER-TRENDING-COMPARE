import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// ============================================
// MSW SERVER - для Node.js тестов
// ============================================
// Запускается в beforeAll, останавливается в afterAll

export const server = setupServer(...handlers);
