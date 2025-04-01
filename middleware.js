const Listing = require("./models/listing");
const Review = require("./models/reviews");

const { listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn =(req, res, next)=>{
      
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        // console.log(  req.session.redirectUrl);
        req.flash("error", "you must be logged in to create listing !");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next()
}

// module.exports.validateListing = (req, res, next) => {
//     console.log("Request Body:", req.body);
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new Error(errMsg);
//     } else {
//         next();
//     }
// };

module.exports.validateListing = (req, res, next) => {
    console.log("Request Body:", req.body);

    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        return res.status(400).json({ error: errMsg }); // Send a 400 Bad Request
    } else {
        next();
    }
};
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new Error(errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuther = async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.auther.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the auther of this review");
        return res.redirect(`/listing/${id}`);
    }
    next()
};
