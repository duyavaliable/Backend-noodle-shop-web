const productModel = require('../models/Products');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await productModel.getAll();
            res.json(products);
        } catch (error) {
            console.error('Loi trong controller getAllProducts:', error);
            res.status(500).json({ error: 'Loi lay danh sach mon an' });
        }
    },

    getProductById: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await productModel.getById(id);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            console.error('Loi trong controller getProductById:', error);
            res.status(500).json({ error: 'Loi lay mon an theo ID' });
        }
    },

    getProductsByCategory: async (req, res) => {
        try {
            const { category_id } = req.params;
            const products = await productModel.getByCategoryId(category_id);
            res.status(200).json(products);
        } catch (error) {
            console.error('Loi trong controller getProductsByCategory:', error);
            res.status(500).json({ error: 'Loi lay mon an theo danh muc' });
        }
    },

    createProduct: async (req, res) => {
        const productData = req.body;
        try {
            const {name, description, price, category_id, image_url} = req.body;
            if (!name || !price || !category_id) {
                return res.status(400).json({ error: 'Name, price, and category ID are required' });
            }

            const newProductId = await productModel.create({ name, description, price, category_id, image_url });
            res.status(201).json({ message: 'Product created successfully', productId: newProductId });
        } catch (error) {
            console.error('Loi trong controller createProduct:', error);
            res.status(500).json({ error: 'Loi tao mon an' });
        }
    },

    updateProduct: async (req, res) => {
       try { 
        const { id } = req.params;
        const { name, description, price, category_id, image_url } = req.body;
        
        if (!name || !price || !category_id) {
            return res.status(400).json({ error: 'Name, price, and category ID are required' });
        }

        const product = await productModel.getById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const success = await productModel.update(id, { name, description, price, category_id, image_url });
        if (success) {
            res.status(200).json({ message: 'Product updated successfully' });
        } else {
            res.status(500).json({ error: 'Loi cap nhat mon an' });
        }
       } catch (error) {
            console.error('Loi trong controller updateProduct:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await productModel.getById(id);
            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy món ăn' });
            }
            
            const success = await productModel.delete(id);
            
            if (success) {
                res.status(200).json({ message: 'Xóa món ăn thành công' });
            } else {
                res.status(400).json({ message: 'Không thể xóa món ăn' });
            }
        } catch (error) {
        console.error('Lỗi trong controller deleteProduct:', error);
        res.status(500).json({ message: 'Lỗi xóa món ăn' });
        }
    },

    searchProducts: async (req, res) => {
        try {
            const { keyword, category_id, min_price, max_price, sort } = req.query;
            
            if (!keyword && !category_id && !min_price && !max_price) {
                return res.status(400).json({ error: 'Vui lòng cung cấp ít nhất một tiêu chí tìm kiếm' });
            }
            
            const products = await productModel.search({
                keyword, 
                category_id, 
                min_price, 
                max_price,
                sort
            });
            
            res.status(200).json(products);
        } catch (error) {
            console.error('Lỗi trong controller searchProducts:', error);
            res.status(500).json({ error: 'Lỗi tìm kiếm sản phẩm' });
        }
    }
};

module.exports = productController;
