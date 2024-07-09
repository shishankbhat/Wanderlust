const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isReviewAuthor , validateReview} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

// Create review
router.post("/", isLoggedIn, 
    validateReview, 
    wrapAsync(reviewController.createReview)
);

// Delete review
router.post("/:reviewId", isLoggedIn ,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;