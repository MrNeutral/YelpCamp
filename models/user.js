var mongoose = require("mongoose");
var passportLocalStrategy = require("passport-local-mongoose");
var Comment = require("./comment");
var Campground = require("./campground");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
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


module.exports = mongoose.model("User", userSchema);