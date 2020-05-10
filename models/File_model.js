const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FileSchema = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  filePath: { type: String, required: true },
  uploadedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = File = mongoose.model("files", FileSchema);
