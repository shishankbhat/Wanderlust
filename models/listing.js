const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ref } = require("joi");

const listingSchema = new Schema({
  title: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  image: {
      url: {
          type: String,
          default: "https://images.unsplash.com/photo-1513477967668-2aaf11838bd6?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      filename : String,
  },
  price: {
      type: Number,
      required: true,
      min: 0
  },
  location: {
      type: String,
      required: true
  },
  country: {
      type: String,
      required: true
  },
  reviews: [
      {
          type: Schema.Types.ObjectId,
          ref: "Review",
      },
  ],

  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  geometry : {
    type : {
        type : String,
        enum : ['Point'], // location type must br point
        required : true,
    },
    coordinates : {
        type : [Number],
        required : true,
    }
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;