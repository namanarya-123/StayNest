const User = require("../models/user.js");


module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res,next) => {
    try {
          let {username, email, password} = req.body;
    // ek naya user banao email aur username se
   const newUser = new User ({email, username});
   const registeredUser= await User.register(newUser, password);
   console.log(registeredUser);

   // agar user signup kar liya to direct login kara do usko
   req.login(registeredUser,(err) => {
    if(err) {
        return next(err);
    }
    req.flash("success", "welcome to WanderLust!")
    res.redirect("/listings");
       })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login =async(req,res) =>{
     req.flash( "success", "Welcome back to wanderlust!");

    //  iska mtlb ki humlog jahan se login wala tap kiye the wahi pr redirect kar do. matlb ki agar add new losting se login kiye to wahin pr redirect kar do
    let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
} 


module.exports.logout = (req, res, next) =>{
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}

