/**
 * Component Factory for My Learning Progress (BUG-FIXED)
 */

class Components {
    createProjectCard(repo) {
        // Add null check for repo parameter - FIXED
        if (!repo) {
            return '<div class="project-card">Repository data not available</div>';
        }

        const topicsHTML = (repo.topics || []).slice(0, 5).map(topic => 
            `<span class="topic-tag">${this.escapeHtml(topic)}</span>` // FIXED: Escape HTML
        ).join('');
        
        const languageDot = repo.language ? 
            `<span class="language-dot" style="background-color: ${this.getLanguageColor(repo.language)}"></span>` : '';

        const isFeatured = repo.name === 'Tech-Mastery' || repo.featured;
        const cardClass = isFeatured ? 'project-card featured-repo' : 'project-card';

        return `
            <div class="${cardClass}" data-repo="${this.escapeHtml(repo.name)}">
                <div class="project-header">
                    <div class="project-title-section">
                        <h3 class="project-title">
                            <a href="${this.escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">
                                ${this.escapeHtml(repo.name)}
                            </a>
                            ${isFeatured ? '<span class="featured-badge">Featured</span>' : ''}
                        </h3>
                        <div class="project-language">
                            ${languageDot}
                            <span>${this.escapeHtml(repo.language || 'Multiple')}</span>
                        </div>
                    </div>
                </div>
                
                <p class="project-description">
                    ${this.escapeHtml(repo.description || 'Learning repository - documenting my progress.')}
                </p>
                
                <div class="project-stats">
                    <div class="project-stat">
                        <i class="fas fa-star"></i>
                        <span>${repo.stargazers_count || 0}</span>
                    </div>
                    <div class="project-stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks_count || 0}</span>
                    </div>
                    <div class="project-stat">
                        <i class="fas fa-clock"></i>
                        <span>${this.formatUpdatedTime(repo.updated_at)}</span>
                    </div>
                </div>
                
                <div class="project-footer">
                    <div class="project-topics">
                        ${topicsHTML}
                    </div>
                    <div class="project-links">
                        <a href="${this.escapeHtml(repo.html_url)}" class="project-link" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    createLearningProgressCard(title, description, progress, items) {
        const progressBar = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.max(0, Math.min(100, progress))}%"></div>
                </div>
                <span class="progress-text">${Math.max(0, Math.min(100, progress))}%</span>
            </div>
        `;

        const itemsList = items && Array.isArray(items) ? items.map(item => `
            <li class="progress-item ${item.completed ? 'completed' : 'in-progress'}">
                <i class="fas ${item.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                <span>${this.escapeHtml(item.name)}</span>
            </li>
        `).join('') : '';

        return `
            <div class="learning-card">
                <div class="learning-header">
                    <h3 class="learning-title">${this.escapeHtml(title)}</h3>
                    ${progressBar}
                </div>
                <p class="learning-description">${this.escapeHtml(description)}</p>
                ${itemsList ? `<ul class="learning-items">${itemsList}</ul>` : ''}
            </div>
        `;
    }

    createTerminalOutput(commands) {
        if (!Array.isArray(commands)) return '';
        
        return commands.map(cmd => `
            <div class="terminal-line">
                <span class="prompt">abhijith@learning:~$</span>
                <span class="command" id="${this.escapeHtml(cmd.id)}">${this.escapeHtml(cmd.text || '')}</span>
            </div>
        `).join('');
    }

    createStatItem(value, label, icon) {
        return `
            <div class="stat-item">
                <div class="stat-icon">
                    <i class="${this.escapeHtml(icon)}"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-number">${this.escapeHtml(String(value))}</span>
                    <span class="stat-label">${this.escapeHtml(label)}</span>
                </div>
            </div>
        `;
    }

    createRepoShowcase(repo) {
        // FIXED: Add proper null check and error handling
        if (!repo) {
            return `
                <div class="repo-showcase-fallback">
                    <div class="repo-header">
                        <h2 class="repo-title">
                            <i class="fas fa-book"></i>
                            Tech-Mastery
                        </h2>
                        <p class="repo-description">My learning journey documentation</p>
                    </div>
                    <div class="repo-actions">
                        <a href="https://github.com/Snorlax-011/Tech-Mastery" class="repo-action-btn primary" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i>
                            View Repository
                        </a>
                    </div>
                </div>
            `;
        }

        // FIXED: Safe property access with fallbacks
        const stats = [
            { value: repo.stargazers_count || 0, label: 'Stars', icon: 'fas fa-star' },
            { value: repo.forks_count || 0, label: 'Forks', icon: 'fas fa-code-branch' },
            { value: this.formatSize(repo.size || 0), label: 'Size', icon: 'fas fa-hdd' }
        ];

        const statsHTML = stats.map(stat => this.createStatItem(stat.value, stat.label, stat.icon)).join('');

        return `
            <div class="repo-showcase-content">
                <div class="repo-header">
                    <h2 class="repo-title">
                        <i class="fas fa-book"></i>
                        ${this.escapeHtml(repo.name || 'Tech-Mastery')}
                    </h2>
                    <p class="repo-description">${this.escapeHtml(repo.description || 'My learning journey documentation')}</p>
                </div>
                
                <div class="repo-stats-grid">
                    ${statsHTML}
                </div>
                
                <div class="repo-actions">
                    <a href="${this.escapeHtml(repo.html_url || 'https://github.com/Snorlax-011/Tech-Mastery')}" class="repo-action-btn primary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i>
                        View Repository
                    </a>
                    <a href="${this.escapeHtml((repo.html_url || 'https://github.com/Snorlax-011/Tech-Mastery') + '/blob/main/README.md')}" class="repo-action-btn secondary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-readme"></i>
                        Read Documentation
                    </a>
                </div>
            </div>
        `;
    }

    formatUpdatedTime(dateString) {
        if (!dateString) return 'Unknown';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) return 'Today';
            if (diffInDays === 1) return 'Yesterday';
            if (diffInDays < 7) return `${diffInDays} days ago`;
            if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
            return `${Math.floor(diffInDays / 30)} months ago`;
        } catch (error) {
            console.warn('Error formatting date:', error);
            return 'Recently';
        }
    }

    formatSize(sizeInKB) {
        const size = Number(sizeInKB) || 0;
        if (size < 1024) return `${size} KB`;
        if (size < 1048576) return `${(size / 1024).toFixed(1)} MB`;
        return `${(size / 1048576).toFixed(1)} GB`;
    }

    getLanguageColor(language) {
        const colors = {
            'C': '#555555',
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'TypeScript': '#2b7489',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33'
        };
        return colors[language] || '#8b949e';
    }

    // FIXED: Add HTML escaping utility function
    escapeHtml(text) {
        if (typeof text !== 'string') {
            return String(text || '');
        }
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
