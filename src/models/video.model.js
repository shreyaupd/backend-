import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },


    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    duration: {
        type: Number, //cloudinary url 
        required: true
    },

    views:{
        type:Number,
        default:0,
    },

    isPublished: {
        type: Boolean,
        default: true
    },

    owener:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
}, 

{
    timestamps: true
});

videoSchema.plugin(mongooseAggregatePaginate); //plugins are the functions that are used to add some extra functionality to the schema.
export const Video= mongoose.model("Video",videoSchema); 