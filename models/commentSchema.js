const mongoose = require('mongoose')
require('dotenv').config()
const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      userName:{
        type:String,
        required:true
      },
blogId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"blogdetails"
},
comment:{
    type:String,
    required:true
}
},{
    timestamps:true,
    versionKey:false
})
const comments = mongoose.model(process.env.COMMENTCOLLECTION,commentSchema)
module.exports = comments