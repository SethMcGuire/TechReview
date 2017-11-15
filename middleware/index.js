var  middlewareObj = {},
     Computer = require("../models/computer"),
     Comment = require("../models/comment"),
     Phone = require("../models/phone");

middlewareObj.checkComputerOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
     Computer.findById(req.params.id, function (err, foundComputer) {
            if (err) {
                req.flash("error", "Post not found");
                res.redirect("back");
            } else {
                //Does user own computer?
                if (foundComputer.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to log in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkPhoneOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
     Phone.findById(req.params.id, function (err, foundPhone) {
            if (err) {
                req.flash("error", "Post not found");
                res.redirect("back");
            } else {
                //Does user own phone?
                if (foundPhone.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to log in to do that");
        res.redirect("back");
    }
};



middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                //Does user own comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Log in, dummy");
    res.redirect("/login");
};

module.exports = middlewareObj