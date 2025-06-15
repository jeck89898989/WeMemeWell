class UIAnimations {
    addBounceAnimation(element) {
        element.classList.add('bounce-in');
        setTimeout(() => element.classList.remove('bounce-in'), 600);
    }

    addFadeAnimation(element) {
        element.classList.add('fade-in');
        setTimeout(() => element.classList.remove('fade-in'), 500);
    }

    showElementWithAnimation(element) {
        element.style.display = 'block';
        this.addFadeAnimation(element);
    }

    hideElementWithAnimation(element) {
        element.classList.add('fade-out');
        setTimeout(() => {
            element.style.display = 'none';
            element.classList.remove('fade-out');
        }, 300);
    }
}

