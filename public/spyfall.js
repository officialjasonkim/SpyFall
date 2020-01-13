// Socket
let socket;
socket = io.connect();
socket.on('roomCreated', createRoom);
socket.on('noRoom', noRoom);
socket.on('userAdded', updateRoom);
socket.on('joined', joinRoom);

// Game Info
let state = {};

// Submitting
function addUser() {
  if (
    document.getElementById('room').value != '' &&
    document.getElementById('name').value != ''
  ) {
    data = {
      room: document.getElementById('room').value,
      name: document.getElementById('name').value
    };
    document.getElementById('alerts').innerHTML = 'Checking...';
    socket.emit('addUser', data);
  }
}
function makeRoom() {
  if (document.getElementById('creatorName').value != '') {
    data = {
      name: document.getElementById('creatorName').value
    };
    document.getElementById('alerts').innerHTML = 'Creating...';
    socket.emit('makeRoom', data);
  }
}

// Rooms
function createRoom(data) {
  // console.log(state);
  document.getElementById('wrapper').style.display = 'none';
  document.getElementById('login').style.display = 'none';
  document.getElementById('lobby').style.display = 'block';
  document.getElementById('game').style.display = 'none';
  updateRoom(data);
}

function joinRoom(data) {
  document.getElementById('wrapper').style.display = 'none';
  document.getElementById('login').style.display = 'none';
  document.getElementById('lobby').style.display = 'block';
  document.getElementById('game').style.display = 'none';
  updateRoom(data);
}

function noRoom(data) {
  document.getElementById('alerts').innerHTML = data.msg;
}

// Updating Info
function updateRoom(data) {
  state = data;
  document.getElementById('lobbyRoom').innerHTML = state.roomCode;
  let players = ``;
  for (let i = 0; i < state.players.length; i++) {
    players += `<h5 class="rounded">${i + 1 + '. '}${state.players[i]}</h5>`;
  }
  document.getElementById('lobbyPlayers').innerHTML = players;
}

// DOM Manipulation
function showJoinRoom() {
  document.getElementById('joinRoom').style.display = 'block';
  document.getElementById('makeRoom').style.display = 'none';
  document.getElementById('joinButton').style.background = '#eee';
  document.getElementById('makeButton').style.background = 'white';
}
function showMakeRoom() {
  document.getElementById('joinRoom').style.display = 'none';
  document.getElementById('makeRoom').style.display = 'block';
  document.getElementById('makeButton').style.background = '#eee';
  document.getElementById('joinButton').style.background = 'white';
}

function exit() {
  location.reload();
}
