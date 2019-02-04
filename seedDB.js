/* eslint-disable no-unused-vars */
const mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment");
let campSeeds = [
	{
		name: "Mammoth Cave",
		image: "https://res.cloudinary.com/yelpcamp-thanaspulaj/image/upload/v1549302936/pexels-photo-1309586.jpg",
		description: "Foresty forest. What more do you want ?",
		price: "9.5",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	},
	{
		name: "Yosemite Westlake",
		image: "https://res.cloudinary.com/yelpcamp-thanaspulaj/image/upload/v1549303018/pexels-photo-730426.jpg",
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
		image: "https://res.cloudinary.com/yelpcamp-thanaspulaj/image/upload/v1549301315/540x360.jpg",
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
		image: "https://res.cloudinary.com/yelpcamp-thanaspulaj/image/upload/v1549301414/ca11128.jpg",
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
		image: "https://res.cloudinary.com/yelpcamp-thanaspulaj/image/upload/v1549301343/stelprdb5253636.jpg",
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
		image: "https://res.cloudinary.com/yelpcamp-thanaspulaj/image/upload/v1549301096/stelprdb5259404.jpg",
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
		image: "https://res.cloudinary.com/yelpcamp-thanaspulaj/image/upload/v1549301386/lpm3c3bysv6326lbvtux.jpg",
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
		image: "https://res.cloudinary.com/yelpcamp-thanaspulaj/image/upload/v1549301262/camping-1024x768.jpg",
		description: "Lots of shady deals here.",
		price: "8",
		poster: {
			username: "Admin",
			isAdmin: true
		},
		isPlaceholder: true
	}
];
let commentSeeds = [
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
	let currentIndex = array.length, temporaryValue, randomIndex;

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
async function seedDB() {
	await Comment.deleteMany({});
	console.log("Comments Deleted");
	await Campground.deleteMany({});
	console.log("Campgrounds Deleted");
	campSeeds = shuffle(campSeeds);
	for (const campSeed of campSeeds) {
		commentSeeds = shuffle(commentSeeds);
		let campground = await Campground.create(campSeed);
		console.log("Campground created");
		for (const commentSeed of commentSeeds) {
			let comment = await Comment.create(commentSeed);
			console.log("Comment created");
			campground.comments.push(comment);
			await campground.save();
		}
	}
}
/* jshint ignore:end */


module.exports = seedDB;