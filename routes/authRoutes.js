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
//chinh sua thong tin user
router.put('/update/:id', authControllers.updateUser);
//lay thong tin user
router.get('/user/:id', authControllers.getUserInfo);

module.exports = router;