const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})
router
    .route("/")
    .get(wrapAsync(listingController.index)) // Index Route
    .post(
        isLoggedIn, 
        upload.single("listing[image][url]") ,
        validateListing, 
        wrapAsync(listingController.createListing)
    ); // Create route
    
// New listing form
router.get("/new",isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) // Show route

    .put( 
        isLoggedIn,
        isOwner,
        upload.single("listing[image][url]") ,
        validateListing, 
        wrapAsync(listingController.updateListing)
    ) // Update route
    
    .delete(
        isLoggedIn, 
        isOwner,
        wrapAsync(listingController.destroyListing)
    );  // Delete route

// Edit route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.editListing)
);


module.exports = router;