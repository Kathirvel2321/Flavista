import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// Helper to generate token and redirect
const handleAuthCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  // Redirect to frontend login page with token
  res.redirect(`http://localhost:5173/login?token=${token}`);
};

router.post('/register', registerUser);

router.post('/login', loginUser);       

router.post('/forgot-password', forgotPassword);

router.put('/resetpassword/:resetToken', resetPassword);

router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUserProfile);

router.delete('/profile', protect, deleteUserProfile);

router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }),


  handleAuthCallback
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});




export default router;
