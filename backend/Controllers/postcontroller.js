import Post from "../Schema/postschema.js";

export async function getPosts(req, res) {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("author", "username")
            .lean();

        res.json(posts);
    } catch (err) {
        console.error("getPosts error:", err.message);
        res.status(500).json({ error: "Could not load posts" });
    }
}

export async function createPost(req, res) {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        return res.status(422).json({ error: "Post content cannot be empty" });
    }
    if (content.length > 280) {
        return res.status(422).json({ error: "Post must be 280 characters or fewer" });
    }

    try {
        const post = await Post.create({
            content: content.trim(),
            author: req.user.id,
        });

        const populated = await post.populate("author", "username");
        res.status(201).json(populated);
    } catch (err) {
        console.error("createPost error:", err.message);
        res.status(500).json({ error: "Could not save post" });
    }
}

export async function likePost(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const alreadyLiked = post.likes.some(uid => uid.toString() === userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter(uid => uid.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ likes: post.likes.length, liked: !alreadyLiked });
    } catch (err) {
        console.error("likePost error:", err.message);
        res.status(500).json({ error: "Could not update like" });
    }
}
