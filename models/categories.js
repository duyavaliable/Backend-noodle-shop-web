const db = require('../config/db');

const categoryModel = {
  // Get all categories
  getAll: async () => {
    try {
      const [rows] = await db.pool.query('SELECT * FROM categories ORDER BY name');
      return rows;
    } catch (error) {
      console.error('Loi lay danh sach danh muc:', error);
      throw error;
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const [rows] = await db.pool.query('SELECT * FROM categories WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Loi lay danh muc theo ID:', error);
      throw error;
    }
  },

  // Create new category
  create: async (categoryData) => {
    try {
      const { name, description } = categoryData;
      const [result] = await db.pool.query(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [name, description]
      );
      return result.insertId;
    } catch (error) {
      console.error('Loi tao danh muc:', error);
      throw error;
    }
  },

  // Update existing category
  update: async (id, categoryData) => {
    try {
      const { name, description } = categoryData;
      const [result] = await db.pool.query(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Loi cap nhat danh muc:', error);
      throw error;
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const [result] = await db.pool.query('DELETE FROM categories WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Loi xoa danh muc:', error);
      throw error;
    }
  }
};

module.exports = categoryModel;