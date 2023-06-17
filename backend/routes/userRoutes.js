const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  setSocketId,
} = require("../controller/userController");
const { protect, upload } = require("../utils/util");

const router = express.Router();

router.route("/").get(protect, allUsers);
// router.route("/createUser").post(registerUser);
router.post("/createUser", upload.single("pic"), registerUser);

router.post("/setsocket", setSocketId);

router.post("/login", authUser);

module.exports = router;
