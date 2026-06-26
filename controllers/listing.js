// yahan pr controlling ka code likho
const Listing = require("../models/listing");
const { listingSchema  ,reviewSchema } = require("../schema.js");


module.exports.index = async (req, res) =>{
        // Listing.find({}).then((res) =>{
        //     console.log(res);
        // });
        // isse jitna bhi data hain wo terminal mae print ho jayega
        const allListings = await Listing.find({});
        // console.log(allListings);
        res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs")
    // new listing banane se phele check karo ki humara user phele se login hai ki nahi?
}

module.exports.showListing = async(req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path :"reviews", populate: {path: "author" },
    }).populate("owner");
    // req.params se id nikal liye... findById se uss lsting ka sra information nikal liye aur usko listing mae store kar diye

    // agar listing exist nahi karta to ye flash show hoga
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist!")
        // agar lisiting exist nahi karti to show pr kyu hi jatega .. direct lsiting mae hi chal jao
       return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next)=>{
    // agar req.body hi nahi hoga too error aayega to usko handle karo 
    // if(!req.body.listing)
    // {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }


    // joi ka execution ... if anyfield is missing then it will show us error
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if result has error then we are calling the express error
    // if(result.error)
    // {
    //     throw new ExpressError(404, result.error);
    // }

    let images = req.files.map(f => ({
    url: f.path,
    filename: f.filename
    }));
    // console.log(url, "..", filename);

    // console.log(req.body);
    // let listing= req.body.listing;
    // req.body.listing se jitna bhi data aa raha usko estract karo
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    newListing.images = images;
    await newListing.save();

    // flash messgae agar listing add hua to ye print hoga
    req.flash("success" , "New Listing Created!");

    res.redirect("/listings");
    };


module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
     // agar listing exist nahi karta to ye flash show hoga
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist!")
        // agar lisiting exist nahi karti to show pr kyu hi jatega .. direct lsiting mae hi chal jao
       return res.redirect("/listings");
    }

    // let originalImageUrl = listing.image.url;
    // originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    // url vchange karo jisse jo humlog ko edit form mae image bana rahe wo kam quality ka bane
    res.render("listings/edit.ejs", {listing});
    // originalImageUrl ko parse kar do 
}

module.exports.updateListing = async (req,res) =>{
    let { id } = req.params;

    // first find the id of the listing
    // agar uss listing ka owner currUser ka id ke eaqal nahi hai to usse edit mat karao
    // for server side protection.. postman
    // we want this code everywhere... sab jagah likhne se accha hai ki ek middlweware create kar lo jisse code assan ho jayega
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error", "You dont have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    // do this in two part first do find by id and then do update
    let listing = await Listing.findByIdAndUpdate(
        id, 
        req.body.listing,
        {
            runValidators : true,
            new: true,
        }
    );
    // await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // req.body.listng ko dereference karo
  
    // ye code jab file upload kar rahe tab likhe hain
    if(req.files && req.files.length > 0) {
    let newImages = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    listing.images.push(...newImages);
    await listing.save();
    } 
    //  agar req.file exist karta hain tab hi ye code execute karo

    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyLIsting = async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
}