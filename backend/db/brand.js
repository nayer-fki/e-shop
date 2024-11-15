const mongoose=require("mongoose");
const brandSchema=new mongoose.Schema({
    name: String,
});
const Brand=mongoose.model("barnds",brandSchema);
module.exports  = Brand;