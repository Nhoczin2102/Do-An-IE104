// js/pages/famous-chefs.js
import { chefsData } from '../../data/chefsData.js'

class FamousChefs {
    constructor() {
        this.chefs = [...chefsData];
        this.filteredChefs = [...chefsData];
        this.currentCategory = 'all';
        this.currentSort = 'popular';
        this.currentPage = 1;
        this.chefsPerPage = 6;
        
        this.init();
    }

    init() {
        this.renderChefs();
        this.bindEvents();
        this.updateChefCount();
    }

    renderChefs() {
        const grid = document.getElementById('chefsGrid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.chefsPerPage;
        const endIndex = startIndex + this.chefsPerPage;
        const chefsToShow = this.filteredChefs.slice(0, endIndex);

        grid.innerHTML = chefsToShow.map(chef => this.createChefCard(chef)).join('');
        
        this.updateLoadMoreButton();
    }

    createChefCard(chef) {
        const stars = this.generateStars(chef.rating);
        
        return `
            <div class="chef-card" data-category="${chef.category}" data-id="${chef.id}">
                ${chef.featured ? '<div class="chef-badge" data-featured>Nổi bật</div>' : ''}
                
                <div class="chef-card-header">
                    <div class="chef-avatar">
                        <img src="${chef.avatar}" alt="${chef.name}" data-avatar>
                    </div>
                    <h3 class="chef-name" data-name>${chef.name}</h3>
                    <div class="chef-specialty" data-specialty>${chef.specialty}</div>
                    <div class="chef-rating">
                        <div class="chef-stars" data-stars>${stars}</div>
                        <span class="chef-rating-score" data-rating>${chef.rating}</span>
                    </div>
                </div>

                <div class="chef-card-body">
                    <p class="chef-bio" data-bio>${chef.bio}</p>
                    
                    <div class="chef-stats">
                        <div class="chef-stat">
                            <span class="chef-stat-number" data-recipes>${chef.recipes}</span>
                            <span class="chef-stat-label">Công thức</span>
                        </div>
                        <div class="chef-stat">
                            <span class="chef-stat-number" data-followers>${chef.followers}</span>
                            <span class="chef-stat-label">Theo dõi</span>
                        </div>
                        <div class="chef-stat">
                            <span class="chef-stat-number" data-experience>${chef.experience}</span>
                            <span class="chef-stat-label">Kinh nghiệm</span>
                        </div>
                    </div>

                    <div class="chef-expertise" data-expertise>
                        ${chef.expertise.map(exp => `<span class="expertise-tag">${exp}</span>`).join('')}
                    </div>
                </div>

                <div class="chef-card-footer">
                    <button class="btn-follow ${chef.isFollowing ? 'btn-following' : ''}" 
                            data-follow-btn data-chef-id="${chef.id}">
                        <i class="fas ${chef.isFollowing ? 'fa-check' : 'fa-plus'}"></i>
                        <span data-follow-text>${chef.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</span>
                    </button>
                    <button class="btn-view-profile" data-view-profile data-chef-id="${chef.id}">
                        Xem hồ sơ
                    </button>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    filterChefs(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        if (category === 'all') {
            this.filteredChefs = [...this.chefs];
        } else {
            this.filteredChefs = this.chefs.filter(chef => chef.category === category);
        }
        
        this.sortChefs(this.currentSort);
        this.renderChefs();
        this.updateChefCount();
    }

    sortChefs(sortBy) {
        this.currentSort = sortBy;
        
        switch (sortBy) {
            case 'newest':
                this.filteredChefs.sort((a, b) => b.id - a.id);
                break;
            case 'recipes':
                this.filteredChefs.sort((a, b) => b.recipes - a.recipes);
                break;
            case 'followers':
                this.filteredChefs.sort((a, b) => {
                    const aFollowers = this.parseFollowers(a.followers);
                    const bFollowers = this.parseFollowers(b.followers);
                    return bFollowers - aFollowers;
                });
                break;
            case 'popular':
            default:
                this.filteredChefs.sort((a, b) => b.rating - a.rating);
        }
        
        this.renderChefs();
    }

    parseFollowers(followersStr) {
        if (followersStr.includes('K')) {
            return parseFloat(followersStr) * 1000;
        } else if (followersStr.includes('M')) {
            return parseFloat(followersStr) * 1000000;
        }
        return parseInt(followersStr);
    }

    searchChefs(searchTerm) {
        if (!searchTerm) {
            this.filterChefs(this.currentCategory);
            return;
        }
        
        const term = searchTerm.toLowerCase();
        this.filteredChefs = this.chefs.filter(chef => 
            chef.name.toLowerCase().includes(term) ||
            chef.specialty.toLowerCase().includes(term) ||
            chef.bio.toLowerCase().includes(term) ||
            chef.expertise.some(exp => exp.toLowerCase().includes(term))
        );
        
        this.currentPage = 1;
        this.renderChefs();
        this.updateChefCount();
    }

    toggleFollow(chefId) {
        const chef = this.chefs.find(c => c.id === chefId);
        if (chef) {
            chef.isFollowing = !chef.isFollowing;
            this.renderChefs();
            
            // Show notification
            this.showNotification(
                chef.isFollowing ? 
                `Đã theo dõi ${chef.name}` : 
                `Đã bỏ theo dõi ${chef.name}`
            );
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'chef-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 24px;
            background: var(--primary-color);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-hover);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updateChefCount() {
        const count = this.filteredChefs.length;
        const title = document.querySelector('.chefs-title');
        if (title) {
            const baseTitle = '👨‍🍳 Đầu Bếp Nổi Tiếng';
            title.textContent = `${baseTitle} (${count})`;
        }
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreChefs');
        if (!loadMoreBtn) return;
        
        const totalChefs = this.filteredChefs.length;
        const currentlyShowing = this.currentPage * this.chefsPerPage;
        
        if (currentlyShowing >= totalChefs) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
        }
    }

    loadMoreChefs() {
        this.currentPage++;
        this.renderChefs();
    }

    bindEvents() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.filterChefs(tab.dataset.category);
            });
        });

        // Search input
        const searchInput = document.getElementById('chefSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchChefs(e.target.value);
            });
        }

        // Sort select
        const sortSelect = document.getElementById('chefSortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortChefs(e.target.value);
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreChefs');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreChefs();
            });
        }

        // Follow buttons and profile clicks
        document.addEventListener('click', (e) => {
            // Click on follow button
            if (e.target.closest('[data-follow-btn]')) {
                e.preventDefault();
                e.stopPropagation();
                const button = e.target.closest('[data-follow-btn]');
                const chefId = parseInt(button.dataset.chefId);
                this.toggleFollow(chefId);
            }

            // Click on view profile button
            if (e.target.closest('[data-view-profile]')) {
                e.preventDefault();
                e.stopPropagation();
                const button = e.target.closest('[data-view-profile]');
                const chefId = parseInt(button.dataset.chefId);
                this.viewChefProfile(chefId);
            }

            // Click on chef card (but not on buttons)
            const chefCard = e.target.closest('.chef-card');
            if (chefCard && 
                !e.target.closest('[data-follow-btn]') && 
                !e.target.closest('[data-view-profile]')) {
                const chefId = parseInt(chefCard.dataset.id);
                this.viewChefProfile(chefId);
            }
        });
    }

    viewChefProfile(chefId) {
        // Redirect to chef profile page
        window.location.href = `chef-profile.html?id=${chefId}`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FamousChefs();
});