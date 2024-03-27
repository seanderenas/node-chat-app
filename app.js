const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://seanderenas:TflEvUm3QYS9N6Tb@cluster0.czeqqpu.mongodb.net/ChatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const server = http.createServer(app);  //curently have pwd room joining just make it dynamic, maybe assign room to socket
const io = socketIO(server);

const PORT = 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const Message = require('./models/message');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);


  socket.on('joinRoom', data => {
    //join a room
    socket.join(data); //still joining pwd room ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    socket.roomName = data;
    console.log(`'${data}' ROOM JOINED`)
  });
  
  socket.on('roomMessage', data => {
    console.log(`CALLED roomMessage data: user: ${data.user}, room:${socket.roomName}, message: ${data.message}  `)
    const message = new Message({ user: data.user, text: data.message });
    message.save();
    io.to(socket.roomName).emit('roomMessaged', {user: data.user, message: data.message, room: socket.roomName});
  });

  // Listen for incoming chat messages
  socket.on('chat message', (data) => {
    console.log('Received message:', data);

    // Save the message to MongoDB
    const message = new Message({ user: socket.user, text: data.message });
    message.save();

    // Broadcast the message to all connected clients
    io.emit('chat message', data);
  });

  socket.on('userEnteredName', data => {
    io.emit('setUserName', data);
  });

  // Listen for user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.static('public'));