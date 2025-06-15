class UIEvents {
    constructor(uiState, uiComponents, uiAnimations) {
        this.uiState = uiState;
        this.components = uiComponents;
        this.animations = uiAnimations;
        this.themeManager = new MemeThemeManager();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Lobby screen
        document.getElementById('num-players').addEventListener('change', (e) => {
            this.components.generatePlayerInputs();
        });

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            this.hideSettings();
        });

        // Theme selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTheme(e.currentTarget.dataset.theme);
            });
        });

        // Meme management
        document.getElementById('add-meme-btn').addEventListener('click', () => {
            this.addMeme();
        });

        document.getElementById('upload-meme-btn').addEventListener('click', () => {
            this.uploadLocalMemes();
        });

        document.getElementById('download-all-memes-btn').addEventListener('click', () => {
            this.downloadAllMemes();
        });

        document.getElementById('meme-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                this.deleteMeme(e.target.dataset.pack, parseInt(e.target.dataset.index));
            }
        });

        // Caption management
        document.getElementById('add-caption-btn').addEventListener('click', () => {
            this.addCaption();
        });

        document.getElementById('caption-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                this.deleteCaption(parseInt(e.target.dataset.index));
            }
        });

        // Game screen
        document.getElementById('scores-btn').addEventListener('click', () => {
            if (window.game) window.game.showScores();
        });

        document.getElementById('exit-game-btn').addEventListener('click', () => {
            if (window.game) window.game.exitGame();
        });

        document.getElementById('next-round').addEventListener('click', () => {
            if (window.game) window.game.nextRound();
        });

        document.getElementById('finish-judging').addEventListener('click', () => {
            if (window.game) window.game.finishJudging();
        });

        // Scores screen
        document.getElementById('back-to-game').addEventListener('click', () => {
            if (window.game) window.game.backToGame();
        });
    }

    showSettings() {
        this.uiState.setCurrentScreen('settings-screen');
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById('settings-screen').classList.add('active');
        this.loadSettingsData();
    }

    hideSettings() {
        this.uiState.setCurrentScreen('lobby-screen');
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById('lobby-screen').classList.add('active');
    }

    loadSettingsData() {
        if (window.game) {
            this.components.displayMemeList(window.game.memeManager.memePacks);
            this.components.displayCaptionList(window.game.memeManager.captionPool);
        }
        
        // Update theme button states
        const currentTheme = this.themeManager.getCurrentTheme();
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === currentTheme) {
                btn.classList.add('active');
            }
        });
    }

    selectTheme(themeName) {
        this.themeManager.applyTheme(themeName);
        
        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === themeName) {
                btn.classList.add('active');
                this.animations.addBounceAnimation(btn);
            }
        });
    }

    addMeme() {
        const url = document.getElementById('new-meme-url').value.trim();
        const alt = document.getElementById('new-meme-alt').value.trim();
        const pack = document.getElementById('new-meme-pack').value;

        if (!url || !alt) {
            alert('Please enter both URL and description for the meme.');
            return;
        }

        if (window.game) {
            window.game.memeManager.addMeme(pack, { type: 'image', url, alt });
            this.components.displayMemeList(window.game.memeManager.memePacks);
            
            // Clear form
            document.getElementById('new-meme-url').value = '';
            document.getElementById('new-meme-alt').value = '';
        }
    }

    async uploadLocalMemes() {
        const fileInput = document.getElementById('meme-file-input');
        const description = document.getElementById('upload-meme-alt').value.trim();
        const pack = document.getElementById('upload-meme-pack').value;

        if (!fileInput.files.length) {
            alert('Please select at least one file to upload.');
            return;
        }

        const uploadBtn = document.getElementById('upload-meme-btn');
        uploadBtn.classList.add('loading');
        uploadBtn.textContent = 'Uploading...';

        try {
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                
                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                    continue;
                }

                // Validate file type
                if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                    alert(`File ${file.name} is not a supported image or video file.`);
                    continue;
                }

                const fileDescription = description || `Uploaded ${file.name}`;
                await window.game.memeManager.saveLocalMeme(file, pack, fileDescription);
            }

            // Clear form
            fileInput.value = '';
            document.getElementById('upload-meme-alt').value = '';

            // Refresh the meme list
            this.components.displayMemeList(window.game.memeManager.memePacks);

            // Show stats
            const stats = await window.game.memeManager.getLocalMemeStats();
            const totalSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);
            alert(`Successfully uploaded files! You now have ${stats.total} local memes (${totalSizeMB} MB total).`);

        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Error uploading files. Please try again.');
        } finally {
            uploadBtn.classList.remove('loading');
            uploadBtn.textContent = '📁 Upload Local Files';
        }
    }

    async downloadAllMemes() {
        const downloadBtn = document.getElementById('download-all-memes-btn');
        downloadBtn.classList.add('loading');
        downloadBtn.textContent = 'Preparing Download...';

        try {
            if (window.game && window.game.memeManager) {
                const allMemes = [];
                
                // Collect all memes from all packs
                Object.entries(window.game.memeManager.memePacks).forEach(([packName, memes]) => {
                    memes.forEach((meme, index) => {
                        if (!meme.isLocal) { // Only download external memes
                            allMemes.push({
                                url: meme.url,
                                filename: `${packName}_meme_${index + 1}.jpg`,
                                alt: meme.alt
                            });
                        }
                    });
                });

                let downloadedCount = 0;
                const totalMemes = allMemes.length;

                // Download each meme individually
                for (const meme of allMemes) {
                    try {
                        downloadBtn.textContent = `Downloading ${downloadedCount + 1}/${totalMemes}...`;
                        
                        const response = await fetch(meme.url);
                        const blob = await response.blob();
                        
                        // Create download link
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = meme.filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        
                        downloadedCount++;
                        
                        // Small delay to prevent overwhelming the browser
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                    } catch (error) {
                        console.error(`Failed to download ${meme.filename}:`, error);
                    }
                }

                alert(`Successfully initiated download of ${downloadedCount} memes! Check your downloads folder.`);
                
            } else {
                alert('Meme manager not available. Please try again.');
            }
        } catch (error) {
            console.error('Error downloading memes:', error);
            alert('Error downloading memes. Please try again.');
        } finally {
            downloadBtn.classList.remove('loading');
            downloadBtn.textContent = '📁 Download All Memes';
        }
    }

    deleteMeme(pack, index) {
        if (window.game && confirm('Are you sure you want to delete this meme?')) {
            window.game.memeManager.deleteMeme(pack, index);
            this.components.displayMemeList(window.game.memeManager.memePacks);
        }
    }

    addCaption() {
        const caption = document.getElementById('new-caption').value.trim();

        if (!caption) {
            alert('Please enter a caption.');
            return;
        }

        if (window.game) {
            window.game.memeManager.addCaption(caption);
            this.components.displayCaptionList(window.game.memeManager.captionPool);
            
            // Clear form
            document.getElementById('new-caption').value = '';
        }
    }

    deleteCaption(index) {
        if (window.game && confirm('Are you sure you want to delete this caption?')) {
            window.game.memeManager.deleteCaption(index);
            this.components.displayCaptionList(window.game.memeManager.captionPool);
        }
    }

    selectJudge(playerIndex) {
        this.uiState.setSelectedJudge(playerIndex);
        
        // Update all judge buttons
        document.querySelectorAll('.judge-btn').forEach((btn, index) => {
            btn.classList.remove('selected');
            if (index === playerIndex) {
                btn.classList.add('selected');
                this.animations.addBounceAnimation(btn);
                btn.textContent = '👑 Judge';
            } else {
                btn.textContent = 'Set Judge';
            }
        });

        this.components.updateJudgeSelection();
    }
}