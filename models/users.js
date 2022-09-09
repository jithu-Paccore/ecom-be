const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    default: "",
  },
  Age: {
    type: String,
    default: "",
  },
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
