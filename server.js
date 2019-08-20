var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

var bodyParser = require("body-parser");
var http = require("http");
var morgan = require("morgan");

var app = express();

var users = require('./routes/userRoutes');
var courtRecord =  require('./routes/courtRoutes');

const port = process.env.PORT || 3009;
var server = http.createServer(app).listen(port, function(req, res) {
  console.log("server is started ");
});


mongoose.connect("mongodb://localhost:27017/courtMonitoring", {
  useCreateIndex : true,
  useNewUrlParser : true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(morgan("dev")); // log every request to the console
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);
app.use(methodOverride());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/user', users);
app.use('/api/court', courtRecord);
