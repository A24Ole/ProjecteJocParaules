import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://projectejocparaules.daw.inspedralbes.cat", 
  }
});

const jugadors = {};

console.log('Servidor Socket.IO escoltant al port 27344');

function broadcastPlayerList() {
  io.emit('updatePlayerList', Object.values(jugadors));
}

io.on('connection', (socket) => {
  console.log(`Un usuari s'ha connectat: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`L'usuari ${socket.id} s'ha desconnectat`);
    delete jugadors[socket.id];
    broadcastPlayerList();
  });

  socket.on('setPlayerName', (data) => {
    jugadors[socket.id] = { id: socket.id, name: data.name };
    console.log(`L'usuari ${socket.id} ara es diu: ${data.name}`);
    broadcastPlayerList();
  });
});

server.listen(27921);