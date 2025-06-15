class Game {
    constructor() {
        this.gameState = new GameState();
        this.memeManager = new MemeManager();
        this.uiManager = new UIManager();
        this.playerManager = new PlayerManager(this.gameState);
        this.themeManager = new MemeThemeManager();
        this.setupEventListeners();
        this.loadUserPreferences();
    }

    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
    }

    loadUserPreferences() {
        // Load custom content
        this.memeManager.loadCustomContent();
        
        // Theme manager handles its own loading
        this.themeManager.loadSavedTheme();
    }

    startGame() {
        const playerNames = this.uiManager.getPlayerNames();
        const gameMode = this.uiManager.getGameMode();
        const numRounds = this.uiManager.getNumRounds();
        const scoringMethod = this.uiManager.getScoringMethod();
        const memePack = this.uiManager.getMemePack();
        const selectedJudgeIndex = this.uiManager.getSelectedJudgeIndex();

        if (playerNames.length < 2) {
            alert('Please enter at least 2 players');
            return;
        }

        this.gameState.initializePlayers(playerNames, selectedJudgeIndex);
        this.gameState.gameMode = gameMode;
        this.gameState.maxRounds = numRounds;
        this.gameState.scoringMethod = scoringMethod;
        this.memeManager.setMemePack(memePack);

        this.startRound();
    }

    startRound() {
        this.gameState.currentGameState = 'selecting';
        this.gameState.currentMeme = this.memeManager.getRandomMeme();
        
        // Generate captions for all non-judge players
        const judgeId = this.gameState.getCurrentJudge().id;
        this.gameState.playerCaptions = this.memeManager.generateCaptionsForPlayers(
            this.gameState.players, 
            judgeId
        );

        this.uiManager.showScreen('game-screen');
        this.uiManager.displayMeme(this.gameState.currentMeme);
        this.uiManager.updateRoundInfo(this.gameState.currentRound, this.gameState.getCurrentJudge().name);

        // Start with first non-judge player
        this.playerManager.findFirstNonJudgePlayer();
        this.showCurrentPlayerTurn();
    }

    showCurrentPlayerTurn() {
        const currentPlayer = this.gameState.getCurrentPlayer();
        const isJudge = this.playerManager.isCurrentPlayerJudge();

        if (isJudge) {
            this.startJudging();
            return;
        }

        // Show caption selection for current player
        this.uiManager.showSection('caption-selection');
        this.uiManager.updateStatusMessage(`${currentPlayer.name}'s turn - Choose your caption!`);
        
        const playerCaptions = this.gameState.playerCaptions[currentPlayer.id];
        this.uiManager.showCaptionOptions(playerCaptions, currentPlayer.id, (playerId, caption, buttonElement) => {
            this.selectCaption(playerId, caption, buttonElement);
        });
    }

    selectCaption(playerId, caption, buttonElement) {
        this.gameState.addSubmission(playerId, caption);
        this.uiManager.selectCaptionButton(buttonElement);
        this.uiManager.disableCaptionButtons();
        
        setTimeout(() => {
            if (this.gameState.getAllSubmissionsReceived()) {
                this.startJudging();
            } else {
                this.playerManager.findNextNonJudgePlayer();
                this.showCurrentPlayerTurn();
            }
        }, 1000);
    }

    startJudging() {
        this.gameState.currentGameState = 'judging';
        const judge = this.gameState.getCurrentJudge();
        
        this.uiManager.showSection('judging-section');
        this.uiManager.updateStatusMessage(`${judge.name}'s turn to judge!`);
        this.uiManager.displaySubmissionsForJudging(this.gameState.submissions, () => {
            this.checkJudgingComplete();
        });
    }

    checkJudgingComplete() {
        const scores = this.uiManager.getJudgingScores();
        const expectedScores = Object.keys(this.gameState.submissions).length;
        
        if (Object.keys(scores).length >= expectedScores) {
            this.uiManager.showFinishJudgingButton();
        }
    }

    finishJudging() {
        const roundScores = this.uiManager.getJudgingScores();
        this.gameState.addRoundScores(roundScores);
        
        this.showRoundResults(roundScores);
    }

    showRoundResults(roundScores) {
        this.gameState.currentGameState = 'results';
        this.uiManager.showSection('results-section');
        
        // Prepare results for display
        const results = [];
        Object.entries(this.gameState.submissions).forEach(([playerId, caption]) => {
            const player = this.gameState.players.find(p => p.id === parseInt(playerId));
            const score = roundScores[playerId] || 0;
            results.push({ player, caption, score });
        });
        
        // Sort by score descending
        results.sort((a, b) => b.score - a.score);
        
        this.uiManager.displayRoundResults(results);
        this.uiManager.updateNextButtonText(this.gameState.currentRound >= this.gameState.maxRounds);
    }

    nextRound() {
        const canContinue = this.gameState.nextRound();
        
        if (canContinue) {
            this.startRound();
        } else {
            this.showFinalScores();
        }
    }

    showFinalScores() {
        const sortedPlayers = this.gameState.getSortedPlayersByScore();
        this.uiManager.displayScoreboard(sortedPlayers, this.gameState.scores, true);
        this.uiManager.showScreen('scores-screen');
    }

    showScores() {
        const sortedPlayers = this.gameState.getSortedPlayersByScore();
        this.uiManager.displayScoreboard(sortedPlayers, this.gameState.scores, false);
        this.uiManager.showScreen('scores-screen');
    }

    backToGame() {
        this.uiManager.showScreen('game-screen');
    }

    exitGame() {
        if (confirm('Are you sure you want to exit the game? All progress will be lost.')) {
            this.gameState.reset();
            this.uiManager.showScreen('lobby-screen');
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
    window.game.uiManager.generatePlayerInputs(); // Generate initial player inputs
});