const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const order = new Order({
    tableNumber: req.body.tableNumber,
    items: req.body.items,
    total: req.body.total,
  });

  try {
    const newOrder = await order.save();
    req.app.get('io').emit('newOrder', newOrder); // Emit event to all connected clients
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.body.status) {
      order.status = req.body.status;
      order.timestamp = Date.now();
    }

    const updatedOrder = await order.save();
    req.app.get('io').emit('orderUpdated', updatedOrder); // Emit event to all connected clients
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
