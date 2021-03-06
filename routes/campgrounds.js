var express = require("express");
var router  = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

// INDEX - Show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds form DB
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log("ERROR");
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    })
});

// Create - Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // Get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = 
    {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, price: price, author: author};
    // Create a new campground and save to Db
    Campground.create(newCampground, function(err, newlyCreated){
       if(err) {
           console.log(err);
       } 
       else {
           // Redirect back to campgrounds page
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
    });
});

// NEW - Show form to add new campground to DB
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    // Find the campground with provided ID 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err)
        }
        else {
            console.log(foundCampground);
            // render the sow template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res)
{
    Campground.findById(req.params.id, function(err, foundCampground)
    {
        if(err)
        {
            console.log(err);
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            // Redirect somewhere (show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;