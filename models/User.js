const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  registered: {
    type: Date,
    default: Date.now,
  },
  userImage: { type: String, required: true },
});

module.exports = User = mongoose.model("users", UserSchema);
