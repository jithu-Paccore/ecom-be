const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderedBy: {
    type: Object,
    ref: "User",
    require: true,
  },
  orders: {
    type: Array,
    require: true,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
});

exports.Orders = mongoose.model("Order", orderSchema);
exports.orderSchema = orderSchema;
