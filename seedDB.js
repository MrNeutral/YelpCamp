/* eslint-disable no-unused-vars */
const mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment");
var campSeeds 	 = [
	{
		name: "Mammoth Cave",
		image: "https://www.nps.gov/maca/planyourvisit/images/MapleSpringsCampground-Campsite.jpg",
		description: "A cave that mammoths lived in, probably.",
		price: "9.5",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	},
	{
		name: "Yosemite Westlake",
		image: "https://www.yosemite.com/wp-content/uploads/2016/04/westlake-campground.png",
		description: "The west lake of Yosemite I guess ?",
		price: "9.5",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	},
	{
		name: "Dry River",
		image: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg",
		description: "How the fuck can there be a dry river ?!",
		price: "9.5",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	},
	{
		name: "Ocean Cove",
		image: "http://www.oceancove.org/images/ca11128.jpg",
		description: "There's an ocean, what more do you want ?",
		price: "8",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	},
	{
		name: "Hoosier National Forest",
		image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5253636.jpg",
		description: "A campground inside a forest.",
		price: "10",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	},
	{
		name: "Mustand Ridge",
		image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg",
		description: "The ridge of Mustang.",
		price: "9",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	},
	{
		name: "Bootjack Camp",
		image: "https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1462757973/campground-photos/lpm3c3bysv6326lbvtux.jpg",
		description: "Your boots are gonna get jacked.",
		price: "9",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	},
	{
		name: "Shady Brook",
		image: "https://shadybrookcg.com/wp-content/uploads/2016/02/camping-1024x768.jpg",
		description: "Lots of shady deals here.",
		price: "8",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	}
];
var commentSeeds = [
	{
		author: {
			username: "John Doe"
		},
		body: "This place is great in a mediocre way.",
		isPlaceholder: true
	},
	{
		author: {
			username: "Jane Doe"
		},
		body: "This place is mediocre in a great way.",
		isPlaceholder: true
	},
	{
		author: {
			username: "Boby Bob"
		},
		body: "This place is boring.",
		isPlaceholder: true
	},
	{
		author: {
			username: "Destitute Rick"
		},
		body: "This place is above my pay-grade.",
		isPlaceholder: true
	},
	{
		author: {
			username: "Jerry Jim"
		},
		body: "This place is just great.",
		isPlaceholder: true
	}
];

//taken from StackOverflow
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
/* jshint ignore:start */
async function seedDB(){
	await Comment.deleteMany({});
	console.log("Comments Deleted");
	await Campground.deleteMany({});
	console.log("Campgrounds Deleted");
	campSeeds = shuffle(campSeeds);
	for (const campSeed of campSeeds){
		commentSeeds = shuffle(commentSeeds);
		let campground = await Campground.create(campSeed);
		console.log("Campground created");
		for (const commentSeed of commentSeeds){
			let comment = await Comment.create(commentSeed);
			console.log("Comment created");
			campground.comments.push(comment);
			await campground.save();
		}
	}
}
/* jshint ignore:end */


module.exports = seedDB;