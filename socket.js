
const socketIO = require('socket.io');
module.exports = function(server) {
  const io = socketIO(server);
  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('sendPayment', (data) => {
      io.emit('paymentReceived', data);
    });
  });
};
