const { Cart } = require("../models/Cart");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleWare/requireLogin");
const { route } = require("./Cart");

router.post("/addtocart", requireLogin, async (req, res) => {
  let query = [
    { itemId: req.body.itemId },
    { count: req.body.count },
    { cartBelongsTo: req.user._id },
  ];

  let jquery = [
    { itemId: req.body.itemId },
    { count : !req.body.count },
    { cartBelongsTo: req.user._id },
  ];

  var xquery = [{ itemId: req.body.itemId }, { cartBelongsTo: req.user._id }];

  let ralid = await Cart.find({
    $and: query,
  });
  let valid = await Cart.find({
    $and: jquery,
  });

  console.log("valid", valid);

  if (ralid.length > 0) {
    return res.send(
      "item already in the cart, You can add more my increasing the count"
    );
  } else if (valid.length > 0) {
    Cart.findByIdAndUpdate(
      { $and: xquery },
      {
        count: req.body.count,
      }
    )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    let cart = new Cart({
      itemId: req.body.itemId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      categoryCode: req.body.catCode,
      size: req.body.size,
      brand: req.body.brand,
      forGender: req.body.gender,
      count: req.body.count,
      sumPrice: req.body.sumPrice,
      cartBelongsTo: req.user._id,
    });

    cart = await cart.save();

    if (!cart) {
      return res.status(500).send("The cart is not updated");
    } else {
      return res.send(cart) && console.log("added cart", cart);
    }
  }
});

router.get("/getCartItems", requireLogin, async (req, res) => {
  let car = Cart;
  let cartList = [];

  if (car) {
    cartList = await Cart.find({ cartBelongsTo: req.user.id });
  }

  if (!cartList) {
    return res.status(500).send({ success: false });
  }
  return res.send(cartList);
});

router.delete("/deleteItem", requireLogin, async (req, res) => {
  let car = Cart;

  if (car) {
    Cart.findOne({ itemId: req.body.itemId }).exec((err, Cart) => {
      Cart.remove()
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
});

router.put("/increasecount", requireLogin, async (req, res) => {
  Cart.findByIdAndUpdate(req.body.itemId, {
    $inc: {
      count: 1,
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/decreasecount", requireLogin, async (req, res) => {
  Cart.findByIdAndUpdate(req.body.itemId, {
    $inc: {
      count: -1,
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
