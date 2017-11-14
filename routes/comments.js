var express = require("express");
var router = express.Router();
var Computer = require("../models/computer");
var Comment = require("../models/comment");
var Phone = require('../models/phone');
var middleware = require("../middleware");

router.get("/computers/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find computer by id
    Computer.findById(req.params.id, function(err, computer){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {computer: computer});
        }
    })
})

router.post("/computers/:id/comments", middleware.isLoggedIn, function(req, res){
    //Lookup computer using ID
    Computer.findById(req.params.id, function(err, computer){
        if(err){
            console.log(err);
            res.redirect("/computers");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    computer.comments.push(comment);
                    computer.save();
                    req.flash("success", "Comment submitted!");
                    res.redirect("/computers/" + computer._id);
                }
            })
        }
    })
});

//comment edit route
router.get("/computers/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs", {computer_id: req.params.id, comment: foundComment});
        }
    })
});

//comment update route
router.put("/computers/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Successfully updated comment");
            res.redirect("/computers/" + req.params.id);
        }
    })
});

router.delete("/computers/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("error", "Comment removed");
            res.redirect("/computers/" + req.params.id);
        }
    });
});

//PHONES
router.get("/phones/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find computer by id
    Phone.findById(req.params.id, function(err, phone){
        if(err){
            console.log(err);
        } else {
            res.render("comments/newp", {phone: phone});
        }
    })
})

router.post("/phones/:id/comments", middleware.isLoggedIn, function(req, res){
    //Lookup computer using ID
    Phone.findById(req.params.id, function(err, phone){
        if(err){
            console.log(err);
            res.redirect("/phones");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    phone.comments.push(comment);
                    phone.save();
                    req.flash("success", "Comment submitted!");
                    res.redirect("/phones/" + phone._id);
                }
            })
        }
    })
});

//comment edit route
router.get("/phones/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/editp.ejs", {phone_id: req.params.id, comment: foundComment});
        }
    })
});

//comment update route
router.put("/phones/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Successfully updated comment");
            res.redirect("/phones/" + req.params.id);
        }
    })
});

router.delete("/phones/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("error", "Comment removed");
            res.redirect("/phones/" + req.params.id);
        }
    });
});


module.exports = router;