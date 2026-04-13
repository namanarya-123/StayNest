const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};

app.use (session(sessionOptions));
app.use(flash());

app.get("/register", (req,res) =>{
    let { name= "naman"} = req.query;
    req.session.name = name;
    if(name === "naman")
    {
        req.flash("error" , "error : user  not registered secessfully");
    }
    else{
       req.flash("success" , "user registered secessfully");
    }
    
    res.redirect("/hello");
});

app.get("/hello", (req,res) =>{
    res.locals.successmsg = req.flash("success"); 
    res.locals.errormsg = req.flash("error"); 
    res.render("page.ejs", {name: req.session.name , msg: req.flash("success")});
})

app.get("/", (req,res)=>{
    res.send(`Apna college`);
})

app.listen(3000, () =>{
    console.log("server is listening to port 3000");
})