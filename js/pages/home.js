import { PostManager } from '../modules/postManager.js';
import { ModalManager } from '../modules/modalManager.js';
import { SearchManager } from '../modules/seachManager.js';
import { CookMode } from '../modules/cookMode.js';

class FeedApp {
    constructor() {
        this.postManager = null;
        this.modalManager = null;
        this.searchManager = null;
        this.cookMode = null;
    }

    init() {
        console.log('🚀 Initializing Feed App...');
        
        try {
            // Khởi tạo các manager
            this.postManager = new PostManager();
            this.modalManager = new ModalManager(this.postManager);
            this.searchManager = new SearchManager(this.postManager);
            
            // Khởi tạo ứng dụng
            this.postManager.init();
            
            // Khởi tạo Cook Mode sau khi mọi thứ đã load
            setTimeout(() => {
                this.cookMode = new CookMode();
                window.cookMode = this.cookMode; // Make globally accessible if needed
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

// Hàm kiểm tra trạng thái đăng nhập và cập nhật navigation
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginNav = document.getElementById('loginNav');
    const logoutNav = document.getElementById('logoutNav');
    
    if (currentUser) {
        // Đã đăng nhập - hiển thị nút Đăng xuất, ẩn nút Đăng nhập
        loginNav.style.display = 'none';
        logoutNav.style.display = 'flex';
        
        // Cập nhật thông tin trong sidebar
        updateSidebarInfo(currentUser);
    } else {
        // Chưa đăng nhập - hiển thị nút Đăng nhập, ẩn nút Đăng xuất
        loginNav.style.display = 'flex';
        logoutNav.style.display = 'none';
    }
}

// Hàm cập nhật thông tin sidebar
function updateSidebarInfo(user) {
    const sidebarAvatar = document.querySelector('.profile__avatar');
    const profileName = document.querySelector('.profile__name');
    const profileHandle = document.querySelector('.profile__handle');
    
    if (sidebarAvatar) {
        sidebarAvatar.src = user.avatar || './assets/images/avatar.png';
    }
    if (profileName) {
        profileName.textContent = user.name;
    }
    if (profileHandle) {
        profileHandle.textContent = `@${user.email.split('@')[0]}`;
    }
}

// Hàm xử lý đăng xuất
function setupLogout() {
    const logoutNav = document.getElementById('logoutNav');
    if (logoutNav) {
        logoutNav.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                localStorage.removeItem('currentUser');
                // Chuyển hướng về trang login
                window.location.href = './pages/login.html';
            }
        });
    }
}

// Gọi hàm khi trang load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    setupLogout();
});

// Hàm xử lý đăng xuất


// Export for testing or other modules
export { FeedApp };