var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  created: { 
    type: Date,
    default: Date.now
}
});

var User = mongoose.model("User", userSchema);
module.exports = User;
