class UIState {
    constructor() {
        this.selectedJudgeIndex = 0;
        this.currentScreen = 'lobby-screen';
        this.loadingStates = new Set();
    }

    setSelectedJudge(index) {
        this.selectedJudgeIndex = index;
    }

    getSelectedJudge() {
        return this.selectedJudgeIndex;
    }

    setCurrentScreen(screenId) {
        this.currentScreen = screenId;
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    addLoadingState(elementId) {
        this.loadingStates.add(elementId);
    }

    removeLoadingState(elementId) {
        this.loadingStates.delete(elementId);
    }

    isLoading(elementId) {
        return this.loadingStates.has(elementId);
    }
}

