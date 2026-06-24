const cors = require("cors");
const express=require("express");
const app=express();
app.use(cors());
const pool=require("./db");

app.get("/test-db", async(req,res)=>{
    const result=await pool.query("SELECT NOW()");
    res.json(result.rows);
});

app.get("/", (req,res)=>{
    res.send("Backend running");
});

const productsRoute=require("./routes/products");
app.use("/products", productsRoute);

app.listen(3000, ()=>{
    console.log("server running");
});