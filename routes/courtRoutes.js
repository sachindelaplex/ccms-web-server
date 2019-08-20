var express = require("express");
var async = require("async");
var router = express.Router();
var CourtRecord = require("../model/courtRecords");
var PoliceSation = require("../model/police-station");
var Judge = require("../model/judge");
var Court = require("../model/court");
var VerifyToken = require("../auth/verifyToken");

router.post("/save", VerifyToken, function(req, res, next) {
  var record = new CourtRecord({
    policestation: req.body.policestation,
    court: req.body.court,
    judge: req.body.judge,
    cctns_no: req.body.cctns_no,
    fir_no: req.body.fir_no,
    cc_rcc_no: req.body.cc_rcc_no,
    date_of_registration: new Date(),
    time_of_registration: new Date(),
    complaints: req.body.complaints,
    accused: req.body.accused,
    hearing_date: new Date(),
    bail: req.body.bail,
    custody: req.body.custody,
    forensic: req.body.forensic,
    ca_report: req.body.ca_report,
    dna_report: req.body.dna_report,
    handwriting_report: req.body.handwriting_report,
    pairani: req.body.pairani,
    pp: req.body.pp,
    io: req.body.io,
    bail_custody_status: req.body.bail_custody_status,
    witness: req.body.witness,
    panch: req.body.panch
  });
  record.save(function(err, data) {
    if (err) {
      res.sendStatus(500).end("Record save failed " + err);
    } else {
      res.json(data);
    }
  });
});

router.get("/getAll", VerifyToken, function(req, res, next) {
  CourtRecord.find({}, function(err, data) {
    if (err) {
      res.json(err);
    } else {
      if (data.length == 0) {
        res.json("No Court Records");
      } else {
        res.json(data);
      }
    }
  });
});

router.put("/update", VerifyToken, function(req, res, next) {
  var conditions = {
      _id: req.body._id
    },
    options = {
      upsert: true
    };
  CourtRecord.findOneAndUpdate(conditions, req.body, options, function(
    err,
    data
  ) {
    if (err) {
      res.status(500).end("court record update failed! " + err);
    } else {
      res.json(data);
    }
  });
});

router.delete("/delete/:id", VerifyToken, function(req, res, next) {
  console.log(req.params.id);
  CourtRecord.findByIdAndRemove({ _id: req.params.id }, function(err, data) {
    if (err) {
      res.status(500).end("Court Record Deletion fail!");
    } else {
      if (data.length == 0) res.json("Court Records Deletion fail!");
      else res.json("Court Record Deleted Successfully!");
    }
  });
});

router.get("/getRegistation", async (req, res, next) => {
  try {
    const policestation = await PoliceSation.find({});
    const judge = await Judge.find({});
    const court = await Court.find({});
    res.json({ policestation: policestation, judge: judge, court: court });
  } catch (e) {
    next(e);
  }
});


router.post("/savePolice", function(req, res, next) {
  var station = new PoliceSation({
    name: req.body.name,
    area: req.body.area,
    contact: req.body.contact,
    city: req.body.city,
    state: req.body.state
  });
  station.save(function(err, data) {
    if (err) {
      res.sendStatus(500).end("Station save failed " + err);
    } else {
      res.json(data);
    }
  });
});

router.post("/saveJudge", function(req, res, next) {
  var judge = new Judge({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    address: req.body.address,
    age: req.body.age
  });
  judge.save(function(err, data) {
    if (err) {
      res.sendStatus(500).end("Judge save failed " + err);
    } else {
      res.json(data);
    }
  });
});

router.post("/saveCourt", function(req, res, next) {
  var court = new Court({
    name: req.body.name,
    type: req.body.type,
    city: req.body.city
  });
  court.save(function(err, data) {
    if (err) {
      res.sendStatus(500).end("Court save failed " + err);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
