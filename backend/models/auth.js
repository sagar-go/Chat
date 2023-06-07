const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },

});

module.exports = mongoose.model("User", authSchema);
