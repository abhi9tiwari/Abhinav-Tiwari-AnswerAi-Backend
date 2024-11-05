const express = require('express');
const authController = require('../controllers/authController');
const { identifier } = require('../middlewares/identification');
const router = express.Router();

router.post('/users', authController.signup );
router.post('/auth/login', authController.signin);
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', identifier, authController.signout);
router.get('/users/userId', authController.getUserProfileById);
router.get('/users/question/user', authController.getUserQuestions);

module.exports = () => router;