class PlayerManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    findNextNonJudgePlayer() {
        const judgeId = this.gameState.getCurrentJudge().id;
        
        do {
            this.gameState.currentPlayerTurn = (this.gameState.currentPlayerTurn + 1) % this.gameState.players.length;
        } while (this.gameState.players[this.gameState.currentPlayerTurn].id === judgeId);

        return this.gameState.getCurrentPlayer();
    }

    findFirstNonJudgePlayer() {
        const judgeId = this.gameState.getCurrentJudge().id;
        
        this.gameState.currentPlayerTurn = 0;
        while (this.gameState.players[this.gameState.currentPlayerTurn].id === judgeId) {
            this.gameState.currentPlayerTurn++;
        }

        return this.gameState.getCurrentPlayer();
    }

    isCurrentPlayerJudge() {
        const currentPlayer = this.gameState.getCurrentPlayer();
        const judge = this.gameState.getCurrentJudge();
        return currentPlayer.id === judge.id;
    }
}