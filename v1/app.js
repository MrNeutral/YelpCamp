//REQUIREMENTS
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

//CONFIGURATION
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
	{name: "Mammoth Cave", image: "https://www.nps.gov/maca/planyourvisit/images/MapleSpringsCampground-Campsite.jpg"},
	{name: "Yosemite Westlake", image: "https://www.yosemite.com/wp-content/uploads/2016/04/westlake-campground.png"},
	{name: "Dry River", image: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"},
	{name: "Dry River", image: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"},
	{name: "Dry River", image: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"},
	{name: "Dry River", image: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"},
	{name: "Dry River", image: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"},
	{name: "Dry River", image: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"}
]

//ROUTES START
app.get("/", function(req, res){
	res.render("landing");
})

app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds: campgrounds});
})

app.post("/campgrounds", function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function(req, res){
	res.render("new");
})

app.get("/back", function(req, res){
	res.redirect("back");
})
//ROUTES END

//SERVER CONFIG
app.listen(3000, function(){
	console.log("YelpCamp v1 Server has started.");
})