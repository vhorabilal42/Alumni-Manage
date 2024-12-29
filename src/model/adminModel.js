const  mongoose=require("mongoose");

const adminSchema=new mongoose.Schema({
  adminName:{
    type:String,
    require:true,
  },
  email:{
    type:String,
    require:true
  },
  password:{
    type:String,
    require:true
  },
  role: {
    type: String,
    enum: ["Admin", "Sub-Admin"],
  },
})

const adminModel=mongoose.model("adminmodel",adminSchema)

module.exports=adminModel