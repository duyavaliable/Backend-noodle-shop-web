const express = require('express');
const productControllers = require('../controllers/productControllers');

const router = express.Router();

// Lấy tất cả món ăn
router.get('/', productControllers.getAllProducts);

// Lấy món ăn theo ID
router.get('/:id', productControllers.getProductById);

// Lấy món ăn theo danh mục
router.get('/category/:categoryId', productControllers.getProductsByCategory);

// Tạo món ăn mới
router.post('/', productControllers.createProduct);

// Cập nhật món ăn
router.put('/:id', productControllers.updateProduct);

// Xóa món ăn
router.delete('/:id', productControllers.deleteProduct);

module.exports = router;