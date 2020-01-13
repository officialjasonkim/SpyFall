'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;
const server = express()
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const socket = require('socket.io');
const io = socket(server, { wsEngine: 'ws' });

let state = {
  rooms: [],
  games: []
};

io.on('connection', newConnection);
function newConnection(socket) {
  console.log('new connection: ' + socket.id);

  socket.on('makeRoom', function(data) {
    let searchingRoom = true;
    let id = makeId(6);
    while (searchingRoom) {
      if (state.rooms.includes(id)) {
        id = makeId(6);
      } else {
        searchingRoom = false;
        state.rooms.push(String(id));
      }
    }
    let newRoom = {
      roomCode: String(id),
      players: [String(data.name)],
      sockets: [String(socket.id)],
      playing: false
    };
    state.games.push(newRoom);
    socket.emit('roomCreated', newRoom);
  });

  socket.on('addUser', function(data) {
    if (!state.rooms.includes(data.room)) {
      socket.emit('noRoom', { msg: "The room doesn't exist." });
    } else if (state.games[state.rooms.indexOf(data.room)].playing) {
      socket.emit('noRoom', { msg: 'The room is in the middle of a game.' });
    } else {
      let index = state.rooms.indexOf(data.room);
      let game = state.games[index];
      let sockets = game.sockets;
      game.players.push(String(data.name));
      game.sockets.push(String(socket.id));
      state.games[index] = game;
      for (let i = 0; i < sockets.length; i++) {
        socket.broadcast.to(`${sockets[i]}`).emit('userAdded', game);
      }
      socket.emit('joined', game);
    }
  });
}

function makeId(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
