import { getDependency } from '../dependency.js';
import bcrypt from 'bcrypt';
import { httpError } from '../utils/http_error.js';

const roles = ['admin', 'seller', 'customer'];

export class UserService {
  constructor() {
    this.userRepo = getDependency('userRepo');
  }

  async getList() {
    return await this.userRepo.find();
  }

  async getByUsername(username) {
    return await this.userRepo.findOne({ username });
  }

  async add(user, { publicRegistration = false } = {}) {
    if (!user || typeof user !== 'object' || Array.isArray(user))
      throw httpError(400, 'Los datos del usuario no son válidos');
    if (typeof user.username !== 'string' || !user.username.trim())
      throw httpError(400, 'El nombre de usuario es obligatorio');

    if (typeof user.password !== 'string' || !user.password)
      throw httpError(400, 'La contraseña es obligatoria');

    if (String(user.password).length < 8)
      throw httpError(400, 'La contraseña debe tener al menos 8 caracteres');

    if (typeof user.displayName !== 'string' || !user.displayName.trim()
      || typeof user.email !== 'string' || !user.email.includes('@'))
      throw httpError(400, 'El nombre completo y un correo electrónico válido son obligatorios');

    if (!publicRegistration && !roles.includes(user.role))
      throw httpError(400, 'El rol indicado no es válido');
    const username = String(user.username).trim();
    if (await this.userRepo.findOne({ username }))
      throw httpError(409, 'El nombre de usuario ya existe');

    return this.userRepo.create({
      username,
      password: await bcrypt.hash(user.password, 10),
      displayName: String(user.displayName).trim(),
      email: String(user.email).trim().toLowerCase(),
      role: publicRegistration ? 'customer' : user.role,
    });
  }

  async delete(username, currentUsername) {
    if (username === currentUsername)
      throw httpError(400, 'No puedes eliminar tu propia cuenta');
    const user = await this.userRepo.findOne({ username });
    if (!user)
      throw httpError(404, 'El usuario no existe');

    await this.userRepo.deleteOne({ username });
  }

  async update(username, userData) {
    if (!userData || typeof userData !== 'object' || Array.isArray(userData))
      throw httpError(400, 'Los datos del usuario no son válidos');
    const user = await this.userRepo.findOne({ username });
    if (!user)
      throw httpError(404, 'El usuario no existe');

    const updates = {};
    for (const field of ['displayName', 'email', 'role']) {
      if (Object.hasOwn(userData, field))
        updates[field] = userData[field];
    }
    if (updates.displayName !== undefined
      && (typeof updates.displayName !== 'string' || !updates.displayName.trim()))
      throw httpError(400, 'El nombre completo no puede estar vacío');
    if (updates.email !== undefined
      && (typeof updates.email !== 'string' || !updates.email.includes('@')))
      throw httpError(400, 'El correo electrónico no es válido');
    if (updates.role !== undefined && !roles.includes(updates.role))
      throw httpError(400, 'El rol indicado no es válido');
    if (updates.displayName !== undefined)
      updates.displayName = updates.displayName.trim();
    if (updates.email !== undefined)
      updates.email = updates.email.trim().toLowerCase();

    if (userData.password !== undefined && userData.password !== '') {
      if (typeof userData.password !== 'string')
        throw httpError(400, 'La contraseña no es válida');
      if (String(userData.password).length < 8)
        throw httpError(400, 'La contraseña debe tener al menos 8 caracteres');
      updates.password = await bcrypt.hash(userData.password, 10);
    }

    return this.userRepo.findOneAndUpdate(
      { username },
      { $set: updates },
      { new: true, runValidators: true, select: '-password' },
    );
  }
}