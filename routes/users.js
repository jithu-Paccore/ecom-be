var express = require("express");
var router = express.Router();
const { User } = require("../models/users");
const { Otp } = require("../models/Otp");
const jwt = require("jsonwebtoken");

const otplib = require("otplib");
otplib.authenticator.options = {
  step: 180,
  window: 1,
  digits: 4,
};

let SMS_FACTOR_SECRET_KEY =
  "KVKFKRCPNZQUYMLXOVYDSKVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLDQKJKZDTSRLD";

const nodemailer = require("nodemailer");
/* GET users listing. */
router.get("/", function (req, res, next) {
  return res.send("respond with a resource");
});

router.post("/sendOtp", async (req, res) => {
  User.findOne({ email: req.body.mail }).then((savedUser) => {
    if (savedUser) {
      console.log(savedUser);
      var otp = `${Math.floor(1000 + Math.random() * 9000)}`;

      Otp?.deleteMany({ userId: req.body.mail })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "soruteaser88@gmail.com", //
          pass: "gaemeqjvwsabkxoc", //
        },
      });

      var mailOptions = {
        from: "soruteaser88@gmail.com",
        to: req.body.mail,
        subject: "hiii",
        text: "here is your otp" + otp,
      };

      let otpDb = new Otp({
        userId: req.body.mail,
        otp: otp,
        createdAt: new Date(),
        expiresIn: Date.now() + 60000,
      });

      otpDb.save();

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.send({ message: "otp sent" });
    } else {
      return res.status(422).json({ error: "user doesnt exists with that" });
    }
  });
});

router.post("/sendRegisterOtp", async (req, res) => {
  var otp = `${Math.floor(1000 + Math.random() * 9000)}`;

  Otp?.deleteMany({ userId: req.body.mail })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "soruteaser88@gmail.com", //
      pass: "gaemeqjvwsabkxoc", //
    },
  });

  var mailOptions = {
    from: "soruteaser88@gmail.com",
    to: req.body.mail,
    subject: "hiii",
    text: "here is your otp" + otp,
  };

  let otpDb = new Otp({
    userId: req.body.mail,
    otp: otp,
    createdAt: new Date(),
    expiresIn: Date.now() + 60000,
  });

  otpDb.save();

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return res.send({ message: "otp sent" });
});

router.post("/verifyOtp", async (req, res) => {
  // User.findOne({ email: req.body.mail }).then((savedUser) => {
  //   console.log(savedUser.phone);
  //   const secret = SMS_FACTOR_SECRET_KEY + savedUser.phone;
  //   console.log(isValid);
  // });

  const otpRecords = await Otp.find({
    userId: req.body.mail,
  });

  const { expiresIn } = otpRecords[0];
  const dbOtp = otpRecords[0].otp;

  console.log(expiresIn);

  if (expiresIn < Date.now()) {
    Otp?.deleteMany({ userId: req.body.mail })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("otp expired , please request for another otp");
  } else {
    if (dbOtp === req.body.otp) {
      console.log("success otp verified");

      Otp?.deleteMany({ userId: req.body.mail })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("inavlid otp");
    }
  }
});

router.post("/register", async (req, res) => {
  User.findOne({ email: req.body.mail }).then(async (savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "user already exists with that phone" });
    } else {
      let user = new User({
        name: req.body.name,
        email: req.body.mail,
        phone: req.body.phone,
        age: req.body.age,
        gender: req.body.gender,
      });
      const otpRecords = await Otp.find({
        userId: req.body.mail,
      });

      const { expiresIn } = otpRecords[0];
      const reqOtp = otpRecords[0].otp;

      if (expiresIn < Date.now()) {
        Otp?.deleteMany({ userId: req.body.mail })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });

        return res.send({
          message: "otp expired , please request for another otp",
        });
      } else {
        if (req.body.otp === reqOtp) {
          user
            .save()
            .then((user) => {
              Otp?.deleteMany({ userId: req.body.mail })
                .then((result) => {
                  console.log(result);
                })
                .catch((err) => {
                  console.log(err);
                });

              return res.send({ message: "saved successfully" }).send(user);
            })
            .catch((err) => {
              console.log(err);
              return res.send({ error: err });
            });
        } else {
          return res.status(400).json({ message: "invalid otp" });
        }
      }
    }
  });

  // console.log(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.mail });
  const secret = "I-love-my-dog";
  if (!user) {
    return res.status(400).send("The user not found");
  }

  const otpRecords = await Otp.find({
    userId: req.body.mail,
  });

  const { expiresIn } = otpRecords[0];
  const reqOtp = otpRecords[0].otp;

  if (expiresIn < Date.now()) {
    Otp?.deleteMany({ userId: req.body.mail })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    return res.send({
      message: "otp expired , please request for another otp",
    });
  } else {
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
      Otp?.deleteMany({ userId: req.body.mail })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });

      return res.status(200).send({ user: user, token: token });
    } else {
      return res.status(400).send("otp is wrong!");
    }
  }
});

module.exports = router;
