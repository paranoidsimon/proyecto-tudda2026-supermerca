import { getDependency } from '../dependency.js';
import checkRoleMiddleware from '../middlewares/check_role_middleware.js';

export function configureProductRouter(router) {
  const productService = getDependency('productService');
  const canManageProducts = checkRoleMiddleware(['admin', 'seller']);

  router.get('/products', async (req, res) => {
    const manager = ['admin', 'seller'].includes(req.session?.role);
    const products = await productService.getList({
      search: String(req.query.search ?? ''),
      category: String(req.query.category ?? ''),
    }, manager);
    res.json(products);
  });

  router.post('/products', canManageProducts, async (req, res) => {
    const product = await productService.add(req.body);
    res.status(201).json(product);
  });

  router.patch('/products/:id', canManageProducts, async (req, res) => {
    const product = await productService.update(req.params.id, req.body);
    res.json(product);
  });

  router.delete('/products/:id', canManageProducts, async (req, res) => {
    await productService.delete(req.params.id);
    res.json({ message: 'Producto eliminado correctamente' });
  });
}
