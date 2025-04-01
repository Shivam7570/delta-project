const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuther}= require("../middleware.js")

const reviewController = require("../controllers/review.js");

 
//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuther, wrapAsync(reviewController.destroyReview));


// Reviews
//Post Reivew Route
router.post("/", validateReview, wrapAsync(reviewController.createReview));



module.exports=router;