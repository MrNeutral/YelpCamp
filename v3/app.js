//REQUIREMENTS
var express 	= require("express");
	app 		= express(),
	bodyParser  = require("body-parser"),
	mongoose 	= require("mongoose"),
	Campground  = require("./models/campground"),
	Comment		= require("./models/comment"),
	seedDB		= require("./seedDB");

//CONFIGURATION
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

//ROUTES START
app.get("/", function(req, res){
	res.render("landing");
})

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, found){
		if(err){
			console.log(err);
		} else {
			res.render("index", {campgrounds: found});
		}
	})
})

app.post("/campgrounds", function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	Campground.create(newCampground, function(err, created){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
})

app.get("/campgrounds/new", function(req, res){
	res.render("new");
})

app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, found){
		if(err){
			console.log(err);
		} else {
			res.render("show", {campground: found});
		}
	})
})

app.get("/back", function(req, res){
	res.redirect("back");
})

app.get("*", function(req, res){
	res.send("Page not found.");
})
//ROUTES END

//SERVER CONFIG
app.listen(3000, function(){
	console.log("YelpCamp v3 Server has started.");
})