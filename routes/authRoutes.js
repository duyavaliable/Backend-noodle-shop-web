const express = require('express');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

// Đăng nhập
router.post('/login', authControllers.login);

// Đăng ký
router.post('/SignUp/user', authControllers.SignUpUser);
// Đăng ký quản trị viên
router.post('/SignUp/admin', authControllers.SignUpAdmin);
// Đăng ký nhân viên
router.post('/SignUp/staff', authControllers.SignUpStaff);

module.exports = router;