const db = require('../config/db');
const orderModel = require('../models/Orders');

const orderControllers = {
    getAllOrders: async (req, res) => {
        try {
            const orders = await orderModel.getAll();
            res.status(200).json(orders);
        } catch (error) {
            console.error('Lỗi trong controller getAllOrders:', error);
            res.status(500).json({ error: 'Lỗi lấy danh sách đơn hàng' });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const { id  } = req.params;
            const order = await orderModel.getOrderDetailsById(id);

            if (order) {
                return res.status(200).json(order);
            } else {
                return res.status(404).json({ error: 'Đơn hàng không tồn tại hoặc không tìm thấy đơn hàng' });
            }
        } catch (error) {
            console.error('Lỗi trong controller getOrderById:', error);
            res.status(500).json({ error: 'Lỗi lấy đơn hàng theo ID' });
        }
    },

    getOrderByUserId: async (req, res) => {
        try {
            const { userId } = req.params; //??? su khac nhau giua req.params va req.user.id
            const orders = await orderModel.getByUserId(userId);

            if (orders && orders.length > 0) {
                return res.status(200).json(orders);
            } else {
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng cho người dùng này' });
            }
        } catch (error) {
            console.error('Lỗi trong controller getOrderByUserId:', error);
            res.status(500).json({ error: 'Lỗi lấy đơn hàng theo người dùng' });
        }
    },

    createOrder: async (req, res) => {
    try {
        const { total_amount, status = 'Đang xử lý', customer_name, customer_phone, shipping_address, order_items } = req.body;
  

        // Kiểm tra dữ liệu đầu vào - chỉ kiểm tra một lần
        if (!total_amount || !customer_name || !customer_phone || !shipping_address || !order_items || !order_items.length) {
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết để tạo đơn hàng' });
        }
        
        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        const connection = await db.pool.getConnection();
        await connection.beginTransaction();

        try {
            // const user_id = req.user.id || null; // Lấy user_id từ token đã xác thực
            const user_id =  req.body.user_id || null; //tam thoi vi chua co jwt 
            // Tạo đơn hàng
            const newOrderId = await orderModel.createWithTransaction(connection, {
                total_amount,
                status,
                customer_name,
                customer_phone,
                shipping_address,
                user_id
            });

            // Lưu chi tiết đơn hàng
            await Promise.all(order_items.map(item => 
                orderModel.createOrderItemWithTransaction(connection, {
                    order_id: newOrderId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                })
            ));

            // Commit transaction nếu mọi thứ OK
            await connection.commit();
            connection.release();

            res.status(201).json({ 
                message: "Tạo đơn hàng thành công", 
                order: { id: newOrderId } 
            });
        } catch (error) {
            // Rollback nếu có lỗi
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Lỗi trong controller createOrder:', error);
        res.status(500).json({ error: 'Lỗi tạo đơn hàng' });
    }
},
    updateOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const { total_amount, status, customer_name, customer_phone, shipping_address } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!total_amount || !customer_name || !customer_phone || !shipping_address) {
                return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin đơn hàng' });
            }

            //Kiem tra xem don hang co ton tai hay khong
            const existingOrder = await orderModel.getById(id);
            if (!existingOrder) {
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
            }

            const updated = await orderModel.update(id, {
                total_amount,
                status,
                customer_name,
                customer_phone,
                shipping_address
            });

            if (updated) {
                res.status(200).json({ message: 'Cập nhật đơn hàng thành công' });
            } else {
                res.status(404).json({ error: 'Cập nhật đơn hàng thất bại' });
            }
        } catch (error) {
            console.error('Lỗi trong controller updateOrder:', error);
            res.status(500).json({ error: 'Lỗi cập nhật đơn hàng' });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ error: 'Vui lòng cung cấp trạng thái đơn hàng' });
            }

            // Kiểm tra xem đơn hàng có tồn tại hay không
            const existingOrder = await orderModel.getById(id);
            if (!existingOrder) {
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
            }

            const updated = await orderModel.updateStatus(id, status);

            if (updated) {
                res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
            } else {
                res.status(404).json({ error: 'Cập nhật trạng thái đơn hàng thất bại' });
            }
        } catch (error) {
            console.error('Lỗi trong controller updateOrderStatus:', error);
            res.status(500).json({ error: 'Lỗi cập nhật trạng thái đơn hàng' });
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;

            // Kiểm tra xem đơn hàng có tồn tại hay không
            const existingOrder = await orderModel.getById(id);
            if (!existingOrder) {
                return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
            }
            
            await orderModel.deleteOrderItems(id);
            const deleted = await orderModel.delete(id);

            if (deleted) {
                res.status(200).json({ message: 'Xóa đơn hàng thành công' });
            } else {
                res.status(404).json({ error: 'Xóa đơn hàng thất bại' });
            }
        } catch (error) {
            console.error('Lỗi trong controller deleteOrder:', error);
            res.status(500).json({ error: 'Lỗi xóa đơn hàng' });
        }
    }
};

module.exports = orderControllers;