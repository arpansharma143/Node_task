const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userScheema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "please enter the fitstName"],
  },
  lastName: {
    type: String,
    required: [true, "please enter the lastName"],
  },
  email: {
    type: String,
    required: [true, "please enter the email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter the valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter the password"],
    minLength: [6, "please enter atleasr 6 character"],
  },
  filename: {
    type: String,
  },
});

userScheema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userScheema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  } else {
    throw Error("incorrect email");
  }
};

const user = mongoose.model("user", userScheema);

module.exports = user;
