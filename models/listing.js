// yahan pr humlog diff diff model banayenge

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
     description : String,
    // image:{
    // // jab file upload wala feature dalo uske liya schema change karo
    // url: String,
    // filename : String,


    //     filename :{
    //         type: String,
    //         default : "listingimage",
    //     },
    //     url:{
    //     type: String,
    //     default : "https://img.freepik.com/premium-photo/serene-calming-scenery-beautiful-unsplash-images_899449-144276.jpg",
    //     // pahele se ye hoga 
    //     set:(v) =>
    //         v===""? "https://img.freepik.com/premium-photo/serene-calming-scenery-beautiful-unsplash-images_899449-144276.jpg" 
    //     :v,
    //     // set means if v is empty (there is no image) then paste this link else paste your link.
    //     // image pass nahi kiye to ye lo
    //    },
    // },
    images: [
    {
        url: String,
        filename: String,
    }
   ],

    price :Number,
    location: String,
    country: String,

    // Add review in schema  
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
},
],

// har listing ka ek owner hoga , or owner mae user.js ko point karo
  owner: {
    type: Schema.Types.ObjectId,
    ref : "User",
  },

  // category: {
  //   type:String,
  //   enum: ["mountains", "artic", "farms" , "desert"]
  // },
});

// ab uska conition likho ki jisse listing ko delete karne se sara review bhi delete ho jaye
listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing) {
    await Review.deleteMany({_id: {$in : listing.reviews}});
    // un sab review ko dleete kar do jinki id listing.review arry mae hain
    }

});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;