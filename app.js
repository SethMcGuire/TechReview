var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var Computer = require("./models/computer");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var Phone = require("./models/phone");
var User = require("./models/user");
var flash = require('connect-flash');

var commentRoutes = require("./routes/comments");
var computerRoutes = require("./routes/computers");
var phoneRoutes = require("./routes/phones");
var authRoutes = require("./routes/index");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

mongoose.connect("mongodb://localhost/yelp_tech");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Passport configuration
app.use(require("express-session")({
    secret: "sessionSecret",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Checks if user is logged in to display login or logout in nabvar
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use(computerRoutes);
app.use(commentRoutes);
app.use(phoneRoutes);

app.listen(3000, function(){
    console.log("Server is running...");
});