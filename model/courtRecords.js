var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var courtRecordsSchema = new Schema({
  policestation: {
    type: Schema.Types.ObjectId,
    ref: "PoliceStation",
    required: true
  },
  court: {
    type: Schema.Types.ObjectId,
    ref: "Court",
    required: true
  },
  judge: {
    type: Schema.Types.ObjectId,
    ref: "Judge",
    required: true
  },
  cctns_no: {
    type: String,
    required: true
  },
  fir_no: {
    type: String,
    required: true
  },
  cc_rcc_no: {
    type: String,
    required: true
  },
  date_of_registration: {
    type: Date,
    required: true
  },
  time_of_registration: {
    type: Date,
    required: true
  },
  complaints: {
    type: String,
    required: true
  },
  accused: { type: Array, default: [] },
  hearing_date: {
    type: Date,
    required: true
  },
  bail: {
    type: Boolean,
    required: true
  },
  custody: {
    type: String,
    required: true
  },
  forensic: {
    type: String,
    required: true
  },
  ca_report: {
    type: String,
    required: true
  },
  dna_report: {
    type: String,
    required: true
  },
  handwriting_report: {
    type: String,
    required: true
  },
  pairani: {
    type: String,
    required: true
  },
  pp: {
    type: String,
    required: true
  },
  io: {
    type: String,
    required: true
  },
  bail_custody_status: {
    type: Boolean,
    required: true
  },
  witness: { type: String, enum: ["Police", "Public"], default: "Police" },
  panch: {
    type: String,
    enum: ["Seizure Panch", "Other Panch"],
    default: "Seizure Panch"
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var CourtRecord = mongoose.model("CourtRecord", courtRecordsSchema);
module.exports = CourtRecord;
