const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  items: [
    {
      id: String,
      name: String,
      description: String,
      price: Number,
      category: String,
      imageUrl: String,
      quantity: Number,
      specialInstructions: String,
    },
  ],
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'served'], default: 'pending' },
  timestamp: { type: Number, default: Date.now },
  total: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
