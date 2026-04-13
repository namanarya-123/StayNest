// yahan pr authentication ka code likho

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const useController = require("../controllers/users.js")


router.route("/signup")
.get(useController.renderSignupForm)
.post( wrapAsync(useController.signup)
);



// router.get("/signup" ,useController.renderSignupForm);

// ye post request jab form submit hoag tab aayega
// router.post("/signup", wrapAsync(useController.signup)
// );


router.route("/login")
       .get( useController.renderLoginForm )
       .post(saveRedirectUrl ,passport.authenticate("local" , {failureRedirect : "/login", failureFlash: true }),
 useController.login
)

// login route banao
// router.get("/login", useController.renderLoginForm )

// router.post("/login" , saveRedirectUrl ,passport.authenticate("local" , {failureRedirect : "/login", failureFlash: true }),
//  useController.login
// )


// logout route banao
router.get("/logout" , useController.logout)

module.exports = router;




// const express = require("express");
// const router = express.Router();
// const User = require("../models/user.js");

// router.get("/signup", (req, res) => {
//     res.render("users/signup.ejs");
// });

// router.post("/signup", (req, res, next) => {
//     const { username, email, password } = req.body;

//     const user = new User({ username, email });

//     User.register(user, password, function (err) {
//         if (err) return next(err);

//         req.flash("success", "Welcome to WanderLust");
//         res.redirect("/listings");
//     });
// });

// module.exports = router;
