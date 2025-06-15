class UIComponents {
    constructor(uiState, uiAnimations) {
        this.uiState = uiState;
        this.animations = uiAnimations;
    }

    generatePlayerInputs() {
        const numPlayers = parseInt(document.getElementById('num-players').value);
        const container = document.getElementById('player-names');
        const judgeSelection = document.getElementById('judge-selection');
        
        // Add loading skeleton
        container.innerHTML = '<div class="skeleton" style="height: 48px; margin-bottom: 12px;"></div>'.repeat(numPlayers);
        
        // Simulate brief loading for smooth UX
        setTimeout(() => {
            container.innerHTML = '';

            for (let i = 1; i <= numPlayers; i++) {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-input fade-in';
                playerDiv.style.animationDelay = `${i * 0.1}s`;
                playerDiv.innerHTML = `
                    <input type="text" placeholder="Enter Player ${i} name..." id="player-${i}" maxlength="20">
                    <button type="button" class="judge-btn ${i === 1 ? 'selected' : ''}" data-player-index="${i - 1}" onclick="window.game.uiManager.selectJudge(${i - 1})">
                        ${i === 1 ? '👑 Judge' : 'Set Judge'}
                    </button>
                `;
                container.appendChild(playerDiv);
            }

            // Reset selected judge to first player and show selection
            this.uiState.setSelectedJudge(0);
            this.updateJudgeSelection();
            judgeSelection.style.display = 'block';
        }, 200);
    }

    updateJudgeSelection() {
        const playerNameInput = document.getElementById(`player-${this.uiState.getSelectedJudge() + 1}`);
        const selectedJudgeName = document.getElementById('selected-judge-name');
        
        if (playerNameInput && selectedJudgeName) {
            const playerName = playerNameInput.value.trim() || `Player ${this.uiState.getSelectedJudge() + 1}`;
            selectedJudgeName.textContent = playerName;
            this.animations.addBounceAnimation(selectedJudgeName);
        }
    }

    displayMeme(meme) {
        const memeImage = document.getElementById('meme-image');
        const memeVideo = document.getElementById('meme-video');
        const container = document.getElementById('meme-container');
        
        // Add loading state
        container.classList.add('pulse');

        if (meme.type === 'image') {
            memeImage.onload = () => {
                container.classList.remove('pulse');
                this.animations.addBounceAnimation(memeImage);
            };
            memeImage.src = meme.url;
            memeImage.alt = meme.alt;
            memeImage.style.display = 'block';
            memeVideo.style.display = 'none';
        } else if (meme.type === 'video') {
            memeVideo.onloadeddata = () => {
                container.classList.remove('pulse');
                this.animations.addBounceAnimation(memeVideo);
            };
            memeVideo.src = meme.url;
            memeVideo.style.display = 'block';
            memeImage.style.display = 'none';
        }
    }

    showCaptionOptions(captions, playerId, onCaptionSelect) {
        const container = document.getElementById('caption-options');
        
        // Show skeleton loading
        container.innerHTML = '<div class="skeleton" style="height: 60px; margin-bottom: 12px;"></div>'.repeat(3);
        
        setTimeout(() => {
            container.innerHTML = '';

            captions.forEach((caption, index) => {
                const button = document.createElement('button');
                button.className = 'caption-btn fade-in';
                button.style.animationDelay = `${index * 0.1}s`;
                button.textContent = caption;
                button.addEventListener('click', () => {
                    onCaptionSelect(playerId, caption, button);
                });
                container.appendChild(button);
            });
        }, 300);
    }

    displaySubmissionsForJudging(submissions, onScoreChange) {
        const container = document.getElementById('submissions-to-judge');
        
        // Show loading state
        const numSubmissions = Object.keys(submissions).length;
        container.innerHTML = '<div class="skeleton" style="height: 120px; margin-bottom: 16px;"></div>'.repeat(numSubmissions);

        setTimeout(() => {
            container.innerHTML = '';

            // Get scoring method from game state
            const scoringMethod = window.game ? window.game.gameState.scoringMethod : 10;

            if (scoringMethod === 'best') {
                this.displayBestMemeSelection(submissions, onScoreChange);
            } else {
                this.displayPointsBasedJudging(submissions, onScoreChange, scoringMethod);
            }

            document.getElementById('finish-judging').style.display = 'none';
        }, 400);
    }

    displayBestMemeSelection(submissions, onScoreChange) {
        const container = document.getElementById('submissions-to-judge');
        
        // Shuffle submissions to anonymize them
        const submissionEntries = Object.entries(submissions);
        const shuffledSubmissions = submissionEntries.sort(() => Math.random() - 0.5);

        shuffledSubmissions.forEach(([playerId, caption], index) => {
            const submissionDiv = document.createElement('div');
            submissionDiv.className = 'best-meme-item fade-in';
            submissionDiv.style.animationDelay = `${index * 0.1}s`;
            submissionDiv.dataset.playerId = playerId;
            submissionDiv.innerHTML = `
                <div class="best-meme-text">${caption}</div>
            `;
            
            submissionDiv.addEventListener('click', () => {
                // Clear previous selections with animation
                document.querySelectorAll('.best-meme-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Select this item with animation
                submissionDiv.classList.add('selected');
                this.animations.addBounceAnimation(submissionDiv);
                onScoreChange();
            });
            
            container.appendChild(submissionDiv);
        });
    }

    displayPointsBasedJudging(submissions, onScoreChange, maxScore) {
        const container = document.getElementById('submissions-to-judge');

        // Shuffle submissions to anonymize them
        const submissionEntries = Object.entries(submissions);
        const shuffledSubmissions = submissionEntries.sort(() => Math.random() - 0.5);

        shuffledSubmissions.forEach(([playerId, caption], index) => {
            const submissionDiv = document.createElement('div');
            submissionDiv.className = 'submission-item fade-in';
            submissionDiv.style.animationDelay = `${index * 0.1}s`;
            submissionDiv.innerHTML = `
                <div class="submission-text">${caption}</div>
                <div class="score-circles-container">
                    <label>Score:</label>
                    <div class="score-circles" data-player-id="${playerId}">
                        ${Array.from({length: maxScore}, (_, i) => i + 1).map(score => 
                            `<button type="button" class="score-circle" data-score="${score}">${score}</button>`
                        ).join('')}
                    </div>
                </div>
            `;
            container.appendChild(submissionDiv);

            // Add click event listeners to score circles
            const circles = submissionDiv.querySelectorAll('.score-circle');
            circles.forEach(circle => {
                circle.addEventListener('click', (e) => {
                    const score = parseInt(e.target.dataset.score);
                    const playerIdAttr = e.target.closest('.score-circles').dataset.playerId;
                    
                    // Clear previous selections in this group
                    circles.forEach(c => c.classList.remove('selected'));
                    
                    // Select clicked circle with animation
                    e.target.classList.add('selected');
                    this.animations.addBounceAnimation(e.target);
                    
                    // Store the score
                    e.target.closest('.score-circles').dataset.selectedScore = score;
                    
                    onScoreChange();
                });
            });
        });
    }

    displayRoundResults(results) {
        const container = document.getElementById('round-results');
        
        // Show loading skeleton
        container.innerHTML = '<div class="skeleton" style="height: 80px; margin-bottom: 12px;"></div>'.repeat(results.length);
        
        setTimeout(() => {
            container.innerHTML = '';

            results.forEach((result, index) => {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'result-item fade-in';
                resultDiv.style.animationDelay = `${index * 0.1}s`;
                
                // Add trophy for winner
                const trophy = index === 0 ? '🏆 ' : '';
                const medal = index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '';
                
                resultDiv.innerHTML = `
                    <div class="result-player">${trophy}${medal}${result.player.name}</div>
                    <div class="result-caption">"${result.caption}"</div>
                    <div class="result-score">${result.score} pts</div>
                `;
                container.appendChild(resultDiv);
            });
        }, 300);
    }

    displayScoreboard(players, scores, isFinal = false) {
        // Update header with animation
        const header = document.querySelector('.scores-header h2');
        header.textContent = isFinal ? '🏆 Final Scores!' : '📊 Current Scores';
        this.animations.addBounceAnimation(header);
        
        // Display scores with loading animation
        const container = document.getElementById('scoreboard');
        container.innerHTML = '<div class="skeleton" style="height: 70px; margin-bottom: 12px;"></div>'.repeat(players.length);
        
        setTimeout(() => {
            container.innerHTML = '';

            players.forEach((player, index) => {
                const scoreDiv = document.createElement('div');
                scoreDiv.className = `score-item fade-in ${index === 0 && isFinal ? 'winner' : ''}`;
                scoreDiv.style.animationDelay = `${index * 0.1}s`;
                
                let rankEmoji = '';
                if (isFinal) {
                    rankEmoji = index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
                }
                
                scoreDiv.innerHTML = `
                    <div class="player-name">
                        ${rankEmoji} ${player.name}
                    </div>
                    <div class="player-score">${scores[player.id]} pts</div>
                `;
                container.appendChild(scoreDiv);
            });
        }, 200);

        // Update back button
        const backButton = document.getElementById('back-to-game');
        if (isFinal) {
            backButton.innerHTML = '🎮 New Game';
            backButton.onclick = () => location.reload();
        } else {
            backButton.innerHTML = '← Back to Game';
        }
    }

    displayMemeList(memes) {
        const container = document.getElementById('meme-list');
        container.innerHTML = '';

        // Add local storage stats header
        if (window.game && window.game.memeManager.getLocalMemeStats) {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'local-storage-stats';
            statsDiv.innerHTML = `
                <div class="stats-header">📁 Local Storage Status</div>
                <div id="storage-stats-content">Loading...</div>
            `;
            container.appendChild(statsDiv);

            // Load and display stats
            window.game.memeManager.getLocalMemeStats().then(stats => {
                const totalSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);
                document.getElementById('storage-stats-content').innerHTML = `
                    <span>Total: ${stats.total} files (${totalSizeMB} MB)</span>
                `;
            });
        }

        Object.entries(memes).forEach(([pack, memeArray]) => {
            memeArray.forEach((meme, index) => {
                const memeDiv = document.createElement('div');
                memeDiv.className = 'content-item fade-in';
                
                const localIcon = meme.isLocal ? '📁 ' : '🌐 ';
                const deleteDataset = meme.isLocal ? `data-meme-id="${meme.id}"` : `data-pack="${pack}" data-index="${index}"`;
                
                memeDiv.innerHTML = `
                    <div class="meme-item">
                        <img src="${meme.url}" alt="${meme.alt}" class="meme-thumbnail" />
                        <div class="meme-info">
                            <div class="meme-pack-tag">${localIcon}${pack}</div>
                            <div class="text-sm text-muted">${meme.alt}</div>
                        </div>
                    </div>
                    <button class="delete-btn" ${deleteDataset}>🗑️</button>
                `;
                container.appendChild(memeDiv);
            });
        });
    }

    displayCaptionList(captions) {
        const container = document.getElementById('caption-list');
        container.innerHTML = '';

        captions.forEach((caption, index) => {
            const captionDiv = document.createElement('div');
            captionDiv.className = 'content-item fade-in';
            captionDiv.innerHTML = `
                <div class="caption-text">${caption}</div>
                <button class="delete-btn" data-index="${index}">🗑️</button>
            `;
            container.appendChild(captionDiv);
        });
    }
}