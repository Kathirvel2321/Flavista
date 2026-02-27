import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

const getClientBaseUrl = () => {
  const fallback = 'http://localhost:5173';
  const configured = (process.env.CLIENT_URL || fallback).trim();

  try {
    const url = new URL(configured);
    // We always control routing path in redirects below.
    url.hash = '';
    url.search = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
};

// Helper to generate token and redirect
const handleAuthCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  const baseUrl = getClientBaseUrl();
  res.redirect(`${baseUrl}/auth-success?token=${encodeURIComponent(token)}`);
};

router.post('/register', registerUser);

router.post('/login', loginUser);       

router.post('/forgot-password', forgotPassword);

router.put('/resetpassword/:resetToken', resetPassword);

router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUserProfile);

router.delete('/profile', protect, deleteUserProfile);

router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      const baseUrl = getClientBaseUrl();
      return res.redirect(`${baseUrl}/login?error=${encodeURIComponent('Google Login Failed')}`);
    }
    req.user = user;
    handleAuthCallback(req, res);
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});




export default router;
