import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { signup, login, logout, me } from "./Controllers/controller.js";
import { getPosts, createPost, likePost } from "./Controllers/postcontroller.js";
import { requireAuth } from "./Middleware/auth.js";

const app = express();
const root = path.join(import.meta.dirname, "..");

app.use(express.static(path.join(root, "frontend")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── Auth routes ──
app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);
app.get("/api/me", requireAuth, me);

// ── Post routes ──
app.get("/api/posts", getPosts);
app.post("/api/posts", requireAuth, createPost);
app.post("/api/posts/:id/like", requireAuth, likePost);

// ── Pages ──
app.get("/", (req, res) => {
    res.sendFile(path.join(root, "frontend", "main.html"));
});

connectDB().then(() => {
    app.listen(process.env.PORT, "127.0.0.1", () => {
        console.log(`app running at http://localhost:${process.env.PORT}`);
    });
});
