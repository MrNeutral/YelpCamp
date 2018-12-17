var express = require("express"),
	User = require("../models/user"),
	passport = require("passport"),
	router = express.Router();


router.get("/", function(req, res){
	res.render("landing");
});
router.get("/login", function(req, res){
	res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}));

router.get("/register", function(req, res){
	res.render("users/register");
});

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err){
		if(err){
			console.log(err);
			return res.render("users/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});


module.exports = router;