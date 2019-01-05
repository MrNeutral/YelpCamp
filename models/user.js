const mongoose = require("mongoose");
const passportLocalStrategy = require("passport-local-mongoose");
const Comment = require("./comment");
const Campground = require("./campground");

let userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: {type: String, default: "Not set"},
	birthday: {type: String, default: "Not set"},
	gender: {type: String, default: "Not set"},
	isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalStrategy);
/* jshint ignore:start */
userSchema.statics.getComments = async function(id){
	let comments;
	comments = await Comment.find({"author.id": id}).populate("postedTo");
	return comments;
};
/* jshint ignore:end */

/* jshint ignore:start */
userSchema.statics.getCampgrounds = async function(id){
	let campgrounds;
	await Campground.find({"poster.id": id}, function(err, res){
		campgrounds = res;
	});
	return campgrounds;
};
/* jshint ignore:end */
userSchema.statics.serializeUser = function() {
	return function(user, cb) {
		cb(null, user.id);
	};
};

userSchema.statics.deserializeUser = function() {
	const self = this;

	return function(id, cb) {
		self.findOne({"_id": id}, cb);
	};
};

module.exports = mongoose.model("User", userSchema);