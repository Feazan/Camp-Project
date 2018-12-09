var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    app        = express(),
    Campground = require("./models/campgrounds"), 
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
   
// Requiring routes 
var commentRoutes      = require("./routes/comments"),
    campgroundRoutes   = require("./routes/campgrounds"),
    indexRoutes        = require("./routes/index");

// Connect to the DB
mongoose.connect("mongodb://localhost/yelp_camp_v12");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); // Seed the database


// PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: "The cake is a lie",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started!");
});



// HOW TO ADD SINGLE ITEM TO DB 
// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f2c47aa6e4b2b1_340.jpg",
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"},
//         function(err, campground) {
//             if(err){
//                 console.log("Something went wrong");
//                 console.log(err);
//             }
//             else {
//                 console.log("------NEW CAMPGROUND------");
//                 console.log(campground);
//             }
//         });