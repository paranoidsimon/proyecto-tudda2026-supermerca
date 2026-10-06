import { getDependency } from '../dependency.js';
import { httpError } from '../utils/http_error.js';

function productData(data, partial = false) {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw httpError(400, 'Los datos del producto no son válidos');

  const fields = ['name', 'description', 'category', 'price', 'stock', 'imageUrl', 'active'];
  const result = Object.fromEntries(fields
    .filter(field => Object.hasOwn(data, field))
    .map(field => [field, data[field]]));

  if (!partial && (!result.name || result.price === undefined))
    throw httpError(400, 'El nombre y el precio del producto son obligatorios');

  for (const field of ['name', 'description', 'category', 'imageUrl']) {
    if (result[field] !== undefined && typeof result[field] !== 'string')
      throw httpError(400, `El campo ${field} debe ser texto`);
  }
  if (result.name !== undefined && !String(result.name).trim())
    throw httpError(400, 'El nombre del producto no puede estar vacío');
  if (result.price !== undefined && (
    (typeof result.price !== 'number' && (typeof result.price !== 'string' || !result.price.trim()))
    || !Number.isFinite(Number(result.price))
    || Number(result.price) < 0
  ))
    throw httpError(400, 'El precio debe ser un número mayor o igual a cero');
  if (result.stock !== undefined && (
    (typeof result.stock !== 'number' && (typeof result.stock !== 'string' || !result.stock.trim()))
    || !Number.isInteger(Number(result.stock))
    || Number(result.stock) < 0
  ))
    throw httpError(400, 'El inventario debe ser un entero mayor o igual a cero');
  if (result.active !== undefined && typeof result.active !== 'boolean')
    throw httpError(400, 'El estado del producto no es válido');

  for (const field of ['price', 'stock']) {
    if (result[field] !== undefined)
      result[field] = Number(result[field]);
  }

  return result;
}

export class ProductService {
  constructor() {
    this.productRepo = getDependency('productRepo');
  }

  async getList({ search = '', category = '' } = {}, includeInactive = false) {
    const filter = includeInactive ? {} : { active: true };
    if (category)
      filter.category = category;
    if (search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { category: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    return this.productRepo.find(filter).sort({ createdAt: -1 });
  }

  async add(data) {
    return this.productRepo.create(productData(data));
  }

  async update(id, data) {
    const updated = await this.productRepo.findByIdAndUpdate(
      id,
      { $set: productData(data, true) },
      { new: true, runValidators: true },
    );
    if (!updated)
      throw httpError(404, 'El producto no existe');
    return updated;
  }

  async delete(id) {
    const deleted = await this.productRepo.findByIdAndDelete(id);
    if (!deleted)
      throw httpError(404, 'El producto no existe');
  }
}
