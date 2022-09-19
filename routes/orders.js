const { Orders } = require("../models/orders");
const { Cart } = require("../models/orders");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleWare/requireLogin");

var today = new Date();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

router.post("/placeOrder", requireLogin, async (req, res) => {
  let order = new Orders({
    orders: req.body.orders,
    orderedBy: req.user._id,
    date: date + " " + time,
  });

  console.log("ress", req.user);
  order
    .save()
    .then((result) => {
      res.send(result);
      console.log("errorr", result);
    })
    .catch((err) => {
      res.send(err);
      console.log("error", err);
    });

  Cart.find({ orderedBy: req.user._id }).exec((err, Cart) => {
    Cart?.remove()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/getOrders", requireLogin, async (req, res) => {
  console.log("hhhh", req.user._id);
  let ord = Orders;
  let orderList = [];
  if (ord) {
    orderList = await Orders.find({ orderedBy: req.user._id });
  }

  if (!orderList) {
    return res.status(500).send({ success: false });
  }
  return res.send(orderList);
});

module.exports = router;
