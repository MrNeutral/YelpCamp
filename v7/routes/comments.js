var express = require("express"),
	Campground = require("../models/campground"),
	Comment = require("../models/campground"),
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
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;