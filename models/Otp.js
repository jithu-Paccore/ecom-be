const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  expiresIn:{
    type: String,
    required:true
  }
});

exports.Otp = mongoose.model("Otp", otpSchema);
exports.otpSchema = otpSchema;
