/**
 * ===================================
 * ADVANCED GITHUB API INTEGRATION
 * Comprehensive GitHub data fetching with rate limiting,
 * caching, and error handling
 * ===================================
 */

class GitHubAPI {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.username = 'Snorlax-011';
        this.rateLimitInfo = {
            limit: 60,
            remaining: 60,
            reset: Date.now() + 3600000,
            used: 0
        };

        // Request queue for rate limiting
        this.requestQueue = [];
        this.isProcessingQueue = false;

        // Cache for API responses
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes

        // Error tracking
        this.errors = [];
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second

        console.log('🔗 GitHub API client initialized');
    }

    /**
     * Make authenticated request to GitHub API
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = this.getCacheKey(url, options);

        // Check cache first
        const cachedResponse = this.getFromCache(cacheKey);
        if (cachedResponse) {
            console.log(`📦 Using cached response for ${endpoint}`);
            return cachedResponse;
        }

        // Check rate limit
        if (this.rateLimitInfo.remaining <= 1 && Date.now() < this.rateLimitInfo.reset) {
            console.warn('⚠️ Rate limit reached, queuing request');
            return this.queueRequest(endpoint, options);
        }

        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'TechMastery-Portfolio/1.0',
                    ...options.headers
                },
                ...options
            };

            console.log(`🔄 Making request to ${endpoint}`);
            const response = await fetch(url, requestOptions);

            // Update rate limit info
            this.updateRateLimitInfo(response.headers);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Cache successful response
            this.setCache(cacheKey, data);

            console.log(`✅ Request successful: ${endpoint}`);
            return data;

        } catch (error) {
            console.error(`❌ Request failed: ${endpoint}`, error);
            this.errors.push({
                endpoint,
                error: error.message,
                timestamp: Date.now()
            });

            // Retry logic
            if (options.retryCount < this.retryAttempts) {
                console.log(`🔄 Retrying request (${options.retryCount + 1}/${this.retryAttempts})`);
                await this.delay(this.retryDelay * Math.pow(2, options.retryCount));
                return this.makeRequest(endpoint, { ...options, retryCount: (options.retryCount || 0) + 1 });
            }

            throw error;
        }
    }

    /**
     * Queue request for later processing when rate limit resets
     */
    async queueRequest(endpoint, options) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                endpoint,
                options,
                resolve,
                reject,
                timestamp: Date.now()
            });

            if (!this.isProcessingQueue) {
                this.processQueue();
            }
        });
    }

    /**
     * Process queued requests
     */
    async processQueue() {
        if (this.requestQueue.length === 0) {
            this.isProcessingQueue = false;
            return;
        }

        this.isProcessingQueue = true;

        // Wait until rate limit resets
        const waitTime = Math.max(0, this.rateLimitInfo.reset - Date.now());
        if (waitTime > 0) {
            console.log(`⏱️ Waiting ${Math.ceil(waitTime / 1000)}s for rate limit reset`);
            await this.delay(waitTime);
        }

        // Process queued requests
        while (this.requestQueue.length > 0 && this.rateLimitInfo.remaining > 0) {
            const { endpoint, options, resolve, reject } = this.requestQueue.shift();

            try {
                const result = await this.makeRequest(endpoint, options);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }

        this.isProcessingQueue = false;

        // Continue processing if there are more requests
        if (this.requestQueue.length > 0) {
            this.processQueue();
        }
    }

    /**
     * Update rate limit information from response headers
     */
    updateRateLimitInfo(headers) {
        if (headers.has('x-ratelimit-limit')) {
            this.rateLimitInfo.limit = parseInt(headers.get('x-ratelimit-limit'));
        }
        if (headers.has('x-ratelimit-remaining')) {
            this.rateLimitInfo.remaining = parseInt(headers.get('x-ratelimit-remaining'));
        }
        if (headers.has('x-ratelimit-reset')) {
            this.rateLimitInfo.reset = parseInt(headers.get('x-ratelimit-reset')) * 1000;
        }

        this.rateLimitInfo.used = this.rateLimitInfo.limit - this.rateLimitInfo.remaining;

        console.log(`📊 Rate limit: ${this.rateLimitInfo.remaining}/${this.rateLimitInfo.limit}`);
    }

    /**
     * Get user information
     */
    async getUser(username = this.username) {
        try {
            const user = await this.makeRequest(`/users/${username}`);
            console.log(`👤 User data fetched for ${username}`);
            return user;
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            // Return fallback data
            return {
                login: username,
                name: 'Abhijith Snorlax',
                bio: 'Full Stack Developer & Tech Enthusiast',
                location: 'Ananthapur, Andhra Pradesh, India',
                public_repos: 0,
                followers: 0,
                following: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        }
    }

    /**
     * Get user repositories with enhanced data
     */
    async getUserRepositories(username = this.username, options = {}) {
        const {
            sort = 'updated',
            direction = 'desc',
            per_page = 100,
            type = 'owner'
        } = options;

        try {
            const repos = await this.makeRequest(
                `/users/${username}/repos?sort=${sort}&direction=${direction}&per_page=${per_page}&type=${type}`
            );

            // Enhance repository data
            const enhancedRepos = await this.enhanceRepositories(repos);

            console.log(`📚 Fetched ${enhancedRepos.length} repositories for ${username}`);
            return enhancedRepos;

        } catch (error) {
            console.error('Failed to fetch repositories:', error);
            return this.getFallbackRepositories();
        }
    }

    /**
     * Get specific repository
     */
    async getRepository(owner, repo) {
        try {
            const repository = await this.makeRequest(`/repos/${owner}/${repo}`);

            // Get additional data
            const [languages, topics, contributors] = await Promise.allSettled([
                this.getRepositoryLanguages(owner, repo),
                this.getRepositoryTopics(owner, repo),
                this.getRepositoryContributors(owner, repo)
            ]);

            return {
                ...repository,
                languages: languages.status === 'fulfilled' ? languages.value : {},
                topics: topics.status === 'fulfilled' ? topics.value : [],
                contributors: contributors.status === 'fulfilled' ? contributors.value : []
            };

        } catch (error) {
            console.error(`Failed to fetch repository ${owner}/${repo}:`, error);
            return null;
        }
    }

    /**
     * Get repository languages
     */
    async getRepositoryLanguages(owner, repo) {
        try {
            return await this.makeRequest(`/repos/${owner}/${repo}/languages`);
        } catch (error) {
            console.warn(`Failed to fetch languages for ${owner}/${repo}:`, error);
            return {};
        }
    }

    /**
     * Get repository topics
     */
    async getRepositoryTopics(owner, repo) {
        try {
            const response = await this.makeRequest(`/repos/${owner}/${repo}/topics`, {
                headers: {
                    'Accept': 'application/vnd.github.mercy-preview+json'
                }
            });
            return response.names || [];
        } catch (error) {
            console.warn(`Failed to fetch topics for ${owner}/${repo}:`, error);
            return [];
        }
    }

    /**
     * Get repository contributors
     */
    async getRepositoryContributors(owner, repo) {
        try {
            return await this.makeRequest(`/repos/${owner}/${repo}/contributors?per_page=10`);
        } catch (error) {
            console.warn(`Failed to fetch contributors for ${owner}/${repo}:`, error);
            return [];
        }
    }

    /**
     * Get repository contents
     */
    async getRepositoryContents(owner, repo, path = '') {
        try {
            return await this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`);
        } catch (error) {
            console.warn(`Failed to fetch contents for ${owner}/${repo}/${path}:`, error);
            return [];
        }
    }

    /**
     * Get user's commit activity
     */
    async getUserCommitActivity(username = this.username) {
        try {
            const events = await this.makeRequest(`/users/${username}/events/public?per_page=100`);
            const pushEvents = events.filter(event => event.type === 'PushEvent');

            const commitActivity = pushEvents.map(event => ({
                repo: event.repo.name,
                commits: event.payload.commits.length,
                date: event.created_at,
                message: event.payload.commits[0]?.message || 'No message'
            }));

            return commitActivity;
        } catch (error) {
            console.warn('Failed to fetch commit activity:', error);
            return [];
        }
    }

    /**
     * Get repository statistics
     */
    async getRepositoryStats(owner, repo) {
        try {
            const [stats, commits] = await Promise.allSettled([
                this.makeRequest(`/repos/${owner}/${repo}/stats/contributors`),
                this.makeRequest(`/repos/${owner}/${repo}/commits?per_page=1`)
            ]);

            return {
                contributors: stats.status === 'fulfilled' ? stats.value : [],
                lastCommit: commits.status === 'fulfilled' ? commits.value[0] : null
            };
        } catch (error) {
            console.warn(`Failed to fetch stats for ${owner}/${repo}:`, error);
            return { contributors: [], lastCommit: null };
        }
    }

    /**
     * Enhance repositories with additional data
     */
    async enhanceRepositories(repos) {
        const enhanced = [];

        for (const repo of repos) {
            try {
                // Add language colors and additional metadata
                const enhancedRepo = {
                    ...repo,
                    language_color: this.getLanguageColor(repo.language),
                    size_formatted: this.formatSize(repo.size),
                    updated_formatted: this.formatDate(repo.updated_at),
                    is_featured: this.isFeaturedRepository(repo),
                    health_score: this.calculateHealthScore(repo)
                };

                enhanced.push(enhancedRepo);
            } catch (error) {
                console.warn(`Failed to enhance repository ${repo.name}:`, error);
                enhanced.push(repo);
            }
        }

        return enhanced;
    }

    /**
     * Check if repository is featured
     */
    isFeaturedRepository(repo) {
        const featuredCriteria = [
            repo.name.toLowerCase() === 'tech-mastery',
            repo.stargazers_count > 0,
            repo.description && repo.description.length > 50,
            repo.topics && repo.topics.length > 2
        ];

        return featuredCriteria.filter(Boolean).length >= 2;
    }

    /**
     * Calculate repository health score
     */
    calculateHealthScore(repo) {
        let score = 0;

        // Has description
        if (repo.description) score += 20;

        // Has topics
        if (repo.topics && repo.topics.length > 0) score += 15;

        // Has README (inferred from size > 0)
        if (repo.size > 0) score += 15;

        // Recently updated (within 6 months)
        const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
        if (new Date(repo.updated_at) > sixMonthsAgo) score += 20;

        // Has stars
        if (repo.stargazers_count > 0) score += 15;

        // Has license
        if (repo.license) score += 15;

        return Math.min(score, 100);
    }

    /**
     * Get language color
     */
    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C': '#555555',
            'C#': '#239120',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Dart': '#00B4AB',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'SCSS': '#c6538c',
            'Shell': '#89e051',
            'PowerShell': '#012456',
            'Dockerfile': '#384d54'
        };

        return colors[language] || '#8b949e';
    }

    /**
     * Format file size
     */
    formatSize(sizeInKB) {
        if (sizeInKB < 1024) return `${sizeInKB} KB`;
        if (sizeInKB < 1048576) return `${(sizeInKB / 1024).toFixed(1)} MB`;
        return `${(sizeInKB / 1048576).toFixed(1)} GB`;
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    }

    /**
     * Get fallback repositories if API fails
     */
    getFallbackRepositories() {
        return [
            {
                name: 'Tech-Mastery',
                description: 'A comprehensive collection of technical learning resources and projects',
                html_url: 'https://github.com/Snorlax-011/Tech-Mastery',
                language: 'Multiple',
                stargazers_count: 0,
                forks_count: 0,
                updated_at: new Date().toISOString(),
                topics: ['learning', 'technology', 'programming', 'resources'],
                featured: true,
                language_color: '#2f81f7',
                health_score: 85
            }
        ];
    }

    /**
     * Cache management
     */
    getCacheKey(url, options) {
        return btoa(url + JSON.stringify(options)).slice(0, 50);
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get API status and diagnostics
     */
    getApiStatus() {
        return {
            rateLimitInfo: this.rateLimitInfo,
            cacheSize: this.cache.size,
            queueLength: this.requestQueue.length,
            errors: this.errors.slice(-10), // Last 10 errors
            isOnline: navigator.onLine
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    /**
     * Search repositories
     */
    async searchRepositories(query, options = {}) {
        try {
            const searchQuery = `${query} user:${this.username}`;
            const params = new URLSearchParams({
                q: searchQuery,
                sort: options.sort || 'updated',
                order: options.order || 'desc',
                per_page: options.per_page || 30
            });

            const response = await this.makeRequest(`/search/repositories?${params}`);
            return response.items || [];
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }
}
