const jwt_decode = require("jwt-decode");

const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

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

module.exports = { jwtDecode, roles, generateToken, protect };
