const express = require("express");
const router  = express.Router();
const stripe  = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// ── STEP 1: Create Stripe checkout session
// POST /listings/:id/book
router.post("/:id/book", isLoggedIn, wrapAsync(async (req, res) => {
  const listing  = await Listing.findById(req.params.id);
  const { checkIn, checkOut } = req.body;

  const nights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  );
  const cleaningFee  = 500;
  const subtotal     = listing.price * nights;
  const gst          = Math.round((subtotal + cleaningFee) * 0.18);
  const totalPrice   = subtotal + cleaningFee + gst;

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: listing.title,
            description: `Check-in: ${checkIn} | Check-out: ${checkOut} | ${nights} nights`,
            images: listing.images && listing.images.length > 0
              ? [listing.images[0].url]
              : [],
          },
          unit_amount: totalPrice * 100, // paise
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${req.protocol}://${req.get("host")}/listings/${listing._id}`,
    metadata: {
      listingId: listing._id.toString(),
      guestId:   req.user._id.toString(),
      checkIn,
      checkOut,
      nights:     nights.toString(),
      totalPrice: totalPrice.toString(),
    },
  });

  res.json({ url: session.url }); // redirect to Stripe checkout page
}));

// ── STEP 2: Payment success — save booking to DB
// GET /bookings/success
router.get("/success", isLoggedIn, wrapAsync(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  if (session.payment_status === "paid") {
    const { listingId, guestId, checkIn, checkOut, nights, totalPrice } = session.metadata;

    // check if booking already saved (avoid duplicates on refresh)
    const existing = await Booking.findOne({ stripeSessionId: session.id });
    if (!existing) {
      await Booking.create({
        listing:         listingId,
        guest:           guestId,
        checkIn:         new Date(checkIn),
        checkOut:        new Date(checkOut),
        nights:          Number(nights),
        totalPrice:      Number(totalPrice),
        paymentStatus:   "paid",
        stripeSessionId: session.id,
      });
    }

    req.flash("success", "🎉 Booking confirmed! Enjoy your stay.");
    res.redirect("/bookings");
  } else {
    req.flash("error", "Payment was not successful. Please try again.");
    res.redirect("/listings");
  }
}));

// ── STEP 3: My Bookings page
// GET /bookings
router.get("/", isLoggedIn, wrapAsync(async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });
  res.render("bookings/index.ejs", { bookings });
}));

module.exports = router;