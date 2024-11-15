const express = require('express');
const app = express();
const mongoose=require("mongoose");
const cors = require("cors");
const port=3000;

const categoryRouter = require("./routes/category");
const BrandRouter = require("./routes/brand");
const Brand = require('./db/brand');

app.use(cors());
app.use(express.json());
app.get("/", (req, res)=>{
    res.send("Server running");
});





//router of app
app.use("/category",categoryRouter);
app.use("/brand",BrandRouter);

async function conncetdb() {
    await mongoose.connect("mongodb://localhost:27017",{
         dbName:"e-comm-store-db"
    });
    console.log("mongodb connected");
}

conncetdb().catch((err)=>{
    console.log(err);
})


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})