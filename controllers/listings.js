const { model } = require("mongoose");
const Listing = require("../models/listing")
module.exports.index= async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listing/new.ejs")
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate({path:"reviews", populate:{ path:"auther"},}).populate("owner");
    if(!listings){
        req.flash("error", "Listing  you requested for does not exist!");
        console.log("listing not define")
        
        return res.redirect("/listing");
    }
    console.log(listings);
    res.render("listing/show.ejs", { listings });
}

module.exports.createListing = async (req, res) => {
   let url =  req.file.path;
   let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner =req.user._id;
    newlisting.image = {url, filename}
    await newlisting.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listing");
}

module.exports.rederEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing Edited!");
    if(!listing){
        req.flash("error", "Listing  you requested for does not exist!");
        console.log("listing not define")
        console.log(listing);
        
        return res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listing/edit.ejs", { listing , originalImageUrl});
}

module.exports.updateListing =async (req, res) => {
    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if( typeof req.file !== "undefined"){
    let url =  req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated !");

    res.redirect(`/listing/${id}`);
}
module.exports.destroyListing= async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");

    res.redirect("/listing");
};