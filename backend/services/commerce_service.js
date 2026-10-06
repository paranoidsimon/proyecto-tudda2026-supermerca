import { getDependency } from '../dependency.js';
import { httpError } from '../utils/http_error.js';

const orderStatuses = ['confirmed', 'shipped', 'completed', 'cancelled'];

export class CommerceService {
  constructor() {
    this.productRepo = getDependency('productRepo');
    this.cartRepo = getDependency('cartRepo');
    this.orderRepo = getDependency('orderRepo');
  }

  async getOrCreateCart(username) {
    let cart = await this.cartRepo.findOne({ username });
    if (!cart)
      cart = await this.cartRepo.create({ username, items: [] });
    return cart;
  }

  async getCart(username) {
    const cart = await this.getOrCreateCart(username);
    const products = await this.productRepo.find({
      _id: { $in: cart.items.map(item => item.productId) },
    });
    const productById = new Map(products.map(product => [String(product._id), product]));
    const items = cart.items.map(item => {
      const product = productById.get(String(item.productId));
      return {
        product: product ? {
          id: String(product._id),
          name: product.name,
          price: product.price,
          stock: product.stock,
          active: product.active,
          imageUrl: product.imageUrl,
        } : null,
        productId: String(item.productId),
        quantity: item.quantity,
      };
    });
    return {
      items,
      total: items.reduce((total, item) => total + (item.product?.price ?? 0) * item.quantity, 0),
    };
  }

  async setCartItem(username, productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1)
      throw httpError(400, 'La cantidad debe ser un entero mayor a cero');

    const product = await this.productRepo.findOne({ _id: productId, active: true });
    if (!product)
      throw httpError(404, 'El producto no existe o no está disponible');
    if (quantity > product.stock)
      throw httpError(409, 'La cantidad solicitada supera el inventario disponible');

    const cart = await this.getOrCreateCart(username);
    const item = cart.items.find(entry => String(entry.productId) === String(product._id));
    if (item)
      item.quantity = quantity;
    else
      cart.items.push({ productId: product._id, quantity });
    await cart.save();
    return this.getCart(username);
  }

  async addCartItem(username, productId) {
    const cart = await this.getOrCreateCart(username);
    const currentItem = cart.items.find(item => String(item.productId) === productId);
    return this.setCartItem(username, productId, (currentItem?.quantity ?? 0) + 1);
  }

  async removeCartItem(username, productId) {
    const cart = await this.getOrCreateCart(username);
    cart.items = cart.items.filter(item => String(item.productId) !== productId);
    await cart.save();
    return this.getCart(username);
  }

  async checkout(username) {
    const cart = await this.getOrCreateCart(username);
    if (!cart.items.length)
      throw httpError(400, 'El carrito está vacío');

    const reserved = [];
    const orderItems = [];
    const originalItems = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    let total = 0;
    let createdOrder;

    try {
      for (const item of cart.items) {
        const product = await this.productRepo.findOneAndUpdate(
          { _id: item.productId, active: true, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true },
        );
        if (!product)
          throw httpError(409, 'Uno o más productos ya no tienen inventario suficiente');

        reserved.push({ productId: product._id, quantity: item.quantity });
        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });
        total += product.price * item.quantity;
      }

      createdOrder = await this.orderRepo.create({
        username,
        items: orderItems,
        total,
        status: 'pending',
      });
      cart.items = [];
      await cart.save();
      return createdOrder;
    } catch (error) {
      if (createdOrder) {
        await this.orderRepo.deleteOne({ _id: createdOrder._id });
        cart.items = originalItems;
        await cart.save();
      }
      for (const item of reserved)
        await this.productRepo.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
      throw error;
    }
  }

  async getOrders(username, role) {
    const filter = role === 'customer' ? { username } : {};
    return this.orderRepo.find(filter).sort({ createdAt: -1 });
  }

  async updateOrderStatus(id, status) {
    if (!orderStatuses.includes(status))
      throw httpError(400, 'El estado indicado no es válido');

    const query = status === 'cancelled'
      ? { _id: id, status: { $nin: ['cancelled', 'completed', 'shipped'] } }
      : { _id: id, status: { $ne: 'cancelled' } };
    const order = await this.orderRepo.findOneAndUpdate(
      query,
      { $set: { status } },
      { new: true, runValidators: true },
    );
    if (!order)
      throw httpError(404, 'El pedido no existe o ya no admite cambios');

    if (status === 'cancelled') {
      for (const item of order.items)
        await this.productRepo.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
    }
    return order;
  }
}
