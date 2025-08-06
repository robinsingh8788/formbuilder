const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiry: { type: Date }, // ⬅️ Add this line
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
