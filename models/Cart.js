const db = require('../config/db');

const cartModel = {
    // Tìm hoặc tạo giỏ hàng cho người dùng. Mỗi người dùng chỉ có một giỏ hàng.
    findOrCreateByUserId: async (userId) => {
        try {
            let [rows] = await db.pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
            if (rows.length > 0) {
                return rows[0]; // Trả về giỏ hàng đã có
            } else {
                // Tạo giỏ hàng mới nếu chưa tồn tại
                const [result] = await db.pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
                const [newCart] = await db.pool.query('SELECT * FROM carts WHERE id = ?', [result.insertId]);
                return newCart[0];
            }
        } catch (error) {
            console.error('Lỗi khi tìm hoặc tạo giỏ hàng:', error);
            throw error;
        }
    },

    // Lấy tất cả sản phẩm trong giỏ hàng của người dùng
    getCartContents: async (cartId) => {
        try {
            //ci - cart_items, p - products
            const [items] = await db.pool.query(`
                SELECT ci.id as cart_item_id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.cart_id = ?
            `, [cartId]);
            return items;
        } catch (error) {
            console.error('Lỗi khi lấy nội dung giỏ hàng:', error);
            throw error;
        }
    },

    // Thêm sản phẩm vào giỏ hàng, hoặc cập nhật số lượng nếu đã tồn tại
    addItem: async (cartId, productId, quantity) => {
        try {
            const [existingItems] = await db.pool.query(
                'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
                [cartId, productId]
            );

            if (existingItems.length > 0) {
                // Sản phẩm đã tồn tại, cập nhật số lượng
                const newQuantity = existingItems[0].quantity + quantity;
                await db.pool.query(
                    'UPDATE cart_items SET quantity = ? WHERE id = ?',
                    [newQuantity, existingItems[0].id]
                );
            } else {
                // Sản phẩm chưa có, thêm mới
                await db.pool.query(
                    'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                    [cartId, productId, quantity]
                );
            }
            return true;
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            throw error;
        }
    },

    // Cập nhật số lượng của một sản phẩm trong giỏ hàng
    updateItemQuantity: async (cartItemId, quantity) => {
        try {
            if (quantity <= 0) {
                // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
                return await module.exports.removeItem(cartItemId);
            }
            const [result] = await db.pool.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [quantity, cartItemId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
            throw error;
        }
    },

    // Xóa một sản phẩm khỏi giỏ hàng
    removeItem: async (cartItemId) => {
        try {
            const [result] = await db.pool.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            throw error;
        }
    },

    // Xóa tất cả sản phẩm khỏi giỏ hàng
    clearCart: async (cartId) => {
        try {
            await db.pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa sạch giỏ hàng:', error);
            throw error;
        }
    },
};

module.exports = cartModel;