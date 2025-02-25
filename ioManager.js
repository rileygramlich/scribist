const Doc = require("./models/doc");

module.exports = function (socket) {
    console.log(`Client with id of ${socket.id} connected`);

    socket.on("get-doc", async (docId) => {
        const doc = await findDoc(docId);
        socket.join(docId);
        socket.emit("load-doc", doc.content);

        socket.on("emit-changes", (delta) => {
            socket.broadcast.to(docId).emit("receive-changes", delta);
        });

        socket.on("save-doc", async (content) => {
            await Doc.findByIdAndUpdate(docId, { content });
        });
    });
};

async function findDoc(id) {
    if (id == null) return;
    const doc = await Doc.findById(id);
    return doc;
}
