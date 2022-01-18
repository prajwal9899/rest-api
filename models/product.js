import  mongoose  from "mongoose";
import { APP_URL } from "../config";

const productSchema = new  mongoose.Schema({
    name: {
        type : String,
        require :true
    },
    price: {
        type : Number,
        require :true,
    },
    size: {
        type : String,
        require :true
    },
    image: {
        type : String,
        get : (image) => {
            return `${APP_URL}/${image}`
        }
    }
},{timestamps : true, toJSON: {getters: true}, id: false})

export default mongoose.model('Product',productSchema)