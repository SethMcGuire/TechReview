var express = require("express")
     app = express(),
     bodyParser = require("body-parser"),
     mongoose = require('mongoose'),
     passport = require('passport'),
     LocalStrategy = require('passport-local'),
     methodOverride = require('method-override'),
     Computer = require("./models/computer"),
     seedDB = require("./seeds"),
     Phone = require("./models/phone"),
     User = require("./models/user"),
     flash = require('connect-flash');

var  commentRoutes = require("./routes/comments"),
     computerRoutes = require("./routes/computers"),
     phoneRoutes = require("./routes/phones"),
     authRoutes = require("./routes/index");
app.use(methodOverride("_method"));
app.use(flash());

var Comment = require("./models/comment")

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