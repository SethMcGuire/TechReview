var express = require("express");
var router = express.Router();
var Computer = require("../models/computer");
var middleware = require("../middleware")

router.get("/computers", function(req, res){
    //Get all computers from database
    Computer.find({}, function(err, allComputers){
        if(err){
            console.log(err);
        } else {
            res.render("computers/index", {computers: allComputers, currentUser: req.user});
        }
    });
    
});

router.post("/computers", middleware.isLoggedIn, function(req, res){
    //Get data from form and add new computers array
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newComputer = {name: name, price: price, image: image, description: desc, author: author}; 
   //Create a new computer and save to DB
   Computer.create(newComputer, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           req.flash("success", "Successfully posted new computer");
           res.redirect("/computers");
       }
   })
});

router.get("/computers/new", middleware.isLoggedIn, function(req, res){
    res.render("computers/new.ejs");
})

//SHOW more info about computer
router.get("/computers/:id", function(req, res){
    //find computer with provided ID
    Computer.findById(req.params.id).populate("comments").exec(function(err, foundComputer){
        if(err){
            console.log(err);
        } else {
            //render show template
            res.render("computers/show.ejs", {computer: foundComputer});
        }
    });
});

//Edit computer route
router.get("/computers/:id/edit", middleware.checkComputerOwnership, function(req, res){
    Computer.findById(req.params.id, function(err, foundComputer){
        res.render("computers/edit", {computer: foundComputer});
    })
});


//update computer route
router.put("/computers/:id", middleware.checkComputerOwnership, function(req, res){
    //find and update correct computer
    Computer.findByIdAndUpdate(req.params.id, req.body.computer, function(err, updatedComputer){
        if(err){
            res.redirect("/computers");
        } else{
            req.flash("success", "Successfully updated computer");
            res.redirect("/computers/" + req.params.id);
        }
    })
});

//DESTROY Computer route
router.delete("/computers/:id", middleware.checkComputerOwnership, function(req, res){
    Computer.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/computers");
        } else {
            req.flash("error", "Computer removed");
            res.redirect("/computers");
        }
    })
});


module.exports = router;