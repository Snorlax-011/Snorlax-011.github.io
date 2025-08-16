/**
 * Component Factory for My Learning Progress (REAL CONTENT VERSION)
 */

class Components {
    createProjectCard(repo) {
        if (!repo) {
            return '<div class="project-card">Repository data not available</div>';
        }

        const topicsHTML = (repo.topics || []).slice(0, 5).map(topic => 
            `<span class="topic-tag">${this.escapeHtml(topic)}</span>`
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

    createRepoShowcase(repo) {
        // FIXED: Always show content, no more endless loading
        const repoData = repo || this.getTechMasteryFallbackData();

        return `
            <div class="repo-showcase-content">
                <div class="repo-header">
                    <h2 class="repo-title">
                        <i class="fas fa-book"></i>
                        ${this.escapeHtml(repoData.name)}
                    </h2>
                    <p class="repo-description">${this.escapeHtml(repoData.description)}</p>
                </div>
                
                <div class="repo-stats-grid">
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-code-branch"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number">19</span>
                            <span class="stat-label">Real Commits</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-file-code"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number">11</span>
                            <span class="stat-label">C Programs</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number">14</span>
                            <span class="stat-label">Concept Notes</span>
                        </div>
                    </div>
                </div>

                <div class="learning-timeline">
                    <h3><i class="fas fa-calendar-alt"></i> Learning Timeline</h3>
                    <div class="timeline-items">
                        <div class="timeline-item">
                            <div class="timeline-date">Day 1 (Aug 1)</div>
                            <div class="timeline-content">Created Tech-Mastery repository, first C program</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">Day 2 (Aug 2)</div>
                            <div class="timeline-content">While loops, formatting, temperature conversion</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">Day 3 (Aug 7)</div>
                            <div class="timeline-content">For loops, character I/O, literals, EOF</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">Day 4 (Aug 8)</div>
                            <div class="timeline-content">Input/output final, buffering concepts</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">Day 5 (Aug 15)</div>
                            <div class="timeline-content">Two's complement, char counting, line counting</div>
                        </div>
                    </div>
                </div>

                <div class="chapter-progress">
                    <h3><i class="fas fa-graduation-cap"></i> Chapter 1 Progress</h3>
                    <div class="progress-overview">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 65%"></div>
                        </div>
                        <span class="progress-text">65% Complete</span>
                    </div>
                    <div class="progress-details">
                        <div class="progress-section">
                            <h4>✅ Completed Concepts:</h4>
                            <ul>
                                <li>Formatting & Format Specifiers</li>
                                <li>While & For Loops</li>
                                <li>Character I/O Operations</li>
                                <li>EOF Handling</li>
                                <li>Two's Complement</li>
                                <li>Character & Line Counting</li>
                            </ul>
                        </div>
                        <div class="progress-section">
                            <h4>📝 Programs Written:</h4>
                            <ul>
                                <li>Temperature Conversion (Fahrenheit ↔ Celsius)</li>
                                <li>Character Input/Output Programs</li>
                                <li>EOF Detection</li>
                                <li>Character Counting</li>
                                <li>Line Counting</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="repo-actions">
                    <a href="${this.escapeHtml(repoData.html_url)}" class="repo-action-btn primary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i>
                        View Repository
                    </a>
                    <a href="https://snorlax-011.github.io/Tech-Mastery/" class="repo-action-btn secondary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-globe"></i>
                        Visit Tech-Mastery Site
                    </a>
                    <a href="${this.escapeHtml(repoData.html_url)}/tree/main/C/The_C_Programming_Language/Chapter-1" class="repo-action-btn secondary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-folder-open"></i>
                        View Chapter 1
                    </a>
                </div>
            </div>
        `;
    }

    getTechMasteryFallbackData() {
        return {
            name: 'Tech-Mastery',
            description: 'To become the King of Computer Technology👑...',
            html_url: 'https://github.com/Snorlax-011/Tech-Mastery',
            stargazers_count: 0,
            forks_count: 0,
            language: 'C'
        };
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

    formatUpdatedTime(dateString) {
        if (!dateString) return 'Recently';
        
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

    escapeHtml(text) {
        if (typeof text !== 'string') {
            return String(text || '');
        }
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
