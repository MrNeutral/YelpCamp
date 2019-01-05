/* eslint-disable no-unused-vars */
const express 	= require("express"),
	User 		= require("../models/user"),
	passport 	= require("passport"),
	router 		= express.Router(),
	mdw  		= require("../middleware"),
	dotEnv		= require("dotenv").config(),
	Comment  	= require("../models/comment");


router.get("/", function (req, res) {
	res.render("landing");
});
router.get("/login", function (req, res) {
	res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	successFlash: "Login successful",
	failureRedirect: "/login",
	failureFlash: true
}));

router.get("/register", function (req, res) {
	res.render("users/register");
});

router.post("/register", function (req, res) {
	const newUser = {
		username: req.body.username
	};
	if (req.body.adminAuth == process.env.ADMIN_CODE) {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Welcome to YelpCamp, " + req.body.username);
			res.redirect("/campgrounds");
		});
	});
});

router.get("/logout", function (req, res) {
	req.logout();
	req.flash("success", "Logout successful");
	res.redirect("/campgrounds");
});


module.exports = router;