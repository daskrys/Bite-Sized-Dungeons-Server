/** Data model for validating and modifying game states. */
export default class GameState {
    constructor() {

        this.players = {};
        this.enemyHealth = 5000;
        this.lastModified = 0;
        this.lobbyFull = false;

        /* TODO: If this ends up being a server-only implementation, consider
         * adding the mutex locking functionality here */
    }

    addPlayer(session) {
        
        if(Object.keys(this.players).length >= 4 && this.players[session] == undefined) { 
            this.lobbyFull = true;
        }

        if (this.lobbyFull == false) {
            this.players[session] = { 
                skills: [
                    {
                        type: "Attack",
                        skillCooldown: 0,
                        cooldown: 2000
                    },
                    {
                        type: "Heal",
                        skillCooldown: 0,
                        cooldown: 3000
                    },
                    {
                        type: "Draining Blow",
                        skillCooldown: 15,
                        cooldown: 4000
                    },
                    {
                        type: "Rampage",
                        skillCooldown: 20,
                        cooldown: 5000
                    }
                ],
                maxHealth: 100,
                health: 100,
                attack: 10,
                cooldown: Date.now(),
                playerNumber: Object.keys(this.players).length + 1,
                room: 1
            };
        }
    }

    handleAction(action, session) { 
        if (this.players[session] == undefined) {
            console.log('Player not found');
            
            return;
        }

        const startTime = this.players[session].cooldown;
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        
    }

    updateEnemyHealth(damage) {
        this.enemyHealth -= damage;
    }

    clone() {
        let newState = new GameState();

        newState.players = [ ...this.players ];
        newState.enemies = [ ...this.enemies ];

        return newState;
    }
    /** Convenience function to get an entity and validate type and index */
    getEntity(type, index) {
        if (type == 'player' && this.players.length > index)
            return this.players[index];
        
        if (type == 'enemy' && this.enemies.length > index)
            return this.enemies[index];
    }
}
