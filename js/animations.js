/**
 * Animation helpers for My Learning Progress
 */

class Animations {
    typeCommands(commands) {
        let index = 0;
        const typeNext = () => {
            if (index < commands.length) {
                const { id, text, speed } = commands[index];
                this.typeText(document.getElementById(id), text, speed).then(() => {
                    index++;
                    typeNext();
                });
            }
        };
        typeNext();
        return Promise.resolve();
    }

    typeText(element, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    animateCounter(element, start, end, duration) {
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Learning progress animation
    animateProgressBar(element, targetWidth, duration = 1000) {
        let startWidth = 0;
        const increment = targetWidth / (duration / 16); // 60fps
        const timer = setInterval(() => {
            startWidth += increment;
            if (startWidth >= targetWidth) {
                startWidth = targetWidth;
                clearInterval(timer);
            }
            element.style.width = startWidth + '%';
        }, 16);
    }

    // Fade in animation for sections
    fadeInSection(element, delay = 0) {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 50);
        }, delay);
    }
}
