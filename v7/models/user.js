var mongoose = require("mongoose");
var passportLocalStrategy = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String
})

userSchema.plugin(passportLocalStrategy);

module.exports = mongoose.model("User", userSchema);