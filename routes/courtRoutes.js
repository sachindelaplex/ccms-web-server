var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var CourtRecord = require("../model/courtRecords");
var PoliceSation = require("../model/police-station");
var Judge = require("../model/judge");
var Court = require("../model/court");
var VerifyToken = require("../auth/verifyToken");

// Save Courts Records
router.post("/save", VerifyToken, function(req, res, next) {
  var record = new CourtRecord({
    policestation: mongoose.Types.ObjectId(req.body.policestation),
    court: mongoose.Types.ObjectId(req.body.court),
    judge: mongoose.Types.ObjectId(req.body.judge),
    cctns_no: req.body.cctns_no,
    fir_no: req.body.fir_no,
    cc_rcc_no: req.body.cc_rcc_no,
    date_of_registration: new Date(req.body.date_of_registration),
    time_of_registration: req.body.time_of_registration,
    complaints: req.body.complaints,
    accused: req.body.accused,
    hearing_date: new Date(req.body.hearing_date),
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
    case_action_states: req.body.case_action_states,
    created : new Date()
  });

  record.save(function(err, data) {
    if (err) {
      res.status(500).json("Record save failed. " + err);
    } else {
      res.status(200).json(data);
    }
  });
});

// Fetch All Court Records
router.get("/getAll", VerifyToken, function(req, res, next) {
  CourtRecord.find({}, function(err, data) {
    if (err) {
      res.status(500).json(err);
    } else {
      if (data.length == 0) {
        res.status(200).json("No Court Records");
      } else {
        res.status(200).json(data);
      }
    }
  });
});

// Fetch Court Record by Id
router.get("/getCourt", VerifyToken, function(req, res, next) {
  CourtRecord.findById({ _id: req.query.id }, function(err, data) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  })
    .populate("policestation")
    .populate("judge")
    .populate("court");
});

// Fetch Court  Record by Search field
router.post("/filter", VerifyToken, function(req, res, next) {
  const year = req.body.hearing_date.split("-")[0];
  const month = req.body.hearing_date.split("-")[1];
  const ObjectId = mongoose.Types.ObjectId;

  if (!req.body.cctns_no && ObjectId.isValid(req.body.policestation)) {
    var query = {
      $redact: {
        $cond: [
          {
            $and: [
              { $eq: [{ $year: "$hearing_date" }, +year] },
              { $eq: [{ $month: "$hearing_date" }, +month] },
              {
                $eq: [
                  "$policestation",
                  mongoose.Types.ObjectId(req.body.policestation)
                ]
              }
            ]
          },
          "$$KEEP",
          "$$PRUNE"
        ]
      }
    };
  } else if (!ObjectId.isValid(req.body.policestation) && req.body.cctns_no) {
    var query = {
      $redact: {
        $cond: [
          {
            $and: [
              { $eq: [{ $year: "$hearing_date" }, +year] },
              { $eq: [{ $month: "$hearing_date" }, +month] },
              { $eq: ["$cctns_no", req.body.cctns_no] }
            ]
          },
          "$$KEEP",
          "$$PRUNE"
        ]
      }
    };
  } else if (req.body.cctns_no && ObjectId.isValid(req.body.policestation)) {
    var query = {
      $redact: {
        $cond: [
          {
            $and: [
              { $eq: [{ $year: "$hearing_date" }, +year] },
              { $eq: [{ $month: "$hearing_date" }, +month] },
              { $eq: ["$cctns_no", req.body.cctns_no] },
              {
                $eq: [
                  "$policestation",
                  mongoose.Types.ObjectId(req.body.policestation)
                ]
              }
            ]
          },
          "$$KEEP",
          "$$PRUNE"
        ]
      }
    };
  } else if (!req.body.cctns_no && !ObjectId.isValid(req.body.policestation)) {
    var query = {
      $redact: {
        $cond: [
          {
            $and: [
              { $eq: [{ $year: "$hearing_date" }, +year] },
              { $eq: [{ $month: "$hearing_date" }, +month] }
            ]
          },
          "$$KEEP",
          "$$PRUNE"
        ]
      }
    };
  }

  CourtRecord.aggregate([query], function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

// Update Court Record
router.put("/update", VerifyToken, function(req, res, next) {
  var conditions = {
      _id: req.body.id
    },
    options = {
      upsert: true
    };
  CourtRecord.findOneAndUpdate(conditions, req.body, options, function(
    err,
    data
  ) {
    if (err) {
      res.status(500).json("court record update failed! " + err);
    } else {
      res.status(200).json(data);
    }
  });
});

// Delete Court Record
router.delete("/delete/:id", VerifyToken, function(req, res, next) {
  CourtRecord.findByIdAndRemove({ _id: req.params.id }, function(err, data) {
    if (err) {
      res.status(500).json("Court Record Deletion fail!");
    } else {
      if (data.length == 0)
        res.status(200).json("Court Records Deletion fail!");
      else res.status(200).json("Court Record Deleted Successfully!");
    }
  });
});

// Fetch All Police station, Judge and Court List
router.get("/getRegistation", VerifyToken, async (req, res, next) => {
  try {
    const policestation = await PoliceSation.find({});
    const judge = await Judge.find({});
    const court = await Court.find({});
    res
      .status(200)
      .json({ policestation: policestation, judge: judge, court: court });
  } catch (e) {
    next(e);
  }
});

// Save Police Station Record
router.post("/savePolice", VerifyToken, function(req, res, next) {
  var station = new PoliceSation({
    name: req.body.name,
    area: req.body.area,
    contact: req.body.contact,
    city: req.body.city,
    state: req.body.state
  });
  station.save(function(err, data) {
    if (err) {
      res.status(500).json("Station save failed. " + err);
    } else {
      res.status(200).json(data);
    }
  });
});

// Fetch All Police Station Records
router.get("/getAllPoliceStation", VerifyToken, function(req, res, next) {
  PoliceSation.find({}, function(err, data) {
    if (err) {
      res.status(500).json("Police Station record failed " + err);
    } else {
      if (data.length == 0) res.status(200).json("No Police Station Records");
      else res.status(200).json(data);
    }
  });
});

// Save Judge  Record
router.post("/saveJudge", VerifyToken, function(req, res, next) {
  var judge = new Judge({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    address: req.body.address,
    age: req.body.age
  });
  judge.save(function(err, data) {
    if (err) {
      res.status(500).json("Judge save failed. " + err);
    } else {
      res.status(200).json(data);
    }
  });
});

// Save Court  Record
router.post("/saveCourt", VerifyToken, function(req, res, next) {
  var court = new Court({
    name: req.body.name,
    type: req.body.type,
    city: req.body.city
  });
  court.save(function(err, data) {
    if (err) {
      res.status(500).json("Court save failed. " + err);
    } else {
      res.status(200).json(data);
    }
  });
});

module.exports = router;
