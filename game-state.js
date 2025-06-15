class GameState {
    constructor() {
        this.players = [];
        this.currentRound = 1;
        this.maxRounds = 5;
        this.scoringMethod = 10; // 10, 5, or 'best'
        this.currentJudgeIndex = 0;
        this.gameMode = 'rotating'; // 'rotating' or 'fixed'
        this.scores = {};
        this.currentMeme = null;
        this.submissions = {};
        this.currentGameState = 'lobby'; // 'lobby', 'selecting', 'judging', 'results'
        this.currentPlayerTurn = 0;
        this.playerCaptions = {};
    }

    initializePlayers(playerNames, selectedJudgeIndex = 0) {
        this.players = [];
        playerNames.forEach((name, index) => {
            this.players.push({
                id: index + 1,
                name: name.trim() || `Player ${index + 1}`,
                score: 0
            });
        });

        // Set the selected judge
        this.currentJudgeIndex = selectedJudgeIndex;

        // Initialize scores
        this.scores = {};
        this.players.forEach(player => {
            this.scores[player.id] = 0;
        });
    }

    getCurrentJudge() {
        return this.players[this.currentJudgeIndex];
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerTurn];
    }

    isPlayerJudge(playerId) {
        return playerId === this.players[this.currentJudgeIndex].id;
    }

    addSubmission(playerId, caption) {
        this.submissions[playerId] = caption;
    }

    getAllSubmissionsReceived() {
        const nonJudgeCount = this.players.length - 1;
        return Object.keys(this.submissions).length >= nonJudgeCount;
    }

    addRoundScores(roundScores) {
        Object.entries(roundScores).forEach(([playerId, score]) => {
            this.scores[parseInt(playerId)] += score;
        });
    }

    nextRound() {
        if (this.currentRound >= this.maxRounds) {
            return false; // Game ended
        }

        this.currentRound++;
        this.submissions = {};
        
        // Rotate judge if in rotating mode
        if (this.gameMode === 'rotating') {
            this.currentJudgeIndex = (this.currentJudgeIndex + 1) % this.players.length;
        }

        return true; // Continue game
    }

    getSortedPlayersByScore() {
        return [...this.players].sort((a, b) => this.scores[b.id] - this.scores[a.id]);
    }

    reset() {
        this.currentRound = 1;
        this.currentJudgeIndex = 0;
        this.submissions = {};
        this.currentGameState = 'lobby';
        this.currentPlayerTurn = 0;
        this.playerCaptions = {};
        this.scores = {};
        this.maxRounds = 5;
        this.scoringMethod = 10; // 10, 5, or 'best'
    }
}