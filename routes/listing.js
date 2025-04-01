const express = require("express");
const router = express.Router();


const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}= require("../cloudConfig.js")
const upload = multer({storage})



router.route("/").get( wrapAsync(listingController.index))
.post( isLoggedIn,   upload.single('listing[image]'), wrapAsync(listingController.createListing));

// new route 

router.get("/new", isLoggedIn, (listingController.renderNewForm));

router.route("/:id").get( wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner, upload.single('listing[image]'), validateListing, (listingController.updateListing))
.delete( isLoggedIn, isOwner,  (listingController.destroyListing)
);

// index route
// router.get("/", wrapAsync(listingController.index));

// router.get("/new", (req, res) => {
//     res.render("listing/new.ejs");
// });



//show router

// router.get("/:id", wrapAsync(listingController.showListing));

// Create Route

// router.post("/", isLoggedIn,  validateListing, wrapAsync(listingController.createListing));

//edit Route

router.get("/:id/edit", isLoggedIn, isOwner, (listingController.rederEditForm));

// update Route
// router.put("/:id", isLoggedIn,isOwner, validateListing, (listingController.updateListing));

// Delete Route
// router.delete("/:id", isLoggedIn, isOwner,  (listingController.destroyListing)
// );

module.exports = router;
