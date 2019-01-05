const express 	= require("express"),
	User 		= require("../models/user"),
	router 		= express.Router(),
	// eslint-disable-next-line no-unused-vars
	dotEnv		= require("dotenv").config(),
	mdw  		= require("../middleware");

/* jshint ignore:start */
router.get("/:user_id", mdw.isUser, function(req, res){
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
router.put("/:user_id", mdw.isUser, function(req, res){
	User.findOneAndUpdate({"_id": req.params.user_id}, req.body.user, function(err){
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/user/" + req.params.user_id);
		} else {
			req.flash("success", "User data updated");
			res.redirect("/user/" + req.params.user_id);
		}
	});
});

router.put("/:user_id/password", mdw.isUser, function(req, res){
	User.findOne({"_id": req.params.user_id}, function(err, user){
		user.setPassword(req.body.password, function(err, user){
			if (err) {
				console.log(err);
				req.flash("error", err.message);
				res.redirect("/user/" + req.params.user_id);
			} else {
				user.save();
				req.flash("success", "Password updated");
				res.redirect("/user/" + req.params.user_id);
			}
		});
	});
});

router.post("/:user_id/admin", mdw.isUser, function(req, res){
	User.findOne({"_id": req.params.user_id}, function(err, user){
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/user/" + req.params.user_id);
		} else {
			if (req.body.adminAuth == process.env.ADMIN_CODE) {
				user.isAdmin = true;
				user.save();
				req.flash("success", "Admin status granted");
				res.redirect("/user/" + req.params.user_id);
			} else {
				req.flash("error", "Incorrect code");
				res.redirect("/user/" + req.params.user_id);
			}
		}
	});
});

router.put("/:user_id/admin", mdw.isUser, function(req, res){
	User.findOne({"_id": req.params.user_id}, function(err, user){
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/user/" + req.params.user_id);
		} else {
			user.isAdmin = false;
			user.save();
			req.flash("success", "Admin status revoked");
			res.redirect("/user/" + req.params.user_id);
		}
	}
	);
});

router.delete("/:user_id", mdw.isUser, function(req, res){
	User.findOneAndDelete({"_id": req.params.user_id}, function(err){
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/user/" + req.params.user_id);
		} else {
			req.flash("success", "Account deleted");
			res.redirect("/campgrounds");
		}
	}
	);
});


module.exports = router;