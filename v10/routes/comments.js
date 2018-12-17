var express = require("express"),
	Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	router = express.Router({mergeParams: true});


router.get("/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, found){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: found});
		}
	});
});

router.post("/", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();					
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit",checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

router.put("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findOneAndUpdate(req.params.comment_id, req.body.comment, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findOneAndDelete(req.params.comment_id, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCommentOwnership(req, res ,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, comment){
			if(comment.author.id.equals(req.user.id)){
				next();
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	} else {
		res.redirect("/login");
	}
}

module.exports = router;