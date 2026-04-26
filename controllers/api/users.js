const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
    create,
    login,
    googleLogin,
    checkToken,
};

/*-- Helper Functions --*/

function createJWT(user) {
    const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider || "local",
    };
    return jwt.sign({ user: safeUser }, process.env.SECRET, {
        expiresIn: "24h",
    });
}

async function create(req, res) {
    try {
        const user = await User.create({ ...req.body, authProvider: "local" });
        const token = createJWT(user);
        res.status(200).json(token);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !user.password) throw new Error("No matching local user");
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) throw Error("wrong password");
        const token = createJWT(user);
        res.status(200).json(token);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

async function googleLogin(req, res) {
    try {
        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json("GOOGLE_CLIENT_ID is not configured");
        }

        const { credential } = req.body;
        if (!credential) return res.status(400).json("Missing Google credential");

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload?.email || !payload.email_verified) {
            return res.status(401).json("Google account email not verified");
        }

        let user = await User.findOne({ email: payload.email.toLowerCase() });

        if (!user) {
            user = await User.create({
                name: payload.name || payload.email,
                email: payload.email.toLowerCase(),
                googleId: payload.sub,
                authProvider: "google",
            });
        } else if (!user.googleId) {
            user.googleId = payload.sub;
            if (!user.authProvider || user.authProvider === "local") {
                user.authProvider = "local";
            }
            await user.save();
        }

        const token = createJWT(user);
        res.status(200).json(token);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

// controllers/api/users.js

function checkToken(req, res) {
    res.status(200).json(req.exp);
}
