const jwt = require("jsonwebtoken");
const JWT_SECRET = "I-love-my-dog";
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //authorization === Bearer ewefwegwrherhe
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  console.log("vayammo" , token)
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }

    const { userId } = payload;

    User.findById(userId).then((userdata) => {
      req.user = userdata;
      console.log("tttt", userdata);
      next();
    });
  });
};
