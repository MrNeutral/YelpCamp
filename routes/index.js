/* eslint-disable no-unused-vars */
var express 	= require("express"),
	User 		= require("../models/user"),
	passport 	= require("passport"),
	router 		= express.Router(),
	mdw  		= require("../middleware"),
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
	var newUser = {
		username: req.body.username
	};
	if (req.body.adminAuth == process.env.ADMIN_CODE || (!process.env.ADMIN_CODE && req.body.adminAuth == "admincode")) {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			return res.render("users/register");
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
/* jshint ignore:start */
router.get("/user/:user_id", mdw.isUser, function(req, res){
	User.findOne({"_id": req.params.user_id}, async function(err, user){
		user.comments = await User.getComments(req.params.user_id);
		user.campgrounds = await User.getCampgrounds(req.params.user_id);
		let counter = 0;
		let intervalId = setInterval(async function(){
			if(counter >=10){
				clearInterval(intervalId);
				res.render("users/show", {user});
			}
			counter++;
			if(!user.campgrounds){
				user.campgrounds = await User.getCampgrounds(req.params.user_id);
			}
			if(!user.comments){
				user.comments = await User.getComments(req.params.user_id);
			}
			if(user.campgrounds && user.comments){
				clearInterval(intervalId);
				res.render("users/show", {user});
			}
		}, 500);
	});
});
/* jshint ignore:end */


module.exports = router;