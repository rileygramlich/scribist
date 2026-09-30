const { OAuth2Client } = require("google-auth-library");
const User = require("../../models/user");
const { createToken } = require("../../config/auth");

const googleClientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
const google = googleClientId ? new OAuth2Client(googleClientId) : null;

module.exports = { create, login, googleLogin, config };

// POST /api/users  { name, email, password }
async function create(req, res) {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password are all needed." });
    if (String(password).length < 6) return res.status(400).json({ error: "Use a password of at least 6 characters." });
    if (await User.exists({ email: String(email).toLowerCase().trim() })) {
        return res.status(409).json({ error: "There's already an account with that email. Try logging in." });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json(createToken(user));
}

// POST /api/users/login  { email, password }
async function login(req, res) {
    const { email, password } = req.body || {};
    const user = email && (await User.findOne({ email: String(email).toLowerCase().trim() }));
    if (!user || !(await user.checkPassword(String(password || "")))) {
        const googleOnly = user && !user.password;
        return res.status(401).json({ error: googleOnly ? "This account signs in with Google." : "That email and password don't match." });
    }
    res.json(createToken(user));
}

// POST /api/users/google  { credential }: the ID token from Google's sign-in button.
async function googleLogin(req, res) {
    if (!google) return res.status(503).json({ error: "Google sign-in isn't set up." });
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Missing Google credential." });
    let payload;
    try {
        payload = (await google.verifyIdToken({ idToken: credential, audience: googleClientId })).getPayload();
    } catch {
        return res.status(401).json({ error: "Google sign-in didn't work. Please try again." });
    }
    if (!payload.email || !payload.email_verified) return res.status(401).json({ error: "Your Google email isn't verified." });

    const email = payload.email.toLowerCase();
    // Same email as an existing account: link Google to it rather than making a second one.
    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });
    if (!user) user = await User.create({ name: payload.name || email, email, googleId: payload.sub });
    else if (!user.googleId) {
        user.googleId = payload.sub;
        await user.save();
    }
    res.json(createToken(user));
}

// GET /api/config: public settings the browser needs.
function config(req, res) {
    res.json({ googleClientId: googleClientId || null });
}
