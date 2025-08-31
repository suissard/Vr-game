const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { games } = require('./games');
const { generateMaze, solveMaze } = require('./maze');

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

  socket.on('get games', () => {
    const gamesWithPlayerCounts = games.map(game => ({
      ...game,
      players: gameRooms[game.id] ? gameRooms[game.id].players.size : 0
    }));
    socket.emit('games list', gamesWithPlayerCounts);
  });

  // Event for a user joining a game room
  socket.on('join', (gameId) => {
    socket.join(gameId);
    socket.gameId = gameId; // Store gameId on the socket for later use

    if (!gameRooms[gameId]) {
      gameRooms[gameId] = { players: new Set(), positions: {} };
    }
    gameRooms[gameId].players.add(socket.id);

    console.log(`User ${socket.id} joined game ${gameId}`);

    // Broadcast the updated player count to the room
    io.to(gameId).emit('player count', gameRooms[gameId].players.size);
  });

  // Event for a user leaving a game room
  socket.on('leave', () => {
    const { gameId } = socket;
    if (gameId && gameRooms[gameId]) {
      socket.leave(gameId);
      gameRooms[gameId].players.delete(socket.id);
      delete gameRooms[gameId].positions[socket.id];
      console.log(`User ${socket.id} left game ${gameId}`);

      // Broadcast the updated player count
      io.to(gameId).emit('player count', gameRooms[gameId].players.size);

      if (gameRooms[gameId].players.size === 0) {
        delete gameRooms[gameId];
        console.log(`Room ${gameId} is now empty and has been closed.`);
      }
      socket.gameId = null;
    }
  });

  // Event for handling chat messages
  socket.on('chat message', (msg) => {
    if (socket.gameId) {
      // Broadcast the message to everyone in the same room
      io.to(socket.gameId).emit('chat message', msg);
      console.log(`Message in room ${socket.gameId} from ${socket.id}: ${msg.text}`);
    }
  });

  // Event for generating and sending a maze
  socket.on('get maze', () => {
    const width = 21;
    const height = 21;
    const maze = generateMaze(width, height);
    const solution = solveMaze(maze);
    socket.emit('maze data', { maze, solution });
  });

  // Event for handling player position updates
  socket.on('player position', (position) => {
    if (socket.gameId && gameRooms[socket.gameId]) {
      gameRooms[socket.gameId].positions[socket.id] = position;
    }
  });

  // Event for when a user disconnects
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    const { gameId } = socket;
    if (gameId && gameRooms[gameId]) {
      gameRooms[gameId].players.delete(socket.id);
      delete gameRooms[gameId].positions[socket.id];

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

// Periodically broadcast the list of games with player counts
setInterval(() => {
  const gamesWithPlayerCounts = games.map(game => ({
    ...game,
    players: gameRooms[game.id] ? gameRooms[game.id].players.size : 0
  }));
  io.emit('games list', gamesWithPlayerCounts);
}, 5000);

// Broadcast player positions for all active rooms
setInterval(() => {
  for (const gameId in gameRooms) {
    if (gameRooms.hasOwnProperty(gameId)) {
      io.to(gameId).emit('player positions', gameRooms[gameId].positions);
    }
  }
}, 100); // Broadcast every 100ms

server.listen(3000, () => {
  console.log('listening on *:3000');
});
