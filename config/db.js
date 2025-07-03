const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Chuyển đổi pool sang dạng promise để có thể sử dụng async/await
const promisePool = pool.promise();

//kiem tra ket noi toi database
const testConnection = async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};

module.exports = {
    pool: promisePool,
    testConnection
};
