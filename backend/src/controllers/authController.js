import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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
  if(user && user.password && (await bcrypt.compare(password, user.password))) {
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

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const googleAuthCallback = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User with this email does not exist');
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password.</p>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully" });
});