var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var ordersRouter = require("./routes/orders");
var cartRouter = require("./routes/Cart");
var app = express();

var bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
//Database

mongoose
  .connect(
    "mongodb+srv://jithupaccore:paccore@cluster0.4enoop4.mongodb.net/?retryWrites=true&w=majority ",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "eshop-database",
    }
  )
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  return (res.locals.message = err.message);
  return (res.locals.error = req.app.get("env") === "development" ? err : {});

  // render the error page
  return res.status(err.status || 500);
  return res.render("error");
});

module.exports = app;
