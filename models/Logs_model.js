const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LogsSchema = new Schema({
  caller_number: {
    type: String,
  },
  state: {
    type: String,
  },
  start_time: {
    type: String,
  },
  end_time: {
    type: String,
  },
  duration: {
    type: String,
  },
  user_id: {
    type: Array,
  },
  name: {
    type: Array,
  },
  call_results: {
    type: Array,
  },
});

module.exports = Logs = mongoose.model("logs", LogsSchema);
