var express = require("express");
var router = express.Router();
var User = require("../model/user");
var jwt = require("jsonwebtoken");

// Create User API
router.post("/save", function(req, res) {
  var user = new User({
    name: req.body.name,
    password: req.body.password,
    role: req.body.role
  });
  user.save(function(err, doc) {
    if (err) {
      res.end("user save failed " + err);
    } else {
      res.json(doc);
    }
  });
});

// Login API
router.post("/login", function(req, res, next) {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) {
      res.status(500).json("Login failed. " + err);
    } else {
      if (!user) {
        res.status(200).json({err : "Invalid User", status: 401});
      } else if (user.password !== req.body.password) {
        res.status(200).json({err : "Invalid Password", status: 401});
      } else {
        jwt.sign(req.body, "courtkey", (err, token) => {
          if (err) {
            res.json(err);
          } else {
            res.json({ id: user._id, token: token, role: user.role, status: 200 });
          }
        });
      }
    }
  });
});

module.exports = router;
