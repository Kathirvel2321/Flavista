import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, profileImageUrl } = req.body;
  const userExists = await User.findOne({ email });
  if(userExists) {
    res.status(400);
    throw new Error('User already exists');

  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });
  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });

}); 
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }); 
  if(user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if(user) {
    res.json(user);   
  } else {
    res.status(404);
    throw new Error('User not found');
  } 
});