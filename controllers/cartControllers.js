const cartModel = require('../models/Cart');

const cartController = {
    // Lấy giỏ hàng của người dùng
    getCart: async (req, res) => {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
            }
            const cart = await cartModel.findOrCreateByUserId(userId);
            
            if (!cart) {
                return res.status(404).json({ message: 'Không thể tạo hoặc tìm thấy giỏ hàng cho người dùng' });
            }
            
            const items = await cartModel.getCartContents(cart.id);
            
            res.status(200).json({ cart, items });
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
            res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng của người dùng' });
        }
    },

    // Thêm sản phẩm vào giỏ hàng
    addItemToCart: async (req, res) => {
        try {
            const userId = parseInt(req.params.userId, 10);
            const { productId, quantity } = req.body;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Cần có ID sản phẩm và số lượng hợp lệ' });
            }

            const cart = await cartModel.findOrCreateByUserId(userId);
            await cartModel.addItem(cart.id, productId, quantity);

            res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng' });
        }
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartItem: async (req, res) => {
        try {
            
            const cartItemId = parseInt(req.params.cartItemId, 10);
            const { quantity } = req.body;

            if (quantity === undefined) {
                return res.status(400).json({ message: 'Cần có số lượng' });
            }

            const success = await cartModel.updateItemQuantity(cartItemId, quantity);
            if (success) {
                res.status(200).json({ message: 'Cập nhật sản phẩm trong giỏ hàng thành công' });
            } else {
                res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm trong giỏ hàng' });
        }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeCartItem: async (req, res) => {
        try {
            const cartItemId = parseInt(req.params.cartItemId, 10);
            const success = await cartModel.removeItem(cartItemId);

            if (success) {
                res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
            } else {
                res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
        }
    },

    // Xóa sạch giỏ hàng của người dùng
    clearUserCart: async (req, res) => {
        try {
            const userId = parseInt(req.params.userId, 10);
            const cart = await cartModel.findOrCreateByUserId(userId);
            await cartModel.clearCart(cart.id);
            res.status(200).json({ message: 'Xóa sạch giỏ hàng thành công' });
        } catch (error) {
            console.error('Lỗi khi xóa sạch giỏ hàng:', error);
            res.status(500).json({ message: 'Lỗi khi xóa sạch giỏ hàng' });
        }
    }
};

module.exports = cartController;