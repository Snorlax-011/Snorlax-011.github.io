/**
 * ===================================
 * ADVANCED GITHUB API INTEGRATION
 * Comprehensive GitHub data fetching for Learning Progress
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

        console.log('🔗 GitHub API client initialized for learning progress tracking');
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
                    'User-Agent': 'LearningProgress-Portfolio/1.0',
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
            // Return fallback data for learning progress
            return {
                login: username,
                name: 'Abhijith',
                bio: 'Documenting my journey of learning.',
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

            // Enhance repository data with learning focus
            const enhancedRepos = await this.enhanceRepositories(repos);

            // Prioritize learning repositories
            const learningRepos = enhancedRepos.filter(repo => 
                repo.name.includes('Tech-Mastery') || 
                repo.name.toLowerCase().includes('c') ||
                repo.name.toLowerCase().includes('learning') ||
                repo.name.toLowerCase().includes('chapter')
            );

            const otherRepos = enhancedRepos.filter(repo => 
                !learningRepos.includes(repo)
            );

            // Combine with learning repos first
            const sortedRepos = [...learningRepos, ...otherRepos];

            console.log(`📚 Fetched ${sortedRepos.length} repositories for ${username} (${learningRepos.length} learning repos)`);
            return sortedRepos;
        } catch (error) {
            console.error('Failed to fetch repositories:', error);
            return this.getFallbackRepositories();
        }
    }

    /**
     * Get specific repository with detailed information
     */
    async getRepository(owner, repo) {
        try {
            const repository = await this.makeRequest(`/repos/${owner}/${repo}`);

            // Get additional data for learning repositories
            const [languages, topics, contributors, contents] = await Promise.allSettled([
                this.getRepositoryLanguages(owner, repo),
                this.getRepositoryTopics(owner, repo),
                this.getRepositoryContributors(owner, repo),
                repo === 'Tech-Mastery' ? this.getRepositoryContents(owner, repo) : Promise.resolve([])
            ]);

            const enhancedRepo = {
                ...repository,
                languages: languages.status === 'fulfilled' ? languages.value : {},
                topics: topics.status === 'fulfilled' ? topics.value : [],
                contributors: contributors.status === 'fulfilled' ? contributors.value : [],
                contents: contents.status === 'fulfilled' ? contents.value : [],
                isLearningRepo: this.isLearningRepository(repository)
            };

            // If it's Tech-Mastery, get additional learning metadata
            if (repo === 'Tech-Mastery') {
                enhancedRepo.learningMetadata = await this.getLearningMetadata(owner, repo);
            }

            return enhancedRepo;
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
     * Get learning metadata for repositories
     */
    async getLearningMetadata(owner, repo) {
        try {
            // Try to get README content for learning progress
            const readme = await this.makeRequest(`/repos/${owner}/${repo}/readme`);
            
            return {
                hasReadme: !!readme,
                readmeContent: readme ? atob(readme.content) : null,
                learningStructure: await this.analyzeLearningStructure(owner, repo)
            };
        } catch (error) {
            console.warn(`Failed to fetch learning metadata for ${owner}/${repo}:`, error);
            return {
                hasReadme: false,
                readmeContent: null,
                learningStructure: []
            };
        }
    }

    /**
     * Analyze learning structure in repository
     */
    async analyzeLearningStructure(owner, repo) {
        try {
            const contents = await this.getRepositoryContents(owner, repo);
            
            return contents
                .filter(item => item.type === 'dir')
                .map(dir => ({
                    name: dir.name,
                    path: dir.path,
                    type: 'directory',
                    isChapter: dir.name.toLowerCase().includes('chapter'),
                    isLearningContent: this.isLearningContent(dir.name)
                }))
                .sort((a, b) => {
                    // Sort chapters numerically
                    if (a.isChapter && b.isChapter) {
                        const aNum = parseInt(a.name.match(/\d+/)?.[0] || '0');
                        const bNum = parseInt(b.name.match(/\d+/)?.[0] || '0');
                        return aNum - bNum;
                    }
                    return a.name.localeCompare(b.name);
                });
        } catch (error) {
            console.warn(`Failed to analyze learning structure for ${owner}/${repo}:`, error);
            return [];
        }
    }

    /**
     * Check if repository is learning-related
     */
    isLearningRepository(repo) {
        const learningKeywords = [
            'tech-mastery', 'learning', 'tutorial', 'chapter', 'course',
            'study', 'practice', 'exercise', 'c-programming', 'programming-language'
        ];
        
        const repoName = repo.name.toLowerCase();
        const repoDesc = (repo.description || '').toLowerCase();
        
        return learningKeywords.some(keyword => 
            repoName.includes(keyword) || repoDesc.includes(keyword)
        );
    }

    /**
     * Check if content is learning-related
     */
    isLearningContent(name) {
        const learningPatterns = [
            /chapter/i, /lesson/i, /exercise/i, /practice/i,
            /tutorial/i, /example/i, /assignment/i, /homework/i
        ];
        
        return learningPatterns.some(pattern => pattern.test(name));
    }

    /**
     * Enhance repositories with additional learning metadata
     */
    async enhanceRepositories(repos) {
        const enhanced = [];
        
        for (const repo of repos) {
            try {
                const enhancedRepo = {
                    ...repo,
                    language_color: this.getLanguageColor(repo.language),
                    size_formatted: this.formatSize(repo.size),
                    updated_formatted: this.formatDate(repo.updated_at),
                    is_learning_repo: this.isLearningRepository(repo),
                    is_featured: repo.name === 'Tech-Mastery',
                    learning_priority: this.calculateLearningPriority(repo),
                    health_score: this.calculateHealthScore(repo)
                };

                enhanced.push(enhancedRepo);
            } catch (error) {
                console.warn(`Failed to enhance repository ${repo.name}:`, error);
                enhanced.push(repo);
            }
        }

        return enhanced.sort((a, b) => b.learning_priority - a.learning_priority);
    }

    /**
     * Calculate learning priority for repositories
     */
    calculateLearningPriority(repo) {
        let priority = 0;
        
        // Tech-Mastery gets highest priority
        if (repo.name === 'Tech-Mastery') priority += 100;
        
        // Learning-related repos get high priority
        if (this.isLearningRepository(repo)) priority += 50;
        
        // Recently updated repos get bonus
        const daysSinceUpdate = (Date.now() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) priority += 20;
        if (daysSinceUpdate < 30) priority += 10;
        
        // Repos with description get bonus
        if (repo.description) priority += 5;
        
        return priority;
    }

    /**
     * Calculate repository health score
     */
    calculateHealthScore(repo) {
        let score = 0;

        // Has description
        if (repo.description) score += 20;

        // Recently updated
        const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
        if (new Date(repo.updated_at) > sixMonthsAgo) score += 20;

        // Has content (inferred from size > 0)
        if (repo.size > 0) score += 15;

        // Has stars (engagement)
        if (repo.stargazers_count > 0) score += 15;

        // Has license
        if (repo.license) score += 15;

        // Learning repository bonus
        if (this.isLearningRepository(repo)) score += 15;

        return Math.min(score, 100);
    }

    /**
     * Get fallback repositories for learning focus
     */
    getFallbackRepositories() {
        return [
            {
                name: 'Tech-Mastery',
                description: 'A comprehensive collection of technical learning resources and my programming journey',
                html_url: 'https://github.com/Snorlax-011/Tech-Mastery',
                language: 'Multiple',
                stargazers_count: 0,
                forks_count: 0,
                updated_at: new Date().toISOString(),
                topics: ['learning', 'programming', 'c-language', 'documentation'],
                featured: true,
                is_learning_repo: true,
                language_color: '#2f81f7',
                health_score: 95,
                learning_priority: 100
            }
        ];
    }

    /**
     * Get language color
     */
    getLanguageColor(language) {
        const colors = {
            'C': '#555555',
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Multiple': '#2f81f7'
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
     * Search repositories with learning focus
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
