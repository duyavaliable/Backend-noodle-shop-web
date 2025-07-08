const express = require('express');
const categoryControllers = require('../controllers/categoryControllers');

const router = express.Router();

// Get all categories
router.get('/', categoryControllers.getAllCategories);

// Get category by ID
router.get('/:id', categoryControllers.getCategoryById);

// Create new category
router.post('/', categoryControllers.createCategory);

// Update category
router.put('/:id', categoryControllers.updateCategory);

// Delete category
router.delete('/:id', categoryControllers.deleteCategory);

module.exports = router;