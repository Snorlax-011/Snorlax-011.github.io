/**
 * ===================================
 * MAIN APPLICATION SCRIPT
 * Advanced GitHub Integration System
 * ===================================
 */

class TechMasteryApp {
    constructor() {
        this.config = window.APP_CONFIG;
        this.github = new GitHubAPI();
        this.utils = new Utils();
        this.animations = new Animations();
        this.components = new Components();

        // State management
        this.state = {
            isLoaded: false,
            currentSection: 'home',
            repositories: [],
            filteredRepos: [],
            currentFilter: 'all',
            currentView: 'grid',
            searchQuery: '',
            user: null,
            stats: {},
            rateLimitInfo: {},
            lastUpdate: null
        };

        // Performance tracking
        this.performance = {
            startTime: performance.now(),
            apiCalls: 0,
            loadTime: 0,
            errors: []
        };

        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Tech-Mastery Application...');

            // Initialize components
            this.initializeEventListeners();
            this.initializeParticles();
            this.initializeIntersectionObserver();

            // Load GitHub data
            await this.loadGitHubData();

            // Initialize UI components
            this.initializeNavigation();
            this.initializeSearch();
            this.initializeFilters();
            this.initializeAnimations();

            // Hide loading screen
            this.hideLoadingScreen();

            console.log('✅ Application initialized successfully');
            this.performance.loadTime = performance.now() - this.performance.startTime;
            console.log(`⚡ Load time: ${this.performance.loadTime.toFixed(2)}ms`);

        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.handleError(error);
        }
    }

    /**
     * Load GitHub data with advanced error handling and caching
     */
    async loadGitHubData() {
        const loadingMessages = [
            'Connecting to GitHub API...',
            'Fetching repository data...',
            'Processing Tech-Mastery content...',
            'Analyzing project statistics...',
            'Preparing showcase...'
        ];

        let messageIndex = 0;
        const updateLoadingMessage = () => {
            const loadingElement = document.querySelector('.loading-message');
            if (loadingElement && messageIndex < loadingMessages.length) {
                loadingElement.textContent = loadingMessages[messageIndex];
                messageIndex++;
            }
        };

        const messageInterval = setInterval(updateLoadingMessage, 500);

        try {
            // Check for cached data
            const cachedData = this.getCachedData();
            if (cachedData && this.isCacheValid(cachedData.timestamp)) {
                console.log('📦 Using cached GitHub data');
                this.state.user = cachedData.user;
                this.state.repositories = cachedData.repositories;
                this.state.stats = cachedData.stats;
                clearInterval(messageInterval);
                return;
            }

            // Fetch user data
            updateLoadingMessage();
            this.state.user = await this.github.getUser();
            this.performance.apiCalls++;

            // Fetch repositories
            updateLoadingMessage();
            this.state.repositories = await this.github.getUserRepositories();
            this.performance.apiCalls++;

            // Fetch additional data for featured repository (Tech-Mastery)
            updateLoadingMessage();
            const techMasteryRepo = await this.github.getRepository('Snorlax-011', 'Tech-Mastery');
            if (techMasteryRepo) {
                // Mark as featured
                techMasteryRepo.featured = true;
                // Replace or add to repositories
                const existingIndex = this.state.repositories.findIndex(repo => repo.name === 'Tech-Mastery');
                if (existingIndex >= 0) {
                    this.state.repositories[existingIndex] = techMasteryRepo;
                } else {
                    this.state.repositories.unshift(techMasteryRepo);
                }
            }

            // Calculate statistics
            updateLoadingMessage();
            this.calculateStatistics();

            // Cache the data
            this.cacheData();

            clearInterval(messageInterval);

        } catch (error) {
            clearInterval(messageInterval);
            throw error;
        }
    }

    /**
     * Calculate comprehensive statistics
     */
    calculateStatistics() {
        const repos = this.state.repositories;

        this.state.stats = {
            totalRepos: repos.length,
            totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
            totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
            totalCommits: Math.floor(Math.random() * 1000) + 500, // Placeholder
            languages: this.getLanguageStatistics(repos),
            topics: this.getTopicStatistics(repos),
            recentActivity: this.getRecentActivity(repos)
        };

        console.log('📊 Statistics calculated:', this.state.stats);
    }

    /**
     * Get language statistics
     */
    getLanguageStatistics(repos) {
        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
        return Object.entries(languages)
            .map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / total) * 100),
                color: this.getLanguageColor(name)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top 8 languages
    }

    /**
     * Get topic statistics
     */
    getTopicStatistics(repos) {
        const topics = {};
        repos.forEach(repo => {
            if (repo.topics) {
                repo.topics.forEach(topic => {
                    topics[topic] = (topics[topic] || 0) + 1;
                });
            }
        });

        return Object.entries(topics)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }

    /**
     * Get recent activity
     */
    getRecentActivity(repos) {
        return repos
            .filter(repo => repo.updated_at)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 10)
            .map(repo => ({
                type: 'update',
                repo: repo.name,
                description: `Updated ${repo.name}`,
                time: repo.updated_at,
                url: repo.html_url
            }));
    }

    /**
     * Get language color
     */
    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'TypeScript': '#2b7489',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C': '#555555',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Dart': '#00B4AB'
        };
        return colors[language] || '#8b949e';
    }

    /**
     * Initialize particles.js background
     */
    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#ffffff' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.1, random: false },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#ffffff',
                        opacity: 0.1,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 140, line_linked: { opacity: 1 } },
                        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                        repulse: { distance: 100, duration: 0.4 },
                        push: { particles_nb: 4 },
                        remove: { particles_nb: 2 }
                    }
                },
                retina_detect: true
            });
        }
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Navigation
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigation();
            this.setupBackToTop();
            this.setupMobileMenu();
        });

        // Window events
        window.addEventListener('scroll', this.utils.throttle(() => {
            this.handleScroll();
        }, 16));

        window.addEventListener('resize', this.utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Setup navigation
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.setActiveNavLink(link);
                this.closeMobileMenu();
            });
        });
    }

    /**
     * Setup back to top button
     */
    setupBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    /**
     * Setup mobile menu
     */
    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');

        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;

        // Update navigation
        this.updateActiveSection();

        // Show/hide back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Hide/show navigation on scroll
        const nav = document.querySelector('.nav-header');
        if (nav) {
            if (scrollY > 100 && this.lastScrollY < scrollY) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
            this.lastScrollY = scrollY;
        }
    }

    /**
     * Update active section in navigation
     */
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current !== this.state.currentSection) {
            this.state.currentSection = current;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    /**
     * Scroll to section
     */
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Set active navigation link
     */
    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Update any responsive components
        this.updateResponsiveComponents();
    }

    /**
     * Initialize intersection observer for animations
     */
    initializeIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.triggerSectionAnimations(entry.target);
                }
            });
        }, options);

        // Observe elements
        const elementsToObserve = document.querySelectorAll('.stats-panel, .repo-showcase, .skill-category, .analytics-card');
        elementsToObserve.forEach(el => this.observer.observe(el));
    }

    /**
     * Trigger section-specific animations
     */
    triggerSectionAnimations(element) {
        if (element.classList.contains('stats-panel')) {
            this.animateCounters();
        }

        if (element.classList.contains('repo-showcase')) {
            this.displayRepositoryShowcase();
        }
    }

    /**
     * Initialize search functionality
     */
    initializeSearch() {
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.utils.debounce((e) => {
                this.state.searchQuery = e.target.value.toLowerCase();
                this.filterProjects();
            }, 300));
        }
    }

    /**
     * Initialize filter functionality
     */
    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.currentFilter = btn.dataset.filter;
                this.filterProjects();
            });
        });

        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.currentView = btn.dataset.view;
                this.updateProjectsView();
            });
        });
    }

    /**
     * Filter projects based on search and filters
     */
    filterProjects() {
        let filtered = [...this.state.repositories];

        // Apply search filter
        if (this.state.searchQuery) {
            filtered = filtered.filter(repo =>
                repo.name.toLowerCase().includes(this.state.searchQuery) ||
                (repo.description && repo.description.toLowerCase().includes(this.state.searchQuery)) ||
                (repo.language && repo.language.toLowerCase().includes(this.state.searchQuery)) ||
                (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(this.state.searchQuery)))
            );
        }

        // Apply category filter
        switch (this.state.currentFilter) {
            case 'featured':
                filtered = filtered.filter(repo => repo.featured || repo.stargazers_count > 0);
                break;
            case 'recent':
                filtered = filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 12);
                break;
            default:
                // 'all' - no additional filtering
                break;
        }

        this.state.filteredRepos = filtered;
        this.renderProjects();
    }

    /**
     * Update projects view (grid/list)
     */
    updateProjectsView() {
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.className = `projects-grid ${this.state.currentView}-view`;
        }
    }

    /**
     * Initialize typing animations
     */
    initializeAnimations() {
        const commands = [
            { id: 'cmd-1', text: "echo 'Welcome to my Tech-Mastery journey! 😉'", speed: 50 },
            { id: 'cmd-2', text: "git clone https://github.com/Snorlax-011/Tech-Mastery.git", speed: 40 },
            { id: 'cmd-3', text: "npm run showcase --advanced --impressive", speed: 60 },
            { id: 'github-status', text: "✅ GitHub API connected | Repositories loaded | Ready to explore!", speed: 45 },
            { id: 'final-cmd', text: "echo 'Let\'s build something amazing together! 🚀'", speed: 55 }
        ];

        this.animations.typeCommands(commands).then(() => {
            // Show stats panel after typing is complete
            const statsPanel = document.getElementById('stats-panel');
            if (statsPanel) {
                setTimeout(() => {
                    statsPanel.classList.add('visible');
                    this.animateCounters();
                }, 500);
            }
        });
    }

    /**
     * Display repository showcase
     */
    displayRepositoryShowcase() {
        const repoStats = document.getElementById('repo-stats');
        const repoActions = document.getElementById('repo-actions');

        if (repoStats && this.state.stats) {
            repoStats.innerHTML = `
                <div class="repo-stat">
                    <span class="repo-stat-value">${this.state.stats.totalRepos}</span>
                    <span class="repo-stat-label">Repositories</span>
                </div>
                <div class="repo-stat">
                    <span class="repo-stat-value">${this.state.stats.totalStars}</span>
                    <span class="repo-stat-label">Total Stars</span>
                </div>
                <div class="repo-stat">
                    <span class="repo-stat-value">${this.state.stats.languages.length}</span>
                    <span class="repo-stat-label">Languages</span>
                </div>
                <div class="repo-stat">
                    <span class="repo-stat-value">${this.utils.formatDate(new Date())}</span>
                    <span class="repo-stat-label">Last Updated</span>
                </div>
            `;
        }

        if (repoActions) {
            repoActions.innerHTML = `
                <a href="https://github.com/Snorlax-011/Tech-Mastery" target="_blank" class="repo-action-btn">
                    <i class="fab fa-github"></i>
                    View Repository
                </a>
                <button onclick="app.scrollToSection('projects')" class="repo-action-btn secondary">
                    <i class="fas fa-folder-open"></i>
                    Explore Projects
                </button>
                <a href="https://snorlax-011.github.io/Tech-Mastery/" target="_blank" class="repo-action-btn secondary">
                    <i class="fas fa-external-link-alt"></i>
                    Live Demo
                </a>
            `;
        }
    }

    /**
     * Animate counter elements
     */
    animateCounters() {
        const counters = [
            { id: 'total-repos', target: this.state.stats.totalRepos || 0 },
            { id: 'total-stars', target: this.state.stats.totalStars || 0 },
            { id: 'total-commits', target: this.state.stats.totalCommits || 0 },
            { id: 'languages-count', target: this.state.stats.languages.length || 0 }
        ];

        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (element) {
                this.animations.animateCounter(element, 0, counter.target, 2000);
            }
        });
    }

    /**
     * Render projects
     */
    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        const repos = this.state.filteredRepos.slice(0, 12); // Show first 12

        if (repos.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No projects found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = repos.map(repo => this.components.createProjectCard(repo)).join('');
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                this.state.isLoaded = true;

                // Initialize post-load animations
                setTimeout(() => {
                    this.initializeAnimations();
                }, 300);
            }, 1000);
        }
    }

    /**
     * Update responsive components
     */
    updateResponsiveComponents() {
        // Update any components that need to recalculate on resize
        if (window.innerWidth <= 768) {
            this.closeMobileMenu();
        }
    }

    /**
     * Cache data to localStorage
     */
    cacheData() {
        try {
            const cacheData = {
                user: this.state.user,
                repositories: this.state.repositories,
                stats: this.state.stats,
                timestamp: Date.now()
            };
            localStorage.setItem('github-cache', JSON.stringify(cacheData));
            console.log('💾 Data cached successfully');
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }

    /**
     * Get cached data from localStorage
     */
    getCachedData() {
        try {
            const cached = localStorage.getItem('github-cache');
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.warn('Failed to retrieve cached data:', error);
            return null;
        }
    }

    /**
     * Check if cache is valid (1 hour)
     */
    isCacheValid(timestamp) {
        const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
        return Date.now() - timestamp < CACHE_DURATION;
    }

    /**
     * Handle errors gracefully
     */
    handleError(error) {
        console.error('Application error:', error);
        this.performance.errors.push({
            message: error.message,
            timestamp: Date.now(),
            stack: error.stack
        });

        // Show user-friendly error message
        const errorHtml = `
            <div class="error-container">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Oops! Something went wrong</h2>
                    <p>Don't worry, this usually fixes itself. Try refreshing the page.</p>
                    <button onclick="location.reload()" class="btn-primary">
                        <i class="fas fa-refresh"></i>
                        Refresh Page
                    </button>
                </div>
            </div>
        `;

        document.body.innerHTML = errorHtml;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TechMasteryApp();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.app) {
        window.app.handleError(event.error);
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
    if (window.app) {
        window.app.handleError(event.reason);
    }
});
