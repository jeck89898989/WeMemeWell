class UIManager {
    constructor() {
        this.uiState = new UIState();
        this.animations = new UIAnimations();
        this.components = new UIComponents(this.uiState, this.animations);
        this.events = new UIEvents(this.uiState, this.components, this.animations);
    }

    getSelectedJudgeIndex() {
        return this.uiState.getSelectedJudge();
    }

    updateRoundInfo(currentRound, judgeName) {
        document.getElementById('round-counter').textContent = `Round ${currentRound}`;
        document.getElementById('judge-info').textContent = `Judge: ${judgeName}`;
    }

    updateStatusMessage(message) {
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
        this.animations.addBounceAnimation(statusElement);
    }

    disableCaptionButtons() {
        document.querySelectorAll('.caption-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.disabled = true;
        });
    }

    selectCaptionButton(buttonElement) {
        buttonElement.classList.add('selected');
        this.animations.addBounceAnimation(buttonElement);
    }

    // Delegate methods to components for backward compatibility
    generatePlayerInputs() {
        this.components.generatePlayerInputs();
    }

    selectJudge(playerIndex) {
        this.events.selectJudge(playerIndex);
    }

    displayMeme(meme) {
        this.components.displayMeme(meme);
    }

    showCaptionOptions(captions, playerId, onCaptionSelect) {
        this.components.showCaptionOptions(captions, playerId, onCaptionSelect);
    }

    displaySubmissionsForJudging(submissions, onScoreChange) {
        this.components.displaySubmissionsForJudging(submissions, onScoreChange);
    }

    displayRoundResults(results) {
        this.components.displayRoundResults(results);
    }

    displayScoreboard(players, scores, isFinal) {
        this.components.displayScoreboard(players, scores, isFinal);
    }

    // New utility methods for game flow
    getPlayerNames() {
        const numPlayers = parseInt(document.getElementById('num-players').value);
        const playerNames = [];
        
        for (let i = 1; i <= numPlayers; i++) {
            const input = document.getElementById(`player-${i}`);
            const name = input ? input.value.trim() : '';
            playerNames.push(name || `Player ${i}`);
        }
        
        return playerNames;
    }

    getGameMode() {
        return document.getElementById('game-mode').value;
    }

    getNumRounds() {
        return parseInt(document.getElementById('num-rounds').value);
    }

    getScoringMethod() {
        const value = document.getElementById('scoring-method').value;
        return value === 'best' ? 'best' : parseInt(value);
    }

    getMemePack() {
        return document.getElementById('meme-pack').value;
    }

    showScreen(screenId) {
        this.uiState.setCurrentScreen(screenId);
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    showSection(sectionId) {
        // Hide all game sections
        document.querySelectorAll('.caption-section, .judging-section, .results-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the requested section
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            this.animations.addFadeAnimation(section);
        }
    }

    getJudgingScores() {
        const scores = {};
        
        // Check if it's best meme scoring
        const selectedBest = document.querySelector('.best-meme-item.selected');
        if (selectedBest) {
            const playerId = selectedBest.dataset.playerId;
            scores[playerId] = 1; // Winner gets 1 point in best mode
            return scores;
        }
        
        // Check point-based scoring
        document.querySelectorAll('.score-circles').forEach(container => {
            const playerId = container.dataset.playerId;
            const selectedScore = container.dataset.selectedScore;
            if (selectedScore) {
                scores[playerId] = parseInt(selectedScore);
            }
        });
        
        return scores;
    }

    showFinishJudgingButton() {
        const button = document.getElementById('finish-judging');
        if (button) {
            button.style.display = 'block';
            this.animations.addBounceAnimation(button);
        }
    }

    updateNextButtonText(isLastRound) {
        const button = document.getElementById('next-round');
        if (button) {
            button.textContent = isLastRound ? '🏆 View Final Scores' : 'Next Round ➡️';
        }
    }
}