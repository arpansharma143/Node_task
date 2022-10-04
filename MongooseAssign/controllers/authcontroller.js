const User = require("../models/authScheema");
const jwt = require("jsonwebtoken");

const errHandler = (err) => {
  const errors = { email: "", password: "", firstName: "", lastName: "" };
  if (err.code === 11000) {
    errors.email = "this email already exists";
  }

  if (err.message.includes("user validation failed")) {
    console.log(Object.values(err.errors));
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message === "incorrect email") {
    errors.email = "this emial is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "this password is incorrect";
  }
  return errors;
};

// creating token

const maxAge = 3 * 24 * 60 * 60;

const creatingJwtToken = (id) => {
  return jwt.sign({ id }, "arpan secret", { expiresIn: maxAge });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.signup_post = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const { filename } = req.file;
  console.log(req.file, "files");

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      filename,
    });

    // res.locals.path = user;

    // console.log(res.locals.path ,"path");

    const token = creatingJwtToken(user._id);

    res.cookie("jwt2", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ user });
  } catch (error) {
    const errors = errHandler(error);
    console.log(errors);
    res.status(400).json({ errors });
  }
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    console.log(user);

    const token = creatingJwtToken(user._id);

    res.cookie("jwt2", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.json({ user: user._id });
  } catch (error) {
    const errors = errHandler(error);
    res.status(200).json({ errors });
  }
};
module.exports.logout_get = (req, res) => {
  res.cookie("jwt2", "", { maxAge: 1 });
  res.redirect("/");
};
