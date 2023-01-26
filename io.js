const io = require('socket.io')(3002, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  },
});


io.on('connection', function(socket) {
  console.log(`Client with id of ${socket.id} connected`);

  socket.on('emit-changes', function(delta) {
    console.log(delta)
    socket.broadcast.emit('receive-changes', delta);
  });

})

module.exports = io;