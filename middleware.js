const Listing = require("./models/listing"); 
const Review = require("./models/review"); 
const { listingSchema  ,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) =>{
     // agar user signup nahi hai yo usko new wala form mat do listing mae hi redirect kar do
    if(!req.isAuthenticated())
     {
        req.session.redirectUrl = req.originalUrl;
       req.flash("error", "you must be logged in to create listing!");
       return res.redirect("/login");
     }
  
    next();
    // agar user registered hota hai to next ko call kar do
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
        let { id } = req.params;

    // first find the id of the listing
    // agar uss listing ka owner currUser ka id ke eaqal nahi hai to usse edit mat karao
    // for server side protection.. postman
    // we want this code everywhere... sab jagah likhne se accha hai ki ek middlweware create kar lo jisse code assan ho jayega
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }

    // middleware hai next ko call karao nahi to struck kar jayega
    next();
}

module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
        let { id ,reviewId } = req.params;

     let review = await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of the review");
        return res.redirect(`/listings/${id}`);
     }

     // middleware hai next ko call karao nahi to struck kar jayega
    next();
}