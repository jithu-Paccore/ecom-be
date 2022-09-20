var express = require("express");
var router = express.Router();
const { User } = require("../models/users");
const jwt = require("jsonwebtoken");
/* GET users listing. */
router.get("/", function (req, res, next) {
  return res.send("respond with a resource");
});

router.post("/register", async (req, res) => {
  User.findOne({ phone: req.body.phone }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "user already exists with that phone" });
    } else {
      let user = new User({
        name: req.body.name,
        email: req.body.name,
        phone: req.body.phone,
        age: req.body.age,
        gender: req.body.gender,
      });
      var reqOtp = "1234";
      if (req.body.otp === reqOtp) {
        user
          .save()
          .then((user) => {
            return res.json({ message: "saved successfully" }).send(user);
          })
          .catch((err) => {
            console.log(err);
            return res.json({ error: err });
          });
      } else {
        return res.status(400).json({ message: "invalid otp" });
       
      }
    }
  });

  // console.log(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ phone: req.body.phone });
  const secret = "I-love-my-dog";
  if (!user) {
    return res.status(400).send("The user not found");
  }

  var reqOtp = "1234";

  if (user && req.body.otp === reqOtp) {
    const token = jwt.sign(
      {
        userName: user.name,
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    return res.status(200).send({ user: user, token: token });
  } else {
    return res.status(400).send("otp is wrong!");
  }
});

module.exports = router;
