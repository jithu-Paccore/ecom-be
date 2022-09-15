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

router.get("/getFilterProduct", requireLogin, async (req, res) => {
  let query = [];
  let gender = req.body.gender;
  let categoryCode = req.body.categoryCode;
  let size = req.body.size;
  let brand = req.body.brand;
  if (gender.length > 0) {
    query.push({ forGender: [gender, "MF"] });
  }
  if (categoryCode.length > 0) {
    query.push({ categoryCode: categoryCode });
  }
  if (size.length > 0) {
    query.push({ size: size });
  }
  if (brand.length > 0) {
    query.push({ brand: brand });
  }
  console.log("query", query);
  let prod = Product;
  let productList = [];
  if (prod) {
    productList = await Product.find({
      $and: query,
    });
  }

  if (!productList) {
    m;
    return res.status(500).send({ success: false });
  }
  return res.send(productList);
  console.log(productList.length);
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
