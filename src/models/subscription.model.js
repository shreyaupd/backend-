import { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    channel :{//owner of the channel}
        type: Schema.Types.ObjectId,
        ref: "User", 
    }
},{timestamp:true
})
export const Subscription = mongoose.model("Subscription", subscriptionSchema)
