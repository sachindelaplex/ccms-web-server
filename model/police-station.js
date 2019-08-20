var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var policeStationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  }
});

var PoliceStation = mongoose.model("PoliceStation", policeStationSchema);

module.exports = PoliceStation;
