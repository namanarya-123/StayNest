if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.eventNames.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
// reviews model ko require karo
 
// yahan router wale ko require karo
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// data base ko clod mae store karne ke liye likho
const dbUrl = process.env.ATLASDB_URL;



const session = require("express-session");
// const MongoStore = require("connect-mongo");
const MongoStore = require("connect-mongo").default;

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
    
}
main()
.then(() =>{
    console.log("Connected to db");
})
.catch((err) =>{
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
    // databse clod se store ho jayega
}


app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET ,
    },
    touchAfter: 23*3600,
})

store.on("error", () =>{
    console.log("Error is Mongo session store", err)
})

// session ko define karo yahn pr
const sessionOptions = {
    store,
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
};


// const store =  MongiStore


// app.use(session(sessionOptions));
// app.use(flash());
// use flash and sesion before routes i.e. listing and reviews routes.. bc 

// app.get("/testListing", async (req, res) =>{
//     let sampleListing = new Listing({
//         title:" My new listing",
//         description: "By the Goa",
//         price: 1200,
//         location:"mahuda , India",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesfull testing");
// })


// app.get("/", (req,res) =>{
//     res.send("Hi, I am root");
// });

 

app.use(session(sessionOptions));
app.use(flash());
// use flash and sesion before routes i.e. listing and reviews routes.. bc 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// middleware create karo jisse success ka msg pass karo aur next calll karo jisse jiss route mae jaa raha wo match ho jaye
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    // abhi jiss user ka session chal raha uska information
    res.locals.currUser = req.user;
    next();
})


// naya user create karo fir jisko db mae add karna hain
// app.get("/demouser", async(req,res) =>{
//     let fakeUser = new User({
//         email  : "student@gmail.com",
//         username : "delta-student",
//     });
//     // ab register method e user ko register karao

//   let registeredUser =  await User.register(fakeUser, "helloworld");
//     // user and passwor pass karo]
//     res.send(registeredUser);
// })


// this is the middleware .. it says if request comes on /listings send it to listings router
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// if our sending route does not match with any route then this page will be sent .. error page
// app.all(/.*/, (req, res, next) =>{
//    return next(new ExpressError(404, "Page not found"));
// });

 
// error handler middleware
// ye mesage show hoga pura error show nahi hoga
// app.use((err, req, res, next) =>{
//     let { statusCode = 500, message= "Somethong went wrong!" } = err;
//     res.render("listings/error.ejs", {err});

//     // res.status(statusCode).send(message);
//     // status mae statuscode save kar do aur message mae message
//     // res.send("something went wrong");
// })





app.use((err, req, res, next) => {
    console.log("🔥 ERROR STACK 🔥");
    console.error(err);   // <-- THIS IS KEY

    res.status(500).send(err.message || err);
});



app.listen(8080, () =>{
    console.log("server is listening to port 8080");
})

