const express = require('express');
const cartController = require('../controllers/cartControllers');

const router = express.Router();

// Lấy giỏ hàng của người dùng
router.get('/user/:userId', cartController.getCart);

// Thêm sản phẩm vào giỏ hàng của người dùng
router.post('/user/:userId/items', cartController.addItemToCart);

// Xóa sạch giỏ hàng của người dùng
router.delete('/user/:userId', cartController.clearUserCart);

// Cập nhật số lượng của một sản phẩm trong giỏ hàng
router.put('/items/:cartItemId', cartController.updateCartItem);

// Xóa một sản phẩm cụ thể khỏi giỏ hàng
router.delete('/items/:cartItemId', cartController.removeCartItem);

module.exports = router;