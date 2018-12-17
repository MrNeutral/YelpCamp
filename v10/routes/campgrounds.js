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

router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

router.put("/:id", checkCampgroundOwnership, function(req, res){
	Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/delete", checkCampgroundOwnership, function(req, res){
	Campground.findOneAndDelete(req.params.id, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("back");
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res ,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, campground){
			if(campground.poster.id.equals(req.user.id)){
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