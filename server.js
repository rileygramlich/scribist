const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const http = require("http");
const cors = require("cors");

// Oauth
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var passport = require('passport');

var debug = require("debug")("realtime-socket-io:server");

require("dotenv").config();
require("./config/database");
require("./config/passport");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(logger("dev"));
app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,https://scribist.vercel.app")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);

// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
app.use(favicon(path.join(__dirname, "build", "favicon.ico")));
app.use(express.static(path.join(__dirname, "build")));

app.use(require("./config/checkToken"));

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "test") {
    server.listen(port, function () {
        console.log(`Express app running on port ${port}`);
    });
}

// io:
// const server = http.Server(app);
const ioManager = require("./ioManager");
io.on("connection", ioManager);

// Put API routes here, before the "catch all" route
app.use("/api/users", require("./routes/api/users"));

const ensureLoggedIn = require("./config/ensureLoggedIn");
app.use("/api/docs", ensureLoggedIn, require("./routes/api/docs"));

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// inside bin/www

// load and attach socket.io to http server

module.exports = { app, io };
