const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing:  { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  guest:    { type: Schema.Types.ObjectId, ref: "User",    required: true },
  checkIn:  { type: Date, required: true },
  checkOut: { type: Date, required: true },
  nights:   Number,
  totalPrice: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  stripeSessionId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);