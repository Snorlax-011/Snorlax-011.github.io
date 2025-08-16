/**
 * Utility functions
 */
class Utils {
    throttle(fn, wait) {
        let isThrottled = false, args, context;
        return function () {
            if (isThrottled) {
                args = arguments;
                context = this;
                return;
            }
            fn.apply(this, arguments);
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
                if (args) {
                    fn.apply(context, args);
                    args = context = null;
                }
            }, wait);
        };
    }
    debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }
    formatDate(date) {
        const d = new Date(date);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return d.toLocaleDateString(undefined, options);
    }
}
