import assert from 'node:assert/strict';
import test from 'node:test';
import { addDependency } from '../dependency.js';
import { CommerceService } from '../services/commerce_service.js';

const products = new Map();
const carts = new Map();
const orders = new Map();
let orderSequence = 1;

addDependency('productRepo', {
  async find(filter) {
    if (!filter._id?.$in)
      return [...products.values()];
    return filter._id.$in.map(id => products.get(String(id))).filter(Boolean);
  },
  async findOne(filter) {
    const product = products.get(String(filter._id));
    return product && (!filter.active || product.active) ? product : null;
  },
  async findOneAndUpdate(filter, update) {
    const product = products.get(String(filter._id));
    if (!product || (filter.active && !product.active)
      || (filter.stock && product.stock < filter.stock.$gte))
      return null;
    product.stock += update.$inc.stock;
    return { ...product };
  },
  async updateOne(filter, update) {
    const product = products.get(String(filter._id));
    if (product)
      product.stock += update.$inc.stock;
  },
});

addDependency('cartRepo', {
  async findOne(filter) {
    return carts.get(filter.username) ?? null;
  },
  async create(data) {
    const cart = {
      ...data,
      async save() {
        carts.set(this.username, this);
        return this;
      },
    };
    carts.set(data.username, cart);
    return cart;
  },
});

addDependency('orderRepo', {
  async create(data) {
    const order = { ...data, _id: `order-${orderSequence++}` };
    orders.set(order._id, order);
    return order;
  },
  async deleteOne(filter) {
    orders.delete(filter._id);
  },
  find(filter) {
    const list = [...orders.values()].filter(order =>
      !filter.username || order.username === filter.username);
    return { sort: async () => list };
  },
  async findOneAndUpdate(filter, update) {
    const order = orders.get(filter._id);
    if (!order || (filter.status?.$nin && filter.status.$nin.includes(order.status))
      || (filter.status?.$ne && filter.status.$ne === order.status))
      return null;
    order.status = update.$set.status;
    return order;
  },
});

const commerce = new CommerceService();

function reset() {
  products.clear();
  carts.clear();
  orders.clear();
  orderSequence = 1;
  products.set('p1', { _id: 'p1', name: 'Manzanas', price: 125.5, stock: 5, active: true });
  products.set('p2', { _id: 'p2', name: 'Pan', price: 80, stock: 2, active: true });
}

test('checkout usa precios del catálogo y descuenta inventario', async () => {
  reset();
  await commerce.addCartItem('ana', 'p1');
  await commerce.addCartItem('ana', 'p1');

  const order = await commerce.checkout('ana');

  assert.equal(order.status, 'pending');
  assert.equal(order.total, 251);
  assert.equal(order.items[0].price, 125.5);
  assert.equal(products.get('p1').stock, 3);
  assert.equal((await commerce.getCart('ana')).items.length, 0);
});

test('checkout revierte inventario si un artículo ya no tiene stock', async () => {
  reset();
  await commerce.addCartItem('ana', 'p1');
  await commerce.addCartItem('ana', 'p2');
  products.get('p2').stock = 0;

  await assert.rejects(
    commerce.checkout('ana'),
    error => error.statusCode === 409,
  );
  assert.equal(products.get('p1').stock, 5);
  assert.equal((await commerce.getCart('ana')).items.length, 2);
  assert.equal(orders.size, 0);
});

test('los clientes solo consultan sus pedidos y cancelar repone stock una vez', async () => {
  reset();
  await commerce.addCartItem('ana', 'p1');
  const order = await commerce.checkout('ana');
  await commerce.addCartItem('bea', 'p2');
  await commerce.checkout('bea');

  assert.equal((await commerce.getOrders('ana', 'customer')).length, 1);
  assert.equal((await commerce.getOrders('admin', 'admin')).length, 2);

  await commerce.updateOrderStatus(order._id, 'cancelled');
  assert.equal(products.get('p1').stock, 5);
  await assert.rejects(commerce.updateOrderStatus(order._id, 'cancelled'), error => error.statusCode === 404);
  assert.equal(products.get('p1').stock, 5);
});

test('el carrito rechaza cantidades no válidas y mayores al inventario', async () => {
  reset();
  await assert.rejects(commerce.setCartItem('ana', 'p1', 0), error => error.statusCode === 400);
  await assert.rejects(commerce.setCartItem('ana', 'p1', 6), error => error.statusCode === 409);
});
