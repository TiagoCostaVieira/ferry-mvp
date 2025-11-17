const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  updatePreferences, 
  changePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (requerem autenticação)
router.use(protect); // Todas as rotas abaixo requerem autenticação

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/preferences', updatePreferences);
router.put('/password', changePassword);

module.exports = router;