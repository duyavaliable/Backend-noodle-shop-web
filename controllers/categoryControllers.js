const categoryModel = require('../models/categories');

const categoryControllers = {
  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryModel.getAll();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error in getAllCategories controller:', error);
      res.status(500).json({ message: 'Loi lay danh sach danh muc' });
    }
  },

  // Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await categoryModel.getById(id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.status(200).json(category);
    } catch (error) {
      console.error('Error in getCategoryById controller:', error);
      res.status(500).json({ message: 'Loi lay danh muc theo ID' });
    }
  },

  // Create new category
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }
      
      const newCategoryId = await categoryModel.create({ name, description });
      res.status(201).json({ 
        message: 'Category created successfully', 
        categoryId: newCategoryId 
      });
    } catch (error) {
      console.error('Error in createCategory controller:', error);
      res.status(500).json({ message: 'Loi tao danh muc' });
    }
  },

  // Update category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }
      
      const category = await categoryModel.getById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      const success = await categoryModel.update(id, { name, description });
      
      if (success) {
        res.status(200).json({ message: 'Category updated successfully' });
      } else {
        res.status(400).json({ message: 'Failed to update category' });
      }
    } catch (error) {
      console.error('Error in updateCategory controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      
      const category = await categoryModel.getById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      const success = await categoryModel.delete(id);
      
      if (success) {
        res.status(200).json({ message: 'Category deleted successfully' });
      } else {
        res.status(400).json({ message: 'Failed to delete category' });
      }
    } catch (error) {
      console.error('Error in deleteCategory controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = categoryControllers;