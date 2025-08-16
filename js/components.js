/**
 * Component Factory
 */
class Components {
    createProjectCard(repo) {
        const topicsHTML = (repo.topics || []).slice(0, 5).map(topic => `<span class="topic-tag">${topic}</span>`).join('');
        const languageDot = `<span class="language-dot" style="background:${repo.language_color}"></span>`;
        return `
            <div class="project-card">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">${repo.name}</h3>
                        <span class="project-language">${languageDot}${repo.language || 'N/A'}</span>
                    </div>
                </div>
                <p class="project-description">${repo.description || 'No description available.'}</p>
                <div class="project-stats">
                    <span class="project-stat"><i class="fas fa-star"></i>${repo.stargazers_count}</span>
                    <span class="project-stat"><i class="fas fa-code-branch"></i>${repo.forks_count}</span>
                    <span class="project-stat"><i class="fas fa-balance-scale"></i>${repo.license?.spdx_id || 'No license'}</span>
                </div>
                <div class="project-footer">
                    <div class="project-topics">${topicsHTML}</div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}
