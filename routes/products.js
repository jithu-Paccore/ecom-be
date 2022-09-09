const { Product } = require("../models/products");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleWare/requireLogin");

router.get("/getProduct", requireLogin, async (req, res) => {
  let prod = Product;
  let productList = [];
  if (prod) {
    productList = await Product.find();
  }

  if (!productList) {
    return res.status(500).send({ success: false });
  }
  return res.send(productList);
});

router.post("/addProduct", async (req, res) => {
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    categoryCode: req.body.catCode,
    size: req.body.size,
    brand: req.body.brand,
    forGender: req.body.gender,
  });
  product = await product.save();

  if (!product) {
    return res.status(500).send("The product cannot be created");
  } else {
    return res.send(product);
  }
});

module.exports = router;
