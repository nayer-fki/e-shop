const mongoose=require("mongoose");
const { Schema } = mongoose;


const wishListSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User reference
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // Product reference
        },
    ],
    updatedAt: { type: Date, default: Date.now }, // Last updated date
});

const WishList = mongoose.model("WishList", wishListSchema);
module.exports = WishList;
