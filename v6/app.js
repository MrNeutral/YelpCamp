//REQUIREMENTS
var express 				= require("express");
	app 					= express(),
	bodyParser  			= require("body-parser"),
	mongoose 				= require("mongoose"),
	passport				= require("passport"),
	LocalStrategy			= require("passport-local"),
	passportLocalMongoose	= require("passport-local-mongoose"),
	User 					= require("./models/user"),
	Campground  			= require("./models/campground"),
	Comment					= require("./models/comment"),
	seedDB					= require("./seedDB");

//CONFIGURATION
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
//passport config start
app.use(require("express-session")({
	secret: "Campgrounds are kinda boring",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//passport config end
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})
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

app.post("/campgrounds", isLoggedIn, function(req,res){
	Campground.create(req.body.campground, function(err, created){
		if(err){
			console.log(err);
		} else {
			res.redirect("campgrounds");
		}
	});
})

app.get("/campgrounds/new", isLoggedIn, function(req, res){
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
 	Campground.findById(req.params.id, function(err, found){
 		if(err){
 			console.log(err);
 		} else {
		 	res.render("comments/new", {campground: found});
 		}
 	})
 })

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

app.get("/login", function(req, res){
	res.render("users/login");
})

app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}))

app.get("/register", function(req, res){
	res.render("users/register");
})

app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("users/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		})
	})
})

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
})

app.get("*", function(req, res){
	res.send("Page not found.");
})
//ROUTES END

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//SERVER CONFIG
app.listen(3000, function(){
	console.log("YelpCamp v6 Server has started.");
})