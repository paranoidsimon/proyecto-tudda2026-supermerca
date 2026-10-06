import { getDependency } from '../dependency.js';

export class SessionService {
  constructor() {
    this.sessionRepo = getDependency('sessionRepo');
  }

  createToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async getByToken(token) {
    return await this.sessionRepo.findOne({ authorizationToken: token });
  }

  async createForUser(user) {
    var authorizationToken;
    do {
      authorizationToken = this.createToken();
    } while (await this.getByToken(authorizationToken));

    const session = {
      username: user.username,
      authorizationToken,
      role: user.role === 'user' ? 'customer' : user.role,
      open: new Date().toISOString(),
    };

    return await this.sessionRepo.create(session);
  }
}