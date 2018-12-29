var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		isAdmin: {type: Boolean, default: false}
	},
	isPlaceholder: {type: Boolean, default: false},
	body: String
});

module.exports = mongoose.model("Comment", commentSchema);