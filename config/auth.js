const jwt = require("jsonwebtoken");

const SECRET = (process.env.SECRET || "").trim() || "scribist-dev-secret";
if (process.env.NODE_ENV === "production" && !process.env.SECRET) {
    throw new Error("SECRET must be set in production (it signs the login tokens).");
}

/** Only what the app needs, so the token never carries a password hash or other fields. */
function createToken(user) {
    const safe = { _id: String(user._id), name: user.name, email: user.email };
    return jwt.sign({ user: safe }, SECRET, { expiresIn: "7d" });
}

function readToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token.replace(/^Bearer\s+/i, ""), SECRET).user;
    } catch {
        return null;
    }
}

// Express: sets req.user from an "Authorization: Bearer <token>" header.
function checkToken(req, res, next) {
    req.user = readToken(req.get("Authorization"));
    next();
}

function ensureLoggedIn(req, res, next) {
    if (!req.user) return res.status(401).json({ error: "Please log in." });
    next();
}

module.exports = { createToken, readToken, checkToken, ensureLoggedIn };
