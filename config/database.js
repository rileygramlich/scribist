const mongoose = require("mongoose");

const url = (process.env.DATABASE_URL || "").trim() || "mongodb://127.0.0.1:27017/scribist";

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set, so the app is trying a local MongoDB that does not exist here.");
}
if (/<[^>]*>/.test(url)) {
    console.error("DATABASE_URL still contains a <placeholder>. Replace it, angle brackets included, with the real value.");
}

// Give up quickly when the database is unreachable, so requests fail with a clear
// message in seconds instead of hanging.
const TIMEOUT_MS = 8000;
const RETRY_AFTER_MS = 5000;
mongoose.set("bufferTimeoutMS", TIMEOUT_MS);

mongoose.connection.on("connected", () => console.log(`Connected to MongoDB ${mongoose.connection.name}`));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err.message));

let lastError = null;
let lastAttempt = 0;
let connecting = null;

/** Connect, or reconnect after a failure (at most every few seconds). Rejects if it can't. */
function ensureConnected() {
    if (mongoose.connection.readyState === 1) return Promise.resolve();
    if (connecting) return connecting;
    if (lastError && Date.now() - lastAttempt < RETRY_AFTER_MS) return Promise.reject(lastError);
    lastAttempt = Date.now();
    connecting = mongoose
        .connect(url, { serverSelectionTimeoutMS: TIMEOUT_MS })
        .then(() => { lastError = null; })
        .catch((err) => {
            lastError = err;
            console.error(`Could not connect to MongoDB: ${describe(err)}`);
            throw err;
        })
        .finally(() => { connecting = null; });
    return connecting;
}

ensureConnected().catch(() => {});

/** For Atlas, Mongoose's message is always the generic allowlist hint; the real per-server errors are underneath. */
function describe(err) {
    const servers = err.reason && err.reason.servers ? [...err.reason.servers.values()] : [];
    const details = [...new Set(servers.map((s) => s.error && s.error.message).filter(Boolean))];
    return details.length ? `${err.name}: ${details.join(" | ")}` : `${err.name}: ${err.message}`;
}

function status() {
    const connected = mongoose.connection.readyState === 1;
    return {
        database: connected ? "connected" : lastError ? "error" : "connecting",
        reason: connected || !lastError ? undefined : describe(lastError),
    };
}

module.exports = { ensureConnected, status };
