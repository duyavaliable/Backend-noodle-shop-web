const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');// Import the database configuration
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

//Routes
const authRoutes = require('./routes/authRoutes'); // Import the authentication routes (cau hinh dang ky, dang nhap)
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productsRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); 

const PORT = process.env.PORT || 5000; // dung de nhan cac http request tu  frontend
connectDB();

const app = express();

// Middlewares
// 1. Body parser
app.use(express.json({ limit: '10kb' }));

// 2. Sanitize data - chống NoSQL injection
app.use(mongoSanitize());

// 3. Chống XSS attacks
app.use(xss());

// 4. Thiết lập các HTTP headers bảo mật
app.use(helmet());

// 5. CORS - cho phép cross-origin requests
app.use(cors());

// 6. Rate limiting - chống brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // giới hạn mỗi IP 100 requests trong 15 phút
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút!'
});
app.use('/api', limiter);


//use auth routes 
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/cart', cartRoutes);

// Xử lý lỗi
app.use(notFound);
app.use(errorHandler)


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


