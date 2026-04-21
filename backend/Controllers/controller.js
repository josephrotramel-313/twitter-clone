import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Schema/userschema.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function signup(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(422).json({ error: "All fields are required" });
    }
    if (password.length < 8) {
        return res.status(422).json({ error: "Password must be at least 8 characters" });
    }

    try {
        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({ username, email, password: hashed });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, COOKIE_OPTIONS);
        res.status(201).json({ username: user.username });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(409).json({ error: `That ${field} is already taken` });
        }
        console.error("signup error:", err.message);
        res.status(500).json({ error: "Something went wrong, please try again" });
    }
}

export async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(422).json({ error: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, COOKIE_OPTIONS);
        res.json({ username: user.username });
    } catch (err) {
        console.error("login error:", err.message);
        res.status(500).json({ error: "Something went wrong, please try again" });
    }
}

export function logout(req, res) {
    res.clearCookie("token");
    res.json({ ok: true });
}

export function me(req, res) {
    res.json({ username: req.user.username });
}
