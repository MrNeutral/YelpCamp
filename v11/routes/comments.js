var express = require("express"),
	Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	router = express.Router({mergeParams: true}),
	mdw 	= require("../middleware");


router.get("/new", mdw.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, found){
		if(err){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			res.render("comments/new", {campground: found});
		}
	});
});

router.post("/", mdw.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds" + req.params.id);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					req.flash("error", err.message);
					res.redirect("back");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();					
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment added");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", mdw.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds" + req.params.id);
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

router.put("/:comment_id", mdw.checkCommentOwnership, function(req, res){
	Comment.findOneAndUpdate(req.params.comment_id, req.body.comment, function(err){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/campgrounds" + req.params.id);
		} else {
			req.flash("success", "Comment updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", mdw.checkCommentOwnership, function(req, res){
	Comment.findOneAndDelete(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/campgrounds" + req.params.id);
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;