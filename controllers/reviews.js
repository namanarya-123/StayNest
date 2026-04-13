const Listing = require("../models/listing");
const Review = require("../models/review")


module.exports.createReview = async(req, res)=>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);

     //  new review ka author, agar user logged in hai to, uska id ko banao
     newReview.author = req.user._id;
     listing.reviews.push(newReview);

     //  database mae review ko save karao 
     await newReview.save();
     await listing.save();

    //  console.log("new review saved");
     req.flash("success" , "New Review Created!");

     res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req,res) =>{
    let { id,reviewId} = req.params;

    // ye to delete ho gaya pr jiss aray mae add hua hai whan bhi to delete karna hoga.. to wahan delete karo
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    // here reviews is array so, reviews array se jo reviewId match ho raha hai usko puull kar lo
    
   await Review.findByIdAndDelete(reviewId);
   req.flash("success" , "Review Deleted!");
    res.redirect(`/listings/${id}`);
}