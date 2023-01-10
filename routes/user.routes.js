const router = require('express').Router();
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')

router.post('/register', authController.registerUser);
router.post('/login', authController.signIn);
router.get('/search', userController.allUsers);
module.exports = router;

  