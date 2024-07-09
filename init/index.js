const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// Database connection
main()
    .then(()=>{
        console.log("Connection to DB")
    })
    .catch((err)=>{
        console.log(err)
    });
    
async function main(){
    await mongoose.connect(MONGO_URL)
}

// Data Initialization

const initDB  = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((ele) => ({...ele, owner : "667eac270598c92d9f29e198"}))
    await Listing.insertMany(initData.data)
    console.log("data was saved");
}

initDB();