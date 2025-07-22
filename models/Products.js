const db = require('../config/db');

const productModel = {
    //Lay tat ca mon an (san pham)
    getAll: async () => {
        try {
            const [rows] = await db.pool.query('SELECT * FROM products ORDER BY name');
            return rows;
        } catch (error) {
            console.error('Loi lay danh sach mon an:', error);
            throw error;
        }
    },
//lay mon an theo ID
    getById: async (id) => {
        try {
            const [rows] = await db.pool.query('SELECT * FROM products WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Loi lay mon an theo ID:', error);
            throw error;
        }
    },
//lay mon an theo danh muc
    getByCategoryId: async (categoryId) => {
        try {
            const [rows] = await db.pool.query('SELECT * FROM products WHERE category_id = ? ORDER BY name', [categoryId]);
            return rows;
        } catch (error) {
            console.error('Loi lay mon an theo danh muc:', error);
            throw error;
        }
    },

    //Tao mon an moi
    create: async (productData) => {
        try {
            const { name, description, price, categoryId, image_url } = productData;
            const [result] = await db.pool.query(
                'INSERT INTO products (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)',
                [name, description, price, categoryId, image_url]
            );
            return result.insertId;
        } catch (error) {
            console.error('Loi tao mon an:', error);
            throw error;
        }
    },

    //Cap nhat mon an
    update: async (id, productData) => {
        try {
            const { name, description, price, categoryId, image_url } = productData;
            const [result] = await db.pool.query(
                'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?',
                [name, description, price, categoryId, image_url, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Loi cap nhat mon an:', error);
            throw error;
        }
    },

    //Xoa mon an
    delete: async (id) => {
        try {
            const [result] = await db.pool.query('DELETE FROM products WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Loi xoa mon an:', error);
            throw error;
        }
    }
};

module.exports = productModel;