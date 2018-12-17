var mongoose = require("mongoose");
var data 	 = [
	{
		name: "Mammoth Cave",
		image: "https://www.nps.gov/maca/planyourvisit/images/MapleSpringsCampground-Campsite.jpg",
		description: "A cave that mammoths lived in, probably."
	},
	{
		name: "Yosemite Westlake",
		image: "https://www.yosemite.com/wp-content/uploads/2016/04/westlake-campground.png",
		description: "The west lake of Yosemite I guess ?"
	},
	{
		name: "Dry River",
		image: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg",
		description: "How the fuck can there be a dry river ?!"
	},
	{
		name: "Ocean Cove",
		image: "http://www.oceancove.org/images/ca11128.jpg",
		description: "There's an ocean, what more do you want ?"
	},
	{
		name: "Hoosier National Forest",
		image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5253636.jpg",
		description: "A campground inside a forest."
	},
	{
		name: "Mustand Ridge",
		image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg",
		description: "The ridge of Mustang."
	},
	{
		name: "Bootjack Camp",
		image: "https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1462757973/campground-photos/lpm3c3bysv6326lbvtux.jpg",
		description: "Your boots are gonna get jacked."
	},
	{
		name: "Shady Brook",
		image: "https://shadybrookcg.com/wp-content/uploads/2016/02/camping-1024x768.jpg",
		description: "Lots of shady deals here."
	}
];
function seedDB(){
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		} else {
			console.log("Campgrounds Deleted");
			data.forEach(function(campground){
				Campground.create(campground, function(err, campground){
					if(err){
						console.log(err);
					} else {
						console.log("New Campground Created");
						Comment.create({
							author: "John Doe",
							body: "This place is great in a mediocre way."
						}, function(err, comment){
							if(err){
								console.log(err);
							} else {
								console.log("Comment assigned to new campground");
								campground.comments.push(comment);
								campground.save();
							}
						});
					}
				});
			});
		}
	});
}

module.exports = seedDB;