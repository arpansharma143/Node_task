const express = require("express");
const {
  login_get,
  signup_get,
  login_post,
  logout_get,
  signup_post,
} = require("../controllers/authcontroller");
const upload = require("../helper/multer");

const router = express.Router();



router.get("/login", login_get);
router.post("/login", login_post);
router.get("/signup", signup_get);
router.post("/signup", upload.single("image1"), signup_post);
router.get("/logout", logout_get);

module.exports = router;
