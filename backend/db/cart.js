const mongoose=require("mongoose");
const wishListSchema=new mongoose.Schema({
    userId:{ type: Schema.Types.ObjectId, ref: 'users' },
    productsId: Array(String)

});
const wishList=mongoose.model("wishLists",wishListSchema);
module.exports  = wishList;
