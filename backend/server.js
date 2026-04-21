import express from 'express'
import mongoose from "mongoose"
import connectDB from './config/db.js'
const app = express()
import path from 'path'
import dotenv from 'dotenv/config'
import signup from './Controllers/controller.js'
const root = path.join(import.meta.dirname,'..' )
app.use(express.static(path.join(root, "frontend")))
app.use(express.json())
app.use(express.urlencoded({extended: false}))



app.listen(process.env.PORT, "127.0.0.1", () => {
    connectDB()
    console.log(`app running at localhost:${process.env.PORT}`)
})

app.get("/", (req,res)=>{
    res.sendFile(path.join(root, "frontend", "main.html"))
})

app.post("/signup", signup)
