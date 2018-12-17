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
// seedDB();

//ROUTES START
app.get("/", function(req, res){
	res.render("landing");
})

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, found){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: found});
		}
	})
})

app.post("/campgrounds", function(req,res){
	Campground.create(req.body.campground, function(err, created){
		if(err){
			console.log(err);
		} else {
			res.redirect("campgrounds");
		}
	});
})

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
})

app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, found){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: found});
		}
	})
})

app.get("/campgrounds/:id/comments/new", function(req, res){
 	Campground.findById(req.params.id, function(err, found){
 		if(err){
 			console.log(err);
 		} else {
		 	res.render("comments/new", {campground: found});
 		}
 	})
 })

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			})
		}
	})
})

app.get("*", function(req, res){
	res.send("Page not found.");
})
//ROUTES END

//SERVER CONFIG
app.listen(3000, function(){
	console.log("YelpCamp v5 Server has started.");
})