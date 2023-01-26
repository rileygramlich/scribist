const mongoose = require("mongoose");
const Doc = require("./models/doc");

const io = require("socket.io")(3002, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  console.log(`Client with id of ${socket.id} connected`);

  socket.on("get-doc", async (docId) => {
    const doc = await findDoc(docId);
    socket.join(docId);
    socket.emit("load-doc", doc.content);

    socket.on("emit-changes", (delta) => {
      console.log(delta);
      socket.broadcast.to(docId).emit("receive-changes", delta);
    });

    socket.on("save-doc", async (content) => {
      await Doc.findByIdAndUpdate(docId, { content });
    });
  });
});

async function findDoc(id) {
  if (id == null) return;
  const doc = await Doc.findById(id);
  return doc;
}

module.exports = io;
