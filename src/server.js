import { Server } from 'socket.io';
import GameState from './models/game_state.js';

const io = new Server(3000, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : "*"
    }
});

let NewGameState = new GameState();
NewGameState.lastModified;
console.log(NewGameState.lastModified);

io.on('connect', (socket) => {
    console.log('A user with id ' + socket.id + ' connected');
    
    let session = socket.handshake.query.clientSession;
    console.log('Session: ' + session);

    if (session == 'null') {
        session = Date.now();
        console.log('Assigning session: ' + session);
        socket.emit('assignSession', session);
    }

    if(NewGameState.players[session] == undefined) {
        NewGameState.addPlayer(session);
        NewGameState.room = 1;
    } 

    socket.join(1);
    console.log(`Players Connected: ${Object.keys(NewGameState.players).length}`);
    socket.emit('assignSession', session);  // when client connects, assign session id to client
    io.to(NewGameState.players[session].room).emit('gameState', JSON.stringify(NewGameState)); // send game state to all clients

    socket.on('action', (action) => {
        console.log('Action: ' + action);
        NewGameState.handleAction(action, session);
        io.to(NewGameState.players[session].room).emit('gameState', JSON.stringify(NewGameState)); // update all clients
    });
    
});
