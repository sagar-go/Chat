const jwt_decode = require("jwt-decode");

const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const multer = require("multer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const jwtDecode = (token) => {
  let decoded = jwt_decode(token);
  return decoded;
};

const roles = {
  teamLead: "teamLead",
  dev: "dev",
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).send("Not authorized, token failed");
    }
  }

  if (!token) {
    return res.status(401).send("Not authorized, token failed");
  }
};

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

let mydata;
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
      const name = file.originalname;
      cb(null, `${new Date().getTime()}-${name}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error("file is not allowed"));
    }
    cb(null, file);
  },
});

module.exports = { jwtDecode, roles, generateToken, protect, upload };
