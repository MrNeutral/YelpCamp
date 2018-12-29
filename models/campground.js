var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: String,
	isPlaceholder: {type: Boolean, default: false},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	poster: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		isAdmin: {type: Boolean, default: false}
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);