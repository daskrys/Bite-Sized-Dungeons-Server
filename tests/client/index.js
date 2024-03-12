import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    query: {
        clientSession: sessionStorage.getItem("client-token")
    }
});

let sessionID;
let clientGameState;;

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('assignSession', (newSession) => {
    sessionStorage.setItem("client-token", newSession);
    sessionID = newSession;
    console.log('Assigned session: ' + newSession);
});

socket.on('gameState', (gameState) => { 
    //console.log(gameState);
    updateGameState(JSON.parse(gameState));
});

function updateGameState (gameState) { 
    const players = gameState['players'];
    const enemyHealth = gameState['enemyHealth'];

    // update clients with new game state
    for(let player in players) { 
        console.log('Player: ' + players[player].playerNumber + ' Health: ' + players[player].health);
        const player_num = players[player].playerNumber;
        document.querySelector(`#player-${player_num}`).innerHTML = `Player ${player_num} Health: ${players[player].health}`;
    }

    document.querySelector('#dragon-health').innerHTML = `Dragon Health: ${enemyHealth}`;
    console.log('Player Health: ' + players[sessionID].health);
    document.querySelector('#player-num').innerHTML = `Player Number: ${players[sessionID].playerNumber}`;

    clientGameState = gameState;
}

function buttonClick(number) {
    console.log('Button clicked: ' + number);
    console.log(Date.now());



    
    //socket.emit('attack', sessionID);
}

window.buttonClick = buttonClick;