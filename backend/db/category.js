const mongoose=require("mongoose");
const categorySchema=new mongoose.Schema({
    name: String,
});
const Categoy=mongoose.model("categories",categorySchema);
module.exports  = Categoy;