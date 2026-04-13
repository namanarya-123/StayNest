// review ka isting banao

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

  const reviewSchema = new Schema ({
    comment : String,
    rating: {
        type : Number,
        min:1,
        max: 5
    },
    createdAt: {
        type: Date,
        default : Date.now,
    },
    // review authorization ke liye baad mae authoer ka field add karo
    author: {
      type : Schema.Types.ObjectId,
      ref:"User",
    }
  });

  module.exports = mongoose.model("Review", reviewSchema);