const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		isAdmin: {type: Boolean, default: false}
	},
	isPlaceholder: {type: Boolean, default: false},
	body: String,
	postedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Campground"
	}
});

module.exports = mongoose.model("Comment", commentSchema);