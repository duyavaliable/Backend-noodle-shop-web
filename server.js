const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Import the database configuration
const authRoutes = require('./routes/authRoutes'); // Import the authentication routes (cau hinh dang ky, dang nhap)
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productsRoutes');
const orderRoutes = require('./routes/orderRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000; // dung de nhan cac http request tu  frontend

// Middlewares ??
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
db.testConnection();

//use auth routes 
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


