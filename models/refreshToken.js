import  mongoose  from "mongoose";

const refreshSchema = new  mongoose.Schema({
    token: {
        type : String,
        unique :true
    }
},{timestamps : true})

export default mongoose.model('RefreshToken',refreshSchema)