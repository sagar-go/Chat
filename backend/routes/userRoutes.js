const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controller/userController");
const { protect } = require("../utils/util");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/createUser").post(registerUser);
router.post("/login", authUser);

module.exports = router;