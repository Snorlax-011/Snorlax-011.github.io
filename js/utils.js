/**
 * Utility functions for My Learning Progress (BUG-FIXED)
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
        try {
            const d = new Date(date);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return d.toLocaleDateString(undefined, options);
        } catch (error) {
            console.warn('Error formatting date:', error);
            return 'Unknown date';
        }
    }

    // Format relative time for learning progress
    formatRelativeTime(dateString) {
        if (!dateString) return 'Unknown';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now - date;
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInHours < 1) return 'Just updated';
            if (diffInHours < 24) return `${diffInHours}h ago`;
            if (diffInDays === 1) return 'Yesterday';
            if (diffInDays < 7) return `${diffInDays} days ago`;
            if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
            if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
            return `${Math.floor(diffInDays / 365)} years ago`;
        } catch (error) {
            console.warn('Error formatting relative time:', error);
            return 'Recently';
        }
    }

    // Calculate learning progress percentage
    calculateProgress(completed, total) {
        if (total === 0 || !completed || !total) return 0;
        return Math.round((completed / total) * 100);
    }

    // Format file sizes
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Scroll to element smoothly
    scrollToElement(element, offset = 80) {
        if (!element) return;
        
        try {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        } catch (error) {
            console.warn('Error scrolling to element:', error);
        }
    }

    // Check if element is in viewport
    isInViewport(element) {
        if (!element) return false;
        
        try {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        } catch (error) {
            console.warn('Error checking viewport:', error);
            return false;
        }
    }

    // Safe DOM query selector
    safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn('Error querying selector:', selector, error);
            return null;
        }
    }

    // Safe DOM query selector all
    safeQuerySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn('Error querying selector all:', selector, error);
            return [];
        }
    }
}
