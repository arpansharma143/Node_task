const jwt = require("jsonwebtoken");

const User = require("../models/authScheema");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt2;
  console.log(token, "token");
  if (token) {
    jwt.verify(token, "arpan secret", (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    console.log("dkfhj");
    res.redirect("/login");
  }
};

const checkuser = (req, res, next) => {
  const token = req.cookies.jwt2;

  if (token) {
    jwt.verify(token, "arpan secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);

        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkuser };
