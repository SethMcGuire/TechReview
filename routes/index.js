var express = require("express");
var router = express.Router();
var passport = require('passport');
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});


//AUTH Routes
//Show register form
router.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
        return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Nice to meet you, " + req.body.username);
            res.redirect("/computers");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate('local', {
    successRedirect: '/computers',
    failureRedirect: '/login'
  }));

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/computers");
 });


  module.exports = router;