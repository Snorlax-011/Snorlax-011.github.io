/**
 * Animation helpers for My Learning Progress (BUG-FIXED)
 */

class Animations {
    typeCommands(commands) {
        if (!Array.isArray(commands)) {
            console.warn('typeCommands: commands must be an array');
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            let index = 0;
            const typeNext = () => {
                if (index < commands.length) {
                    const command = commands[index];
                    if (command && command.id && command.text) {
                        this.typeText(document.getElementById(command.id), command.text, command.speed || 50).then(() => {
                            index++;
                            typeNext();
                        }).catch((error) => {
                            console.warn('Error typing command:', error);
                            index++;
                            typeNext();
                        });
                    } else {
                        index++;
                        typeNext();
                    }
                } else {
                    resolve();
                }
            };
            typeNext();
        });
    }

    typeText(element, text, speed = 50) {
        return new Promise(resolve => {
            if (!element || typeof text !== 'string') {
                console.warn('typeText: invalid element or text');
                resolve();
                return;
            }

            let i = 0;
            const interval = setInterval(() => {
                try {
                    element.textContent += text.charAt(i);
                    i++;
                    if (i >= text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                } catch (error) {
                    console.warn('Error during typing animation:', error);
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    animateCounter(element, start, end, duration = 1500) {
        if (!element || typeof start !== 'number' || typeof end !== 'number') {
            console.warn('animateCounter: invalid parameters');
            return;
        }

        try {
            const range = end - start;
            let current = start;
            const increment = end > start ? 1 : -1;
            const stepTime = Math.abs(Math.floor(duration / range)) || 50;
            
            const timer = setInterval(() => {
                current += increment;
                element.textContent = current;
                if (current === end) {
                    clearInterval(timer);
                }
            }, stepTime);
        } catch (error) {
            console.warn('Error in animateCounter:', error);
        }
    }

    // Learning progress animation
    animateProgressBar(element, targetWidth, duration = 1000) {
        if (!element || typeof targetWidth !== 'number') {
            console.warn('animateProgressBar: invalid parameters');
            return;
        }

        try {
            let startWidth = 0;
            const increment = targetWidth / (duration / 16); // 60fps
            const timer = setInterval(() => {
                startWidth += increment;
                if (startWidth >= targetWidth) {
                    startWidth = targetWidth;
                    clearInterval(timer);
                }
                element.style.width = Math.min(100, Math.max(0, startWidth)) + '%';
            }, 16);
        } catch (error) {
            console.warn('Error in animateProgressBar:', error);
        }
    }

    // Fade in animation for sections
    fadeInSection(element, delay = 0) {
        if (!element) {
            console.warn('fadeInSection: invalid element');
            return;
        }

        try {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 50);
            }, delay);
        } catch (error) {
            console.warn('Error in fadeInSection:', error);
        }
    }

    // Stagger animation for multiple elements
    staggerAnimation(elements, animationFunction, staggerDelay = 100) {
        if (!elements || !animationFunction) {
            console.warn('staggerAnimation: invalid parameters');
            return;
        }

        try {
            const elementsArray = Array.isArray(elements) ? elements : [elements];
            elementsArray.forEach((element, index) => {
                setTimeout(() => {
                    if (element && typeof animationFunction === 'function') {
                        animationFunction(element);
                    }
                }, index * staggerDelay);
            });
        } catch (error) {
            console.warn('Error in staggerAnimation:', error);
        }
    }
}
