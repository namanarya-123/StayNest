// issme sara code likho  reviews ka
const express = require("express");
const router = express.Router({ mergeParams: true });
// with the help of { mergeParams: true } parent router ke url child route se merge ho jaata hain
// means assa id nahi aa raha tha app.js mae hi ruk jaa raha tha .. but with ke use of these.. id mil jata hain

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
// reviews model ko require karo
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{isLoggedIn,validateReview , isReviewAuthor} = require("../middleware.js")


// router mae common part nikalna hota hai to yahan  /listings/:id/reviews e common art hai isko naikal klo 
// reviews ke liye route banao

const reviewController = require("../controllers/reviews.js")

// dekjo humlog frontend ko protect kar liye the jisse koi review nahi bhej sake
// but ab backend ko protect karo kisse koi backend se bhi review nahi bhej sake
// wo route se hi hota hain
// is logged in implemenet karo
router.post("/" ,isLoggedIn, validateReview , wrapAsync(reviewController.createReview));


// delete route
// post ka review delete karna ho to uske liye route hain
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports= router;



