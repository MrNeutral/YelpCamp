var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	author: String,
	body: String
})

module.exports = mongoose.model("Comment", commentSchema);