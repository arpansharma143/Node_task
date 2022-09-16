const express = require("express");

const router = express.Router();

const usersave = require("../Controller/user/userSavePost");
const checkEmail = require("../Controller/user/checkEmail");
const upload = require("../helper/multer/multer");
const addresss = require("../Controller/user/getAdress");

router.get("/getAddress", addresss);

router.post("/checkEmail", checkEmail);

router.post("/savePost", upload.single("avtar"), usersave);

module.exports = router;
