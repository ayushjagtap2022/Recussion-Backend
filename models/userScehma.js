const mongoose = require('mongoose');
 require('dotenv').config()
  let User =new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },email:{
   type:String,
   required:true,
   unique:true,
   },password:{
    type:String,
    required:true,
   },
   roles:{
    type:String,
    required:true,
    enum:["NORMAL","ADMIN","MODERATOR"] ,
    default:"NORMAL"
   }
},{
    versionKey: false,
    timestamps: true
})
   module.exports = mongoose.model(process.env.USERCOLLECTION,User)