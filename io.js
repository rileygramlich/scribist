const io = require('socket.io')();


io.on('connection', function(socket) {
  console.log(`Client with id of ${socket.id} connected`);

//   socket.on('add-circle', function(data) {
//     io.emit('add-circle', data);
//   });

})

module.exports = io;