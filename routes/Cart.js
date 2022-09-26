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
    { count: { $ne: req.body.count } },
    { cartBelongsTo: req.user._id },
  ];

  let valid = await Cart.find({
    $and: jquery,
  });
  var xquery = [{ itemId: req.body.itemId }, { cartBelongsTo: req.user._id }];

  let ralid = await Cart.find({
    $and: query,
  });

  console.log("valid", valid);

  if (ralid.length > 0) {
    return res.send(
      "item already in the cart, You can add more my increasing the count"
    );
  } else if (valid.length > 0) {
    console.log("count ---");
    Cart.updateOne(
      { $and: xquery },
      {
        $set: {
          count: req.body.count,
        },
      }
    )
      .then((result) => {
        return res.json(result);
      })
      .catch((err) => {
        res.send(err);
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

router.get("/getCartItemsPrice", requireLogin, async (req, res) => {
  let car = Cart;
  let cartList = [];

  if (car) {
    cartList = await Cart.find({ cartBelongsTo: req.user.id });
  }

  var sum = 0;
  cartList?.forEach((item) => {
    return (sum += item.sumPrice);
  });

  if (!cartList) {
    return res.status(500).send({ success: false });
  }
  return res.send({ subtotal: sum });
});

router.post("/deleteItem", requireLogin, async (req, res) => {
  let car = Cart;
  console.log("asdf", req.body.itemId);

  if (car.length > 0) {
    Cart.findOne({ itemId: req.body.itemId }).exec((err, Cart) => {
      Cart?.remove()
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.send(err);
        });
    });
  }
});

router.post("/deleteallcart", requireLogin, async (req, res) => {
  console.log("ggg", req.user._id);
  let car = Cart;

  if (car.length > 0) {
    Cart.deleteMany({ cartBelongsTo: req.user._id })
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        return res.send(err);
      });
  }
});

router.post("/increasecount", requireLogin, async (req, res) => {
  var increament = req.body.price;
  console.log("huiii", req.body.price);
  Cart.findByIdAndUpdate(req.body.itemId, {
    $inc: {
      count: 1,
      sumPrice: increament,
    },
  })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.send(err);
    });
});

router.post("/decreasecount", requireLogin, async (req, res) => {
  var increament = req.body.price;
  Cart.findByIdAndUpdate(req.body.itemId, {
    $inc: {
      count: -1,
      sumPrice: -increament,
    },
  })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.send(err);
    });
});

module.exports = router;
