import mongoose from "mongoose";
import User from "../Schema/userschema.js";

export default function signup(req,res) {
    const user = User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    res.json(req.body)
}