/**
 * Animation helpers
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
}
