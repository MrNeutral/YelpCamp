
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = {
	isLoggedIn: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error", "Please login first");
		res.redirect("/login");
	},
	checkCampgroundOwnership: function(req, res ,next){
		if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, campground){
				if(campground.poster.id.equals(req.user.id)){
					next();
				} else {
					req.flash("error", "You don't have permission for that.");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		} else {
			req.flash("error", "Please login first");
			res.redirect("/login");
		}
	},
	checkCommentOwnership: function(req, res ,next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, comment){
				if(comment.author.id.equals(req.user.id)){
					next();
				} else {
					req.flash("error", "You don't have permission for that.");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		} else {
			req.flash("error", "Please login first");
			res.redirect("/login");
		}
	}
};

module.exports = middleware;