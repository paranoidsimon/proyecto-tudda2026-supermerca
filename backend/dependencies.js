import { addDependency } from './dependency.js';
import { UserService } from './services/user_service.js';
import { LoginService } from './services/login_service.js';
import { SessionService } from './services/session_service.js';
import userMongo from './mongo-db/user_mongo.js';
import sessionMongo from './mongo-db/session_mongo.js';
import productMongo from './mongo-db/product_mongo.js';
import cartMongo from './mongo-db/cart_mongo.js';
import orderMongo from './mongo-db/order_mongo.js';
import { ProductService } from './services/product_service.js';
import { CommerceService } from './services/commerce_service.js';

addDependency('userRepo', userMongo);
addDependency('sessionRepo', sessionMongo);
addDependency('productRepo', productMongo);
addDependency('cartRepo', cartMongo);
addDependency('orderRepo', orderMongo);

addDependency('userService', new UserService());
addDependency('sessionService', new SessionService());
addDependency('loginService', new LoginService());
addDependency('productService', new ProductService());
addDependency('commerceService', new CommerceService());
