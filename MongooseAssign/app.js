var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const authroutes = require("./routes/authroutes");
const upload = require("./helper/multer");
const mongoose = require("mongoose");
const User = require("./models/authScheema.js");
const cors = require("cors");
const { checkuser, requireAuth } = require("./middleware/middleAuth");

const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

var app = express();

// view engine setup
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/mongooseAssign")
  .then((res) => console.log("connected"))
  .catch((err) => {
    console.log(err);
  });
app.get("*", checkuser);

app.post("/upload", checkuser, upload.single("image"), async (req, res) => {
  const user = await User.findOne({ _id: res.locals.user._id });

  user.filename = `public/uploads/${user.filename}`;

  await unlinkAsync(user.filename);

  const updateduser = await User.findByIdAndUpdate(
    { _id: res.locals.user._id },
    {
      filename: req.file.filename,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ msg: "successfully uploaded" });
});

app.get("/", (req, res) => res.render("home"));
app.use(authroutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
