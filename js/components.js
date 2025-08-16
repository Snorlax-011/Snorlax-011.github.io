/**
 * Component Factory for My Learning Progress
 */

class Components {
    createProjectCard(repo) {
        const topicsHTML = (repo.topics || []).slice(0, 5).map(topic => 
            `<span class="topic-tag">${topic}</span>`
        ).join('');
        
        const languageDot = repo.language ? 
            `<span class="language-dot" style="background-color: ${this.getLanguageColor(repo.language)}"></span>` : '';

        const isFeatured = repo.name === 'Tech-Mastery' || repo.featured;
        const cardClass = isFeatured ? 'project-card featured-repo' : 'project-card';

        return `
            <div class="${cardClass}" data-repo="${repo.name}">
                <div class="project-header">
                    <div class="project-title-section">
                        <h3 class="project-title">
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                                ${repo.name}
                            </a>
                            ${isFeatured ? '<span class="featured-badge">Featured</span>' : ''}
                        </h3>
                        <div class="project-language">
                            ${languageDot}
                            <span>${repo.language || 'Multiple'}</span>
                        </div>
                    </div>
                </div>
                
                <p class="project-description">
                    ${repo.description || 'Learning repository - documenting my progress.'}
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
                        <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer">
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
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${progress}%</span>
            </div>
        `;

        const itemsList = items ? items.map(item => `
            <li class="progress-item ${item.completed ? 'completed' : 'in-progress'}">
                <i class="fas ${item.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                <span>${item.name}</span>
            </li>
        `).join('') : '';

        return `
            <div class="learning-card">
                <div class="learning-header">
                    <h3 class="learning-title">${title}</h3>
                    ${progressBar}
                </div>
                <p class="learning-description">${description}</p>
                ${itemsList ? `<ul class="learning-items">${itemsList}</ul>` : ''}
            </div>
        `;
    }

    createTerminalOutput(commands) {
        return commands.map(cmd => `
            <div class="terminal-line">
                <span class="prompt">abhijith@learning:~$</span>
                <span class="command" id="${cmd.id}">${cmd.text || ''}</span>
            </div>
        `).join('');
    }

    createStatItem(value, label, icon) {
        return `
            <div class="stat-item">
                <div class="stat-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-number">${value}</span>
                    <span class="stat-label">${label}</span>
                </div>
            </div>
        `;
    }

    createRepoShowcase(repo) {
        if (!repo) return '<p>Repository not found</p>';

        const stats = [
            { value: repo.stargazers_count || 0, label: 'Stars', icon: 'fas fa-star' },
            { value: repo.forks_count || 0, label: 'Forks', icon: 'fas fa-code-branch' },
            { value: (repo.size || 0) + ' KB', label: 'Size', icon: 'fas fa-hdd' }
        ];

        const statsHTML = stats.map(stat => this.createStatItem(stat.value, stat.label, stat.icon)).join('');

        return `
            <div class="repo-showcase-content">
                <div class="repo-header">
                    <h2 class="repo-title">
                        <i class="fas fa-book"></i>
                        ${repo.name}
                    </h2>
                    <p class="repo-description">${repo.description || 'My learning journey documentation'}</p>
                </div>
                
                <div class="repo-stats-grid">
                    ${statsHTML}
                </div>
                
                <div class="repo-actions">
                    <a href="${repo.html_url}" class="repo-action-btn primary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i>
                        View Repository
                    </a>
                    <a href="${repo.html_url}/blob/main/README.md" class="repo-action-btn secondary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-readme"></i>
                        Read Documentation
                    </a>
                </div>
            </div>
        `;
    }

    formatUpdatedTime(dateString) {
        if (!dateString) return 'Unknown';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return `${Math.floor(diffInDays / 30)} months ago`;
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
}
