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
    getByCategoryId: async (category_id) => {
        try {
            const [rows] = await db.pool.query('SELECT * FROM products WHERE category_id = ? ORDER BY name', [category_id]);
            return rows;
        } catch (error) {
            console.error('Loi lay mon an theo danh muc:', error);
            throw error;
        }
    },

    //Tao mon an moi
    create: async (productData) => {
        try {
            const { name, description, price, category_id, image_url } = productData;
            const [result] = await db.pool.query(
                'INSERT INTO products (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)',
                [name, description, price, category_id, image_url]
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
            const { name, description, price, category_id, image_url } = productData;
            const [result] = await db.pool.query(
                'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?',
                [name, description, price, category_id, image_url, id]
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
    },

    //tim kiem mon an 
    search: async (searchParams) => {
               try {
            const { keyword, category_id, min_price, max_price, sort } = searchParams;
            
            let query = `
                SELECT p.id, p.name, p.price, p.image_url, p.category_id, c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE 1=1
            `;
            
            const params = [];
            
            // Thêm điều kiện tìm kiếm theo từ khóa
            if (keyword) {
                query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
                params.push(`%${keyword}%`, `%${keyword}%`);
            }
            
            // Thêm điều kiện tìm kiếm theo danh mục
            if (category_id) {
                query += ` AND p.category_id = ?`;
                params.push(category_id);
            }
            
            // Thêm điều kiện tìm kiếm theo giá
            if (min_price) {
                query += ` AND p.price >= ?`;
                params.push(min_price);
            }
            
            if (max_price) {
                query += ` AND p.price <= ?`;
                params.push(max_price);
            }
            
            // Thêm sắp xếp
            if (sort) {
                switch (sort) {
                    case 'price_asc':
                        query += ` ORDER BY p.price ASC`;
                        break;
                    case 'price_desc':
                        query += ` ORDER BY p.price DESC`;
                        break;
                    case 'name_asc':
                        query += ` ORDER BY p.name ASC`;
                        break;
                    case 'name_desc':
                        query += ` ORDER BY p.name DESC`;
                        break;
                    default:
                        query += ` ORDER BY p.name ASC`;
                }
            } else {
                query += ` ORDER BY p.name ASC`;
            }
            
            const [rows] = await db.pool.query(query, params);
            return rows;
        } catch (error) {
            console.error('Lỗi tìm kiếm sản phẩm:', error);
            throw error;
        }
    }
};

module.exports = productModel;