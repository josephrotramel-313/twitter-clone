// ── Auth state ──
let currentUser = null;

async function checkAuth() {
    try {
        const res = await fetch("/api/me");
        if (res.ok) {
            currentUser = await res.json();
        }
    } catch {
        // not logged in — that's fine
    }
    renderAuthButtons();
}

function renderAuthButtons() {
    const authEl = document.getElementById("authButtons");
    if (!authEl) return;

    if (currentUser) {
        authEl.innerHTML = `
            <span class="nav-username">@${currentUser.username}</span>
            <button id="logoutBtn">Log out</button>
        `;
        document.getElementById("logoutBtn").addEventListener("click", logout);
    } else {
        authEl.innerHTML = `
            <button id="loginBtn">Login</button>
            <button id="signUpBtn">Sign up</button>
        `;
        document.getElementById("loginBtn").addEventListener("click", () => {
            window.location.href = "login.html";
        });
        document.getElementById("signUpBtn").addEventListener("click", () => {
            window.location.href = "signup.html";
        });
    }
}

async function logout() {
    await fetch("/logout", { method: "POST" });
    currentUser = null;
    renderAuthButtons();
    loadFeed();
}

// ── Create post button ──
document.querySelector(".createPost").addEventListener("click", () => {
    if (!currentUser) {
        window.location.href = "login.html";
    } else {
        window.location.href = "createpost.html";
    }
});

// ── Feed ──
async function loadFeed() {
    const feedEl = document.getElementById("feedContent");
    if (!feedEl) return;

    try {
        const res = await fetch("/api/posts");
        const posts = await res.json();

        if (!posts.length) {
            feedEl.innerHTML = `<p class="loading-msg">No posts yet — be the first to post!</p>`;
            return;
        }

        feedEl.innerHTML = posts.map(post => renderPost(post)).join("");
        attachLikeListeners();
    } catch {
        feedEl.innerHTML = `<p class="loading-msg">Could not load posts.</p>`;
    }
}

function renderPost(post) {
    const initials = post.author.username.slice(0, 2).toUpperCase();
    const timeAgo = formatTime(post.createdAt);
    const likeCount = post.likes.length;
    const liked = currentUser && post.likes.includes(currentUser.id);

    // Escape HTML to prevent XSS
    const safeContent = post.content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    return `
        <article class="post-card">
            <div class="post-header">
                <div class="post-avatar">${initials}</div>
                <div class="post-meta">
                    <span class="post-username">@${post.author.username}</span>
                    <span class="post-time">${timeAgo}</span>
                </div>
            </div>
            <p class="post-body">${safeContent}</p>
            <div class="post-actions">
                <button class="post-action-btn like-btn ${liked ? "liked" : ""}" data-id="${post._id}" data-count="${likeCount}">
                    &#128077; <span class="like-count">${likeCount > 0 ? likeCount : ""} Like${likeCount !== 1 ? "s" : ""}</span>
                </button>
            </div>
        </article>
    `;
}

function attachLikeListeners() {
    document.querySelectorAll(".like-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (!currentUser) {
                window.location.href = "login.html";
                return;
            }
            const postId = btn.dataset.id;
            try {
                const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
                if (!res.ok) return;
                const data = await res.json();
                btn.classList.toggle("liked", data.liked);
                const countEl = btn.querySelector(".like-count");
                countEl.textContent = `${data.likes > 0 ? data.likes + " " : ""}Like${data.likes !== 1 ? "s" : ""}`;
            } catch {
                // silently fail
            }
        });
    });
}

function formatTime(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// ── Init ──
checkAuth().then(() => loadFeed());
