var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var courtSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var Court = mongoose.model("Court", courtSchema);
module.exports = Court;
