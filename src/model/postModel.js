const mongoose=require("mongoose");

const postModel= new mongoose.Schema({
  alumniPost:{
    type:String,
    require:true,
  },
  postDescription:{
    type:String,
    require:true
  }
})

module.exports=mongoose.model("postmodel",postModel);