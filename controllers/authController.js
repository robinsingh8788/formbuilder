const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ========== EMAIL CONFIG ==========
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // App Password from Google
  },
});

const sendEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP for Login',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

// ========== SEND OTP ==========
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 mins

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email, otp, otpExpiry: expiry });
  } else {
    user.otp = otp;
    user.otpExpiry = expiry;
    user.isVerified = false; // reset
  }

  await user.save();

  try {
    await sendEmail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending email' });
  }
};

// ========== VERIFY OTP ==========
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });
  if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
  if (user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired' });

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: 'OTP verified successfully' });
};

// ========== LOGIN ==========
exports.loginAfterOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    return res.status(401).json({ message: 'OTP not verified or user not found' });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );

  user.isVerified = false; // reset after login
  await user.save();

  res.json({ token, message: 'Login successful' });
};
