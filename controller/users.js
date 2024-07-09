const User = require("../models/user.js")

module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res) =>{
    try{
        let{username, email , password} = req.body;
        const newuser = new User({email, username});
        const registerUser = await User.register(newuser,password);
        // login automatically after signup
        req.login(registerUser , (err) =>{
                if(err){
                    return next(err);
                }
                req.flash("success" , "Welcome to Wanderlust");
                res.redirect("/listings");
        });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res) =>{
    req.flash("success" , "Welcome back to wanderlust!");
    // console.log(res.locals.redirectUrl)
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listings");
}

module.exports.logout = (req,res,next) =>{
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out successfully");
        res.redirect("/listings");
    })
}