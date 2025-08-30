const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

// Add CORS configuration to allow connections from the client
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Socket.IO Server is running</h1>');
});

const gameRooms = {}; // Stores room data, e.g., { gameId: { players: Set() } }

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Event for a user joining a game room
  socket.on('join', (gameId) => {
    socket.join(gameId);
    socket.gameId = gameId; // Store gameId on the socket for later use

    if (!gameRooms[gameId]) {
      gameRooms[gameId] = { players: new Set() };
    }
    gameRooms[gameId].players.add(socket.id);

    console.log(`User ${socket.id} joined game ${gameId}`);

    // Broadcast the updated player count to the room
    io.to(gameId).emit('player count', gameRooms[gameId].players.size);
  });

  // Event for handling chat messages
  socket.on('chat message', (msg) => {
    if (socket.gameId) {
      // Broadcast the message to everyone in the same room
      io.to(socket.gameId).emit('chat message', msg);
      console.log(`Message in room ${socket.gameId} from ${socket.id}: ${msg.text}`);
    }
  });

  // Event for when a user disconnects
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    const { gameId } = socket;
    if (gameId && gameRooms[gameId]) {
      gameRooms[gameId].players.delete(socket.id);

      // Broadcast the updated player count
      io.to(gameId).emit('player count', gameRooms[gameId].players.size);

      // Clean up the room if it's empty
      if (gameRooms[gameId].players.size === 0) {
        delete gameRooms[gameId];
        console.log(`Room ${gameId} is now empty and has been closed.`);
      }
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
