var express = require("express");
var router = express.Router();
var User = require("../model/user");
var jwt = require("jsonwebtoken");
var VerifyToken = require("../auth/verifyToken");

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

router.post("/login", function(req, res, next) {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) {
      res.status(500).json("Login failed. " + err)
    } else {
      if (!user) {
        res.status(401).send("Invalid User");
      } else if (user.password !== req.body.password) {
        res.status(401).send("Invalid password");
      } else {
        jwt.sign(req.body, "courtkey", (err, token) => {
          if (err) {
            res.json(err);
          } else {
            res.json({ id: user._id, token: token });
          }
        });
      }
    }
  });
});


// function verifyToken(req, res, next) {
//   const bearerHeader = req.headers["authorization"];
//   if (typeof bearerHeader !== "undefined") {
//     const bearer = bearerHeader.split(" ");
//     const bearerToken = bearer[1];
//     req.token = bearerToken;
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// }

module.exports = router;
