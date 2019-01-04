/* eslint-disable no-unused-vars */
//REQUIREMENTS
const express 				= require("express"),
	app 					= express(),
	dotEnv					= require("dotenv").config(),
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
	userRoutes				= require("./routes/user"),
	indexRoutes				= require("./routes/index"),
	flash 					= require("connect-flash"),
	middleware				= require("./middleware"),
	methodOverride 			= require("method-override"),
	seedDB					= require("./seedDB");
	

//CONFIGURATION
const URL = "mongodb://localhost:27017/yelp_camp";
/* jshint ignore:start */
switch(process.env.NODE_ENV){
	case("dev"):
		mongoose.connect(URL, {
			useNewUrlParser: true
		}).catch(err => console.log(err));
		break;
	case("prod"):
		mongoose.connect(process.env.DATABASE_URL, {
			useNewUrlParser: true
		}).catch(err => console.log(err));
		break;
}
/* jshint ignore:end */
mongoose.set("useFindAndModify", false);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride("_method"));
app.use(flash());
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
app.use(function (req, res, next) {
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.currentUser = req.user;
	next();
});
//ROUTES START
app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.get("*", function (req, res) {
	res.send("Page not found.");
});
//ROUTES END
// seedDB();
//SERVER CONFIG
app.listen(process.env.PORT || 3000, function () {
	console.log("YelpCamp Server has started.");
});