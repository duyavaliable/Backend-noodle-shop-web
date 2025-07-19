const db = require('../config/db');
const { get } = require('../routes/orderRoutes');

const orderModel = {
  // Lấy tất cả đơn hàng
  getAll: async () => {
    try {
      const [rows] = await db.pool.query('SELECT * FROM orders ORDER BY order_date DESC');
      return rows;
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      throw error;
    }
  },

  // Lấy đơn hàng theo ID
  getById: async (id) => {
    try {
      const [rows] = await db.pool.query('SELECT * FROM orders WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi lấy đơn hàng theo ID:', error);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  create: async (orderData) => {
    try {
      const { total_amount, status, customer_name, customer_phone, shipping_address } = orderData;
      const [result] = await db.pool.query(
        'INSERT INTO orders (total_amount, status, customer_name, customer_phone, shipping_address) VALUES (?, ?, ?, ?, ?)',
        [total_amount, status, customer_name, customer_phone, shipping_address]
      );
      return result.insertId;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      throw error;
    }
  },

  // Cập nhật đơn hàng
  update: async (id, orderData) => {
    try {
      const { total_amount, status, customer_name, customer_phone, shipping_address } = orderData;
      const [result] = await db.pool.query(
        'UPDATE orders SET total_amount = ?, status = ?, customer_name = ?, customer_phone = ?, shipping_address = ? WHERE id = ?',
        [total_amount, status, customer_name, customer_phone, shipping_address, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi cập nhật đơn hàng:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: async (id, status) => {
    try {
      const [result] = await db.pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
      throw error;
    }
  },

  // Xóa đơn hàng
  delete: async (id) => {
    try {
      const [result] = await db.pool.query('DELETE FROM orders WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi xóa đơn hàng:', error);
      throw error;
    }
  }
};

module.exports = orderModel;