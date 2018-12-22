var mongoose = require("mongoose");
var passportLocalStrategy = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalStrategy);

module.exports = mongoose.model("User", userSchema);