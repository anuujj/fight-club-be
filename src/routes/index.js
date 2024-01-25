const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const exampleController = require('../controllers/exampleController');

router.get('/examples', exampleController.getAllExamples);
router.post('/examples', exampleController.createExample);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/checkUsername', authController.checkUsername);
router.get('/verify/:token', authController.verifyEmail);

module.exports = router;
