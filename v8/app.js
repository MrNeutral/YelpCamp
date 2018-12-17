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
	campgroundRoutes		= require("./routes/campgrounds"),
	commentRoutes			= require("./routes/comments"),
	indexRoutes				= require("./routes/index"),
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
//ROUTES START
app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.get("*", function(req, res){
	res.send("Page not found.");
});
//ROUTES END
// seedDB();
//SERVER CONFIG
app.listen(3000, function(){
	console.log("YelpCamp v8 Server has started.");
})