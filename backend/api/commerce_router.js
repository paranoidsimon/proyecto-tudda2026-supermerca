import { getDependency } from '../dependency.js';
import checkRoleMiddleware from '../middlewares/check_role_middleware.js';

export function configureCommerceRouter(router) {
  const commerceService = getDependency('commerceService');
  const customerOnly = checkRoleMiddleware(['customer']);
  const authenticated = checkRoleMiddleware(['admin', 'seller', 'customer']);
  const canManageOrders = checkRoleMiddleware(['admin', 'seller']);

  router.get('/cart', customerOnly, async (req, res) => {
    res.json(await commerceService.getCart(req.session.username));
  });

  router.put('/cart/:productId', customerOnly, async (req, res) => {
    res.json(await commerceService.setCartItem(
      req.session.username,
      req.params.productId,
      req.body?.quantity,
    ));
  });

  router.post('/cart/:productId', customerOnly, async (req, res) => {
    res.json(await commerceService.addCartItem(req.session.username, req.params.productId));
  });

  router.delete('/cart/:productId', customerOnly, async (req, res) => {
    res.json(await commerceService.removeCartItem(req.session.username, req.params.productId));
  });

  router.post('/checkout', customerOnly, async (req, res) => {
    res.status(201).json(await commerceService.checkout(req.session.username));
  });

  router.get('/orders', authenticated, async (req, res) => {
    res.json(await commerceService.getOrders(req.session.username, req.session.role));
  });

  router.patch('/orders/:id/status', canManageOrders, async (req, res) => {
    res.json(await commerceService.updateOrderStatus(req.params.id, req.body?.status));
  });
}
