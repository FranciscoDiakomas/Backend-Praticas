const express = require("express")
const app = express()

app.get("/",(req , res)=>{
    res.send("ola mundo")
})
app.listen(8000,()=>{
    console.log("App runing")
})