var express = require("express"),
	Campground = require("../models/campground"),
	router = express.Router();


router.get("/", function(req, res){
	Campground.find({}, function(err, found){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: found});
		}
	});
});

router.post("/", isLoggedIn, function(req,res){
	Campground.create(req.body.campground, function(err, campground){
		if(err){
			console.log(err);
		} else {
			campground.poster.id = req.user._id;
			campground.poster.username = req.user.username;
			campground.save();
			res.redirect("campgrounds");
		}
	});
});

router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, found){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: found});
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