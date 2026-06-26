const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema  ,reviewSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js")
const {isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")

const {storage} = require("../cloudConfig.js");

const multer = require('multer')
const upload = multer({storage});
// ye humlog ko jagah batata hai ki kahan pe file ko store karna hain
// file ko directly storage mae store kar dega jo cloud ka hain

// do route jiska  link same ho usko router,route se kar do
router
   .route("/")
   .get( wrapAsync (listingController.index))
   .post(isLoggedIn, upload.array("listing[images]", 10),  validateListing, wrapAsync (listingController.createListing));

    // .post( upload.single('listing[image][url]'), (req,res) => {
    //     res.send(req.file.filename);
    //     // file related sara data store hota hai issme 
    // });

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm)


router 
   .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.array("listing[images]", 10), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyLIsting))


// Index Route
// router.get("/", wrapAsync (listingController.index));
// index function jo humlig banaye hai usko likho pure code ke jagah




// Show route.. koi bhi listing mae click akrne se uska description dikhayega
// router.get("/:id",wrapAsync(listingController.showListing))


// create route
// new route mae jaa kar form bhara ab db mae update karne ke liye ye karo
// router.post("/", isLoggedIn, validateListing, wrapAsync (listingController.createListing)
    // console.log(listing);
// );


// Edit route... koi listing ko edit karne ke loye route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm))


// Update route... koi uodation ka req aaya to listing mae bhi upadate kar do
// first check karo ki login hai ki nahi.. then check karo ki owner hai ki nahi
// router.put("/:id", isLoggedIn, isOwner, wrapAsync(listingController.updateListing));


// Delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyLIsting))

module.exports = router;