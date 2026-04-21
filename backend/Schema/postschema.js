import mongoose from "mongoose";
const { model, Schema } = mongoose;

const post = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 280,
        trim: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // array of user IDs who liked this post
    likes: {
        type: [Schema.Types.ObjectId],
        default: [],
    },
}, {
    timestamps: true,
});

const Post = model("Post", post);
export default Post;
