const mongoose = require("mongoose");
const Doc = require("./models/doc");
const { readToken } = require("./config/auth");

/**
 * Live editing. Each doc is a room: edits (Quill deltas) go to everyone else in
 * it, and saves write the whole document. Only the owner and collaborators (people
 * who opened the share link) can join.
 */
module.exports = function attach(io) {
    // Every socket must carry a valid login token.
    io.use((socket, next) => {
        const user = readToken(socket.handshake.auth && socket.handshake.auth.token);
        if (!user) return next(new Error("unauthorized"));
        socket.data.user = user;
        next();
    });

    io.on("connection", (socket) => {
        const { user } = socket.data;

        socket.on("get-doc", async (docId, reply = () => {}) => {
            try {
                if (!mongoose.isValidObjectId(docId)) return reply({ error: "That doc doesn't exist." });
                const doc = await Doc.findById(docId);
                if (!doc) return reply({ error: "That doc doesn't exist." });
                if (!doc.canEdit(user._id)) return reply({ error: "This doc hasn't been shared with you." });

                if (socket.data.docId) leave(socket);
                socket.data.docId = String(doc._id);
                await socket.join(socket.data.docId);
                reply({ content: doc.content, name: doc.name });
                sendPresence(io, socket.data.docId);
            } catch (err) {
                console.error("get-doc failed:", err.message);
                reply({ error: "Couldn't open the doc. Please try again." });
            }
        });

        socket.on("send-changes", (delta) => {
            if (socket.data.docId) socket.to(socket.data.docId).emit("receive-changes", delta);
        });

        socket.on("save-doc", async ({ content, wordCount } = {}, reply = () => {}) => {
            const docId = socket.data.docId;
            if (!docId || !content || !Array.isArray(content.ops)) return reply({ error: "Nothing to save." });
            try {
                await Doc.updateOne(
                    { _id: docId, $or: [{ user: user._id }, { collaborators: user._id }] },
                    { content, wordCount: Math.max(0, Number(wordCount) || 0) }
                );
                reply({ ok: true, savedAt: Date.now() });
            } catch (err) {
                console.error("save-doc failed:", err.message);
                reply({ error: "Couldn't save. Your changes are still here; we'll retry." });
            }
        });

        socket.on("disconnect", () => leave(socket));
    });
};

function leave(socket) {
    const docId = socket.data.docId;
    if (!docId) return;
    socket.leave(docId);
    socket.data.docId = null;
    sendPresence(socket.nsp.server, docId);
}

// How many different people have the doc open.
async function sendPresence(io, docId) {
    const sockets = await io.in(docId).fetchSockets();
    const names = [...new Map(sockets.map((s) => [s.data.user._id, s.data.user.name])).values()];
    io.to(docId).emit("presence", names);
}
