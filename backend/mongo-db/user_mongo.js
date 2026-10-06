import mongoose from 'mongoose';

export default mongoose.model('users', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seller', 'customer', 'user'], default: 'customer' },
}));
