import { PostManager } from '../modules/postManager.js';
import { ModalManager } from '../modules/modalManager.js';
import { SearchManager } from '../modules/seachManager.js';
import { CookMode } from '../modules/cookMode.js';
import { ChefNavigation } from '../modules/chefNavigation.js';
import { RecipeNavigation } from '../modules/recipeNavigation.js';

class FeedApp {
    constructor() {
        this.postManager = null;
        this.modalManager = null;
        this.searchManager = null;
        this.cookMode = null;
        this.chefNavigation = null;
        this.recipeNavigation = null;
    }

    async init() {
        try {
            // Khởi tạo PostManager
            this.postManager = new PostManager();
            await this.postManager.init();
            
            // Khởi tạo các Manager bổ trợ
            this.modalManager = new ModalManager(this.postManager);
            this.searchManager = new SearchManager(this.postManager);
            this.chefNavigation = new ChefNavigation();
            this.recipeNavigation = new RecipeNavigation();
            
            // Khởi tạo Cook Mode
            setTimeout(() => {
                this.cookMode = new CookMode();
                window.cookMode = this.cookMode;
            }, 100);
            
        } catch (error) {
            console.error('Lỗi khởi tạo Feed App:', error);
        }
    }
}

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    const app = new FeedApp();
    app.init();
    
    window.feedApp = app;
});

export { FeedApp };