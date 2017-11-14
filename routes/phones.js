var express = require("express");
var router = express.Router();
var Phone = require("../models/phone");
var middleware = require("../middleware")

//define function for search feature
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/phones", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //Get all phones from database
        Phone.find({name: regex}, function(err, allPhones){
            if(err){
                console.log(err);
            } else {
                if(allPhones.length < 1){
                    req.flash("error", "No matches found, please try again.");
                    res.redirect("/phones");
                }
                res.render("phones/index", {phones: allPhones, currentUser: req.user, page: 'phones'});
            }
        });
    } else {
        //Get all phones from database
        Phone.find({}, function(err, allPhones){
            if(err){
                console.log(err);
            } else {
                res.render("phones/index", {phones: allPhones, currentUser: req.user, page: 'phones'});
            }
        });
    }
});

router.post("/phones", middleware.isLoggedIn, function(req, res){
    //Get data from form and add new phones array
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newPhone = {name: name, price: price, image: image, description: desc, author: author}; 
   //Create a new phone and save to DB
   Phone.create(newPhone, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           req.flash("success", "Successfully posted new phone");
           res.redirect("/phones");
       }
   })
});

router.get("/phones/new", middleware.isLoggedIn, function(req, res){
    res.render("phones/new.ejs");
})

//SHOW more info about phone
router.get("/phones/:id", function(req, res){
    //find phone with provided ID
    Phone.findById(req.params.id).populate("comments").exec(function(err, foundPhone){
        if(err){
            console.log(err);
        } else {
            //render show template
            res.render("phones/show.ejs", {phone: foundPhone});
        }
    });
});

//Edit phone route
router.get("/phones/:id/edit", middleware.checkPhoneOwnership, function(req, res){
    Phone.findById(req.params.id, function(err, foundPhone){
        res.render("phones/edit", {phone: foundPhone});
    })
});


//update phone route
router.put("/phones/:id", middleware.checkPhoneOwnership, function(req, res){
    //find and update correct phone
    Phone.findByIdAndUpdate(req.params.id, req.body.phone, function(err, updatedPhone){
        if(err){
            res.redirect("/phones");
        } else{
            req.flash("success", "Successfully updated phone");
            res.redirect("/phones/" + req.params.id);
        }
    })
});

//DESTROY phone route
router.delete("/phones/:id", middleware.checkPhoneOwnership, function(req, res){
    Phone.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/phones");
        } else {
            req.flash("error", "Phone removed");
            res.redirect("/phones");
        }
    })
});



module.exports = router;