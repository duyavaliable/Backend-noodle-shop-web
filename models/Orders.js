const db = require('../config/db');


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

  // Lấy đơn hàng theo user_id
  getByUserId: async (userId) => {
    try {
      const [rows] = await db.pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [userId]);
      return rows;
    } catch (error) {
      console.error('Lỗi lấy đơn hàng theo user_id:', error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng kèm thông tin sản phẩm
  getOrderDetailsById: async (orderId) => {
    try {
      // Lấy thông tin đơn hàng
      const [orderRows] = await db.pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
      if (orderRows.length === 0) return null;
      
      // Lấy chi tiết đơn hàng
      const [itemRows] = await db.pool.query(`
        SELECT oi.*, p.name as product_name, p.image_url 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `, [orderId]);
      
      const order = orderRows[0];
      order.order_items = itemRows;
      
      return order;
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  create: async (orderData) => {
    try {
      const { total_amount, status, customer_name, customer_phone, shipping_address, user_id } = orderData;
      const [result] = await db.pool.query(
        'INSERT INTO orders (total_amount, status, customer_name, customer_phone, shipping_address, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [total_amount, status, customer_name, customer_phone, shipping_address, user_id]
      );
      return result.insertId;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      throw error;
    }
  },

  // Tạo đơn hàng với transaction
  createWithTransaction: async (connection, orderData) => {
    try {
      const { total_amount, status, customer_name, customer_phone, shipping_address, user_id } = orderData;
      const [result] = await connection.query(
        'INSERT INTO orders (total_amount, status, customer_name, customer_phone, shipping_address, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [total_amount, status, customer_name, customer_phone, shipping_address, user_id]
      );
      return result.insertId;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng với transaction:', error);
      throw error;
    }
  },

  // Tạo chi tiết đơn hàng với transaction
  createOrderItemWithTransaction: async (connection, orderItemData) => {
    try {
      const { order_id, product_id, quantity, price } = orderItemData;
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, product_id, quantity, price]
      );
    } catch (error) {
      console.error('Lỗi tạo chi tiết đơn hàng với transaction:', error);
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

  deleteOrderItems: async (orderId) => {
    try {
      const [result] = await db.pool.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi xóa chi tiết đơn hàng:', error);
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