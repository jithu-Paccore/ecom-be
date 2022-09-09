const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  categoryCode:{
    type:String,
    default:"GENRAL"
  },
  size:{
    type:String,
    default:"REG"
  },
  brand:{
    type:String,
    default:""
  },
  forGender:{
    type:String,
    default:""
  }
});

exports.Product = mongoose.model("Product", productSchema);
exports.productSchema = productSchema;
