var mongoose = require("mongoose");
var Campground = require("./campground");

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
	body: String,
	postedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Campground"
	}
});
/* jshint ignore:start */
// commentSchema.statics.getCampground = async function(id){
// };
/* jshint ignore:end */

module.exports = mongoose.model("Comment", commentSchema);