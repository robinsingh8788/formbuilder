const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// generate random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// send OTP via email using nodemailer
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your gmail
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// @desc    Register new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    const otp = generateOTP();

    if (!user) {
      user = new User({ email, otp, isVerified: false });
    } else {
      user.otp = otp;
      user.isVerified = false;
    }

    await user.save();
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/users/verify
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// @desc    Forgot password - resend OTP
// @route   POST /api/users/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.isVerified = false;
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent for password reset' });
  } catch (err) {
    res.status(500).json({ message: 'Error in forgot password', error: err.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Protected
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-otp');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  forgotPassword,
  getProfile,
};
