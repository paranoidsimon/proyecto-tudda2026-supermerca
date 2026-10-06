import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

export default mongoose.model('carts', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
}, { timestamps: true }));
