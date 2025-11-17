export class SearchManager {
    constructor(postManager) {
        this.postManager = postManager;
        this.searchInput = document.querySelector('.header__search-input');
        this.searchBtn = document.querySelector('.header__search-button');
        
        this.bindEvents();
    }

    // Gắn sự kiện tìm kiếm
    bindEvents() {
        if (this.searchBtn && this.searchInput) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }
    }

    // Thực hiện tìm kiếm
    performSearch() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        this.postManager.searchPosts(searchTerm);
    }

    // Xóa tìm kiếm
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.postManager.renderFeed();
    }
}