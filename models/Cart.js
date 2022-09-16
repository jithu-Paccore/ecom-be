const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  categoryCode: {
    type: String,
    default: "GENRAL",
  },
  size: {
    type: String,
    default: "REG",
  },
  brand: {
    type: String,
    default: "",
  },
  forGender: {
    type: String,
    default: "",
  },
  count: {
    type: Number,
  },
  cartBelongsTo: {
    type: String,
    ref: "User",
    require: true,
  },
  sumPrice: {
    type: Number,
  },
  itemId: {
    type: String,
    require: true,
  },
});

exports.Cart = mongoose.model("Cart", cartSchema);
exports.productSchema = this.productSchema;
