var express 	= require("express"),
	Campground  = require("../models/campground"),
	router 		= express.Router(),
	mdw 		= require("../middleware");


router.get("/", function (req, res) {
	if (req.query.search && req.query.search != "") {
		const regex = new RegExp(escapeRegex(req.query.search), "gi");
		Campground.find({ "name": regex }, function(err, found) {
			if(err) {
				console.log(err);
			} else {
				if (req.xhr) {
					if (found.length < 1) {
						res.json({campgrounds: null, flash: {type: "error",msg: "No campground found."}});
					} else {
						res.json({campgrounds: found});
					}
				} else {
					res.render("campgrounds/index", {campgrounds: found});
				}
			}
		}); 
	} else {
		Campground.find({}, function (err, found) {
			if (err) {
				console.log(err);
				req.flash("error", "Something went wrong");
				res.redirect("/");
			} else {
				res.render("campgrounds/index", {campgrounds: found});
			}
		});
	}
});

router.post("/", mdw.isLoggedIn, function (req, res) {
	Campground.create(req.body.campground, function (err, campground) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		} else {
			campground.poster.id = req.user._id;
			campground.poster.username = req.user.username;
			campground.poster.isAdmin = req.user.isAdmin;
			campground.save();
			req.flash("success", "Campground added");
			res.redirect("campgrounds");
		}
	});
});

router.get("/new", mdw.isLoggedIn, function (req, res) {
	res.render("campgrounds/new");
});

router.get("/:id", function (req, res) {
	Campground.findOne({
		"_id": req.params.id
	}).populate("comments").exec(function (err, found) {
		if (err) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show", {
				campground: found
			});
		}
	});
});

// router.get("/:id/edit", mdw.checkCampgroundOwnership, function (req, res) {
// 	Campground.findOne({
// 		"_id": req.params.id
// 	}, function (err, foundCampground) {
// 		if (err) {
// 			console.log(err);
// 			req.flash("error", "Campground not found");
// 			res.redirect("/campgrounds");
// 		} else {
// 			res.render("campgrounds/edit", {
// 				campground: foundCampground
// 			});
// 		}
// 	});
// });

router.put("/:id", mdw.checkCampgroundOwnership, function (req, res) {
	Campground.findOneAndUpdate({
		"_id": req.params.id
	}, req.body.campground, function (err) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			req.redirect("/campgrounds/" + req.params.id);
		} else {
			req.flash("success", "Campground updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", mdw.checkCampgroundOwnership, function (req, res) {
	Campground.findOneAndDelete({
		"_id": req.params.id
	}, function (err) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			req.redirect("/campgrounds/");
		} else {
			req.flash("success", "Campground deleted");
			res.redirect("/campgrounds");
		}
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;