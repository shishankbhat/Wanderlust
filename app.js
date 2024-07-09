if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); // not use in production phase
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;
main()
    .then(()=>{
        console.log("Connection to DB")
    })
    .catch((err)=>{
        console.log(err)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    
async function main(){
    await mongoose.connect(dburl)
}
const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})
store.on("error" , ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
})
const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,  
    cookie : {
        expies : Date.now() + 7 * 24 * 60 * 60 * 1000,// 7 days expiry
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, // prevent the cross scripting attacks
    },
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // store the information of the user in session
passport.deserializeUser(User.deserializeUser()); // remove

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// routers
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/" , userRouter);


app.all("*" , (req,res,next) => {
    next(new ExpressError (404, " Page Not Found!"))
})
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(400).render("listing/error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(8000,()=>{
    console.log("Server is running")
})