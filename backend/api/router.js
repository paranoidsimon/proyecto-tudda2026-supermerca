import { configureUserRouter } from './user_router.js';
import { configureLoginRouter } from './login_router.js';
import { configureProductRouter } from './product_router.js';
import { configureCommerceRouter } from './commerce_router.js';

export function configureRouter(router) {
  console.log('Configurando rutas principales');
  configureUserRouter(router);
  configureLoginRouter(router);
  configureProductRouter(router);
  configureCommerceRouter(router);
}