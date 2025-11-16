import { PostManager } from '../modules/postManager.js';
import { ModalManager } from '../modules/modalManager.js';
import { SearchManager } from '../modules/seachManager.js';
import { CookMode } from '../modules/cookMode.js';
import { ChefNavigation } from '../modules/chefNavigation.js';
import { RecipeNavigation } from '../modules/recipeNavigation.js'; // THÊM DÒNG NÀY

class FeedApp {
    constructor() {
        this.postManager = null;
        this.modalManager = null;
        this.searchManager = null;
        this.cookMode = null;
        this.chefNavigation = null;
        this.recipeNavigation = null; // THÊM DÒNG NÀY
    }

    async init() {
        console.log('🚀 Initializing Feed App...');
        
        try {
            // Khởi tạo PostManager trước
            this.postManager = new PostManager();
            await this.postManager.init();
            
            // Sau đó mới khởi tạo ModalManager
            this.modalManager = new ModalManager(this.postManager);
            this.searchManager = new SearchManager(this.postManager);
            this.chefNavigation = new ChefNavigation();
            this.recipeNavigation = new RecipeNavigation(); // THÊM DÒNG NÀY
            
            // Khởi tạo Cook Mode sau khi mọi thứ đã load
            setTimeout(() => {
                this.cookMode = new CookMode();
                window.cookMode = this.cookMode;
                console.log('🍳 Cook Mode initialized successfully');
            }, 100);

            console.log('✅ Feed App initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Feed App:', error);
        }
    }
}

// Khởi chạy ứng dụng khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    const app = new FeedApp();
    app.init();
    
    // Make app globally accessible for debugging
    window.feedApp = app;
});

// Export for testing or other modules
export { FeedApp };