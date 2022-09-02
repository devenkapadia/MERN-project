const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/usersData",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection Successful");
}).catch((e)=>{
    console.log(`Some error occured ${e}`); 
})
