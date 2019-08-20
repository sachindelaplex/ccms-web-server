var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var judgeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var Judge = mongoose.model("Judge", judgeSchema);

module.exports = Judge;
