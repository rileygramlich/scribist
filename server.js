const path = require("path");
const http = require("http");
const express = require("express");
const logger = require("morgan");
const compression = require("compression");
const { Server } = require("socket.io");

require("dotenv").config({ quiet: true });

const database = require("./config/database");
const { checkToken, ensureLoggedIn } = require("./config/auth");

const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === "production";

// The site, API and sockets are all served from this one origin, so no CORS is needed.
// In development Vite proxies /api and /socket.io here.
const io = new Server(server, { maxHttpBufferSize: 5e6 });
app.set("io", io);
require("./ioManager")(io);

app.set("trust proxy", 1);
app.use(logger(isProduction ? "combined" : "dev"));
app.use(compression());
app.use(express.json({ limit: "5mb" }));
app.use(checkToken);

app.get("/api/health", async (req, res) => {
    await database.ensureConnected().catch(() => {});
    const s = database.status();
    res.status(s.database === "connected" ? 200 : 503).json(s);
});

// Everything else under /api needs the database; answer clearly if it's down.
app.use("/api", async (req, res, next) => {
    try {
        await database.ensureConnected();
        next();
    } catch {
        res.status(503).json({ error: "Scribist can't reach its database right now. Please try again in a minute." });
    }
});
app.use("/api/users", require("./routes/api/users"));
app.use("/api/docs", ensureLoggedIn, require("./routes/api/docs"));
app.use("/api", (req, res) => res.status(404).json({ error: "Not found." }));

// The built React app (npm run build), with every other path going to index.html.
const dist = path.join(__dirname, "dist");
app.use(express.static(dist, { maxAge: isProduction ? "7d" : 0, index: false }));
app.get("/{*path}", (req, res) => res.sendFile(path.join(dist, "index.html")));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return;
    const status = err.name === "ValidationError" ? 400 : err.status || 500;
    res.status(status).json({ error: status === 400 ? err.message : "Something went wrong on our end." });
});

const port = Number(process.env.PORT) || 3001;
server.listen(port, () => console.log(`Scribist listening on http://localhost:${port}`));

module.exports = { app, server, io };
