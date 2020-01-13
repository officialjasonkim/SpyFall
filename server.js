'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;
const server = express()
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const socket = require('socket.io');
const io = socket(server, { wsEngine: 'ws' });

const locations = [
  {
    place: 'Airplane',
    roles: [
      '1st Class Passenger',
      'Air Marshal',
      'Mechanic',
      'Coach Passenger',
      'Flight Attendant',
      'Co-Pilot',
      'Captain'
    ]
  },
  {
    place: 'Bank',
    roles: [
      'Armored Car Driver',
      'Bank Manager',
      'Loan Consultant',
      'Bank Robber',
      'Customer',
      'Security Guard',
      'Bank Teller'
    ]
  },
  {
    place: 'Beach',
    roles: [
      'Beach Bartender',
      'Kite Surfer',
      'Lifeguard',
      'Thief',
      'Beach Goer',
      'Beach Photographer',
      'Ice Cream Man'
    ]
  },
  {
    place: 'Casino',
    roles: [
      'Bartender',
      'Head of Security',
      'Bouncer',
      'Pit Boss',
      'Hustler',
      'Dealer',
      'Gambler'
    ]
  },
  {
    place: 'Cathedral',
    roles: [
      'Priest',
      'Beggar',
      'Sinner',
      'Parishioner',
      'Tourist',
      'Deacon',
      'Choir Singer'
    ]
  },
  {
    place: 'Circus Tent',
    roles: [
      'Acrobat',
      'Animal Tamer',
      'Magician',
      'Audience Member',
      'Fire Eater',
      'Clown',
      'Juggler'
    ]
  },
  {
    place: 'Corporate Party',
    roles: [
      'Entertainer',
      'Manager',
      'Party Crasher',
      'Owner/CEO',
      'Admin Assistant',
      'Accountant',
      'Delivery Boy'
    ]
  },
  {
    place: 'Crusader Army',
    roles: [
      'Monk',
      'Imprisoned Arab',
      'Servant',
      'Bishop',
      'Squire',
      'Archer',
      'Knight'
    ]
  },
  {
    place: 'Day Spa',
    roles: [
      'Customer',
      'Stylist',
      'Massage Tech',
      'Manicurist',
      'Makeup Artist',
      'Dermatologist',
      'Beautician'
    ]
  },
  {
    place: 'Embassy',
    roles: [
      'Security Guard',
      'Admin Assistant',
      'Ambassador',
      'Government Official',
      'Tourist',
      'Refugee',
      'Diplomat'
    ]
  },
  {
    place: 'Hospital',
    roles: [
      'Nurse',
      'Doctor',
      'Anesthesiologist',
      'Intern',
      'Patient',
      'Therapist',
      'Surgeon'
    ]
  },
  {
    place: 'Hotel',
    roles: [
      'Doorman',
      'Security Guard',
      'Hotel Manager',
      'Housekeeper',
      'Hotel Guest',
      'Bartender',
      'Valet'
    ]
  },
  {
    place: 'Military Base',
    roles: [
      'Deserter',
      'Colonel',
      'Medic',
      'Soldier',
      'Sniper',
      'Execuitve Officer',
      'Tank Commander'
    ]
  },
  {
    place: 'Movie Studio',
    roles: [
      'Stuntman',
      'Sound Engineer',
      'Cameraman',
      'Director',
      'Costume Artist',
      'Actor',
      'Producer'
    ]
  },
  {
    place: 'Ocean Liner',
    roles: [
      'Rich Passanger',
      'Cook',
      'Captain',
      'Bartender',
      'Musician',
      'Waiter',
      "Ship's Mechanic"
    ]
  },
  {
    place: 'Passenger Train',
    roles: [
      'Mechanic',
      'Border Patrol',
      'Chef',
      'Engineer',
      'Steward',
      'Ticket Taker',
      'Passenger'
    ]
  },
  {
    place: 'Pirate Ship',
    roles: [
      'Cook',
      'Sailor',
      'Slave',
      'Cannoneer',
      'Bound Prisoner',
      'Cabin Boy',
      'Pirate Captain'
    ]
  },
  {
    place: 'Polar Station',
    roles: [
      'Medic',
      'Geologist',
      'Expedition Leader',
      'Biologist',
      'Radioman',
      'Hydrologist',
      'Meteorologist'
    ]
  },
  {
    place: 'Police Station',
    roles: [
      'Detective',
      'Lawyer',
      'Journalist',
      'Forensic Scientist',
      'Evidence Archivist',
      'Patrol Office',
      'Criminal'
    ]
  },
  {
    place: 'Restaurant',
    roles: [
      'Musician',
      'Customer',
      'Table Busser',
      'Host',
      'Head Chef',
      'Food Critic',
      'Server'
    ]
  },
  {
    place: 'School',
    roles: [
      'Gym Teacher',
      'Student',
      'Principal',
      'Security Guard',
      'Janitor',
      'Lunch Lady',
      'Maintenance Man'
    ]
  },
  {
    place: 'Service Station',
    roles: [
      'Manager',
      'Tire Specialist',
      'Motorcyclist',
      'Car Owner',
      'Car Washer',
      'Diagnostic Tech',
      'Auto Mechanic'
    ]
  },
  {
    place: 'Space Station',
    roles: [
      'Engineer',
      'Alien',
      'Tourist',
      'Pilot',
      'Mission Commander',
      'Scientist',
      'Doctor'
    ]
  },
  {
    place: 'Submarine',
    roles: [
      'Cook',
      'Captain',
      'Sonar Operator',
      'Weapons Technician',
      'Sailor',
      'Radioman',
      'Navigator'
    ]
  },
  {
    place: 'Supermarket',
    roles: [
      'Customer',
      'Cashier',
      'Butcher',
      'Janitor',
      'Produce Manager',
      'Food Sample Demo',
      'Shelf Stocker'
    ]
  },
  {
    place: 'Theater',
    roles: [
      'Coat Check',
      'Cue Card Prompter',
      'Ticket Office Cashier',
      'Theater Visitor',
      'Director',
      'Actor',
      'Crewman'
    ]
  },
  {
    place: 'University',
    roles: [
      'Graduate Student',
      'Professor',
      'Dean',
      'Psychologist',
      'Maintenance Man',
      'Student',
      'Advisor'
    ]
  }
];

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

  socket.on('startGame', function(data) {
    let sockets = state.games[state.rooms.indexOf(data.room)].sockets;
    let index = Math.floor(Math.random() * locations.length);
    let place = locations[index].place;
    let spy = Math.floor(Math.random() * sockets.length);
    state.games[state.rooms.indexOf(data.room)].playing = true;
    for (let i = 0; i < sockets.length; i++) {
      let info = {
        location: place,
        role: locations[index].roles[Math.floor(Math.random() * 7)]
      };
      if (spy == i) {
        info = {
          location: '???',
          role: 'Spy'
        };
      }
      if (socket.id == sockets[i]) {
        socket.emit('activate', info);
      } else {
        socket.broadcast.to(`${sockets[i]}`).emit('activate', info);
      }
    }
  });

  socket.on('endGame', function(data) {
    let sockets = state.games[state.rooms.indexOf(data.room)].sockets;
    state.games[state.rooms.indexOf(data.room)].playing = false;
    for (let i = 0; i < sockets.length; i++) {
      if (socket.id == sockets[i]) {
        socket.emit('deactivate');
      } else {
        socket.broadcast.to(`${sockets[i]}`).emit('deactivate');
      }
    }
  });

  socket.on('disconnect', function() {
    let game;
    let gameIndex;
    let playerIndex;
    let sockets;
    for (let i = 0; i < state.games.length; i++) {
      if (state.games[i].sockets.includes(socket.id)) {
        game = state.games[i];
        gameIndex = i;
        playerIndex = game.sockets.indexOf(socket.id);
        sockets = game.sockets;
      }
    }
    if (game == undefined) {
      return;
    }
    if (game.players.length < 2) {
      state.rooms.splice(gameIndex, 1);
      state.games.splice(gameIndex, 1);
    } else if (game.playing == false) {
      game.players.splice(playerIndex, 1);
      game.sockets.splice(playerIndex, 1);
      state.games[gameIndex] = game;
      for (let i = 0; i < sockets.length; i++) {
        socket.broadcast.to(`${sockets[i]}`).emit('userLeft', game);
      }
    } else {
      game.players.splice(playerIndex, 1);
      game.sockets.splice(playerIndex, 1);
      game.playing = false;
      state.games[gameIndex] = game;
      for (let i = 0; i < sockets.length; i++) {
        socket.broadcast.to(`${sockets[i]}`).emit('userLeft', game);
      }
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
