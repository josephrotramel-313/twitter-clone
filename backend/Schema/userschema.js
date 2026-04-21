import mongoose from "mongoose";
const { model, Schema } = mongoose

const user = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const User = model('User', user)
export default User

