const express = require('express');
const orderControllers = require('../controllers/orderControllers');

const router = express.Router();

router.get('/', orderControllers.getAllOrders);
router.get('/:id', orderControllers.getOrderById);
router.post('/', orderControllers.createOrder);
router.put('/:id', orderControllers.updateOrder);
router.put('/:id/status', orderControllers.updateOrderStatus);
router.delete('/:id', orderControllers.deleteOrder);

module.exports = router;
