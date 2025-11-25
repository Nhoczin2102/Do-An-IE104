/* FILE: main.js */

// Cập nhật thanh điều hướng dựa trên trạng thái đăng nhập
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginNav = document.getElementById('loginNav');
    const logoutNav = document.getElementById('logoutNav');
    
    if (currentUser) {
        if (loginNav) loginNav.style.display = 'none';
        if (logoutNav) logoutNav.style.display = 'flex';
        
        updateUserProfile(currentUser);
        
        if (typeof postManager !== 'undefined' && postManager?.updateCurrentUser) {
            postManager.updateCurrentUser();
        }
        if (typeof modalManager !== 'undefined' && modalManager?.updateCurrentUser) {
            modalManager.updateCurrentUser();
        }
    } else {
        if (loginNav) loginNav.style.display = 'flex';
        if (logoutNav) logoutNav.style.display = 'none';
        
        // Logic chuyển hướng nếu chưa đăng nhập (trừ trang login/register)
        if (!window.location.href.includes('login.html') && 
            !window.location.href.includes('register.html')) {
            // Tự động detect đường dẫn đúng
            const loginPath = window.location.pathname.includes('/pages/') ? './login.html' : './pages/login.html';
            window.location.href = loginPath;
        }
    }
}

// Cập nhật thông tin user trên toàn bộ giao diện
function updateUserProfile(user) {
    if (!user) return;
    
    updateSidebarInfo(user);
    updateProfileHeader(user);
    updatePostComposer(user);
    updateModalInfo(user);
}

// Cập nhật Sidebar (Hỗ trợ cả sidebar thường và sidebar mobile)
function updateSidebarInfo(user) {
    // Tìm avatar/name ở cả sidebar desktop và mobile (nhờ dùng chung ID hoặc class)
    const sidebarAvatar = document.getElementById('sidebarAvatar') || 
                          document.querySelector('.sidebar .profile__avatar');
    const sidebarName = document.getElementById('sidebarName') || 
                        document.querySelector('.sidebar .profile__name');
    const sidebarHandle = document.getElementById('sidebarHandle') || 
                          document.querySelector('.sidebar .profile__handle');
    
    if (sidebarAvatar) {
        // Xử lý đường dẫn ảnh (nếu đang ở trang con thì phải lùi thư mục)
        let avatarPath = user.avatar || '../assets/images/avatar.png';
        
        // Logic sửa đường dẫn ảnh tương đối
        if (!window.location.pathname.includes('/pages/') && avatarPath.startsWith('../')) {
             avatarPath = avatarPath.replace('../', './');
        } else if (window.location.pathname.includes('/pages/') && avatarPath.startsWith('./')) {
             avatarPath = avatarPath.replace('./', '../');
        }

        sidebarAvatar.src = avatarPath;
        sidebarAvatar.alt = user.name || 'Avatar';
    }
    if (sidebarName) {
        sidebarName.textContent = user.name || 'Người dùng';
    }
    if (sidebarHandle) {
        const username = user.username || user.email?.split('@')[0] || 'user';
        sidebarHandle.textContent = `@${username}`;
    }
}

// Cập nhật Profile Header
function updateProfileHeader(user) {
    const profileAvatar = document.getElementById('profileAvatar') || 
                          document.querySelector('.profile-header .profile-avatar img');
    const profileName = document.getElementById('profileName') || 
                        document.querySelector('.profile-header .profile-name');
    const profileBio = document.getElementById('profileBio') || 
                       document.querySelector('.profile-header .profile-bio');
    
    if (profileAvatar) {
        // Xử lý path ảnh cho profile header tương tự sidebar
        let avatarPath = user.avatar || '../assets/images/avatar.png';
        if (!window.location.pathname.includes('/pages/') && avatarPath.startsWith('../')) {
             avatarPath = avatarPath.replace('../', './');
        }
        profileAvatar.src = avatarPath;
    }
    if (profileName) {
        profileName.textContent = user.name || 'Người dùng';
    }
    if (profileBio && user.bio) {
        profileBio.textContent = user.bio;
    }
}

// Cập nhật Post Composer
function updatePostComposer(user) {
    const composerAvatars = document.querySelectorAll('.feed__composer-avatar, .composer img');
    composerAvatars.forEach(img => {
        let avatarPath = user.avatar || './assets/images/avatar.png';
         if (window.location.pathname.includes('/pages/') && avatarPath.startsWith('./')) {
             avatarPath = avatarPath.replace('./', '../');
        }
        img.src = avatarPath;
        img.alt = user.name || 'Avatar';
    });
}

// Cập nhật Modal
function updateModalInfo(user) {
    const modalUserName = document.getElementById('modalUserName');
    const modalUserHandle = document.getElementById('modalUserHandle');
    const modalUserAvatar = document.querySelector('.modal__user-avatar');
    
    if (modalUserName) modalUserName.textContent = user.name || 'Người dùng';
    if (modalUserHandle) {
        const username = user.username || user.email?.split('@')[0] || 'user';
        modalUserHandle.textContent = `@${username}`;
    }
    if (modalUserAvatar) {
        let avatarPath = user.avatar || './assets/images/avatar.png';
        if (window.location.pathname.includes('/pages/') && avatarPath.startsWith('./')) {
             avatarPath = avatarPath.replace('./', '../');
        }
        modalUserAvatar.src = avatarPath;
    }
}

// Xử lý đăng xuất
function setupLogout() {
    const logoutNav = document.getElementById('logoutNav');
    if (logoutNav) {
        logoutNav.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                localStorage.removeItem('currentUser');
                // Điều hướng về login phù hợp với vị trí file hiện tại
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = './login.html';
                } else {
                    window.location.href = './pages/login.html';
                }
            }
        });
    }
}

// Đồng bộ dữ liệu user mới nhất từ localStorage
function checkAndUpdateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUser = storedUsers.find(u => u.email === currentUser.email);
        
        if (updatedUser) {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            updateUserProfile(updatedUser);
        } else {
            updateUserProfile(currentUser);
        }
    }
}

// Kiểm tra xác thực và điều hướng
function checkAuthAndRedirect() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoginPage = window.location.href.includes('login.html');
    const isRegisterPage = window.location.href.includes('register.html');
    
    // Nếu chưa đăng nhập mà vào trang nội bộ
    if (!currentUser && !isLoginPage && !isRegisterPage) {
        const loginPath = window.location.pathname.includes('/pages/') ? './login.html' : './pages/login.html';
        window.location.href = loginPath;
        return false;
    }
    
    // Nếu đã đăng nhập mà vào login/register
    if (currentUser && (isLoginPage || isRegisterPage)) {
        const indexPath = window.location.pathname.includes('/pages/') ? '../index.html' : './index.html';
        window.location.href = indexPath;
        return false;
    }
    
    return true;
}

// --- CLASS QUẢN LÝ MOBILE SIDEBAR (FAB & DRAG) ---
class MobileSidebar {
    constructor() {
        this.wrapper = document.getElementById('mobileSidebarWrapper');
        this.fab = document.getElementById('sidebarFab');
        this.sidebar = document.getElementById('mobileSidebar');
        
        // Nếu trang hiện tại không có HTML sidebar thì dừng lại
        if (!this.wrapper || !this.fab) return;

        this.isDragging = false;
        this.hasMoved = false; 
        this.startX = 0;
        this.startY = 0;
        this.initialLeft = 0;
        this.initialTop = 0;

        this.init();
        
        // === FIX QUAN TRỌNG ===
        // Đồng bộ logic Resize với CSS breakpoint (768px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.wrapper) {
                // 1. Xóa toàn bộ style inline do JS thêm vào khi kéo thả
                this.wrapper.style = ''; 
                
                // 2. Đóng menu popup nếu đang mở
                this.wrapper.classList.remove('active');
                
                // 3. Reset icon về trạng thái ban đầu
                const icon = this.fab.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    init() {
        // 1. Sự kiện Click mở menu
        this.fab.addEventListener('click', (e) => {
            if (!this.hasMoved) { 
                this.toggleMenu();
            }
        });

        // 2. Sự kiện Kéo Thả (Touch & Mouse)
        const startHandler = (e) => {
            // Chỉ cho phép kéo khi menu ĐANG ĐÓNG
            if (this.wrapper.classList.contains('active')) return;

            this.isDragging = true;
            this.hasMoved = false;
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            this.startX = clientX;
            this.startY = clientY;

            const rect = this.wrapper.getBoundingClientRect();
            this.initialLeft = rect.left;
            this.initialTop = rect.top;
            
            // Ngăn chặn hành vi mặc định (như bôi đen text)
            // e.preventDefault(); // Tạm tắt để tránh lỗi scroll trên mobile
        };

        const moveHandler = (e) => {
    if (!this.isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - this.startX;
    const deltaY = clientY - this.startY;

    // === SỬA DÒNG NÀY: Tăng từ 5 lên 15 ===
    // Nếu di chuyển ít hơn 15px thì vẫn coi là CLICK (do rung tay), chưa tính là KÉO
    if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
        this.hasMoved = true;
    }

    // Chỉ thực sự di chuyển nút khi đã xác nhận là kéo (hasMoved = true)
    if (this.hasMoved) {
        this.wrapper.style.position = 'fixed'; 
        this.wrapper.style.right = 'auto';     
        this.wrapper.style.bottom = 'auto';
        this.wrapper.style.width = 'auto';
        
        let newLeft = this.initialLeft + deltaX;
        let newTop = this.initialTop + deltaY;

        // ... (đoạn logic giới hạn màn hình giữ nguyên) ...
        const maxX = window.innerWidth - this.fab.offsetWidth;
        const maxY = window.innerHeight - this.fab.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(0, Math.min(newTop, maxY));

        this.wrapper.style.left = `${newLeft}px`;
        this.wrapper.style.top = `${newTop}px`;
    }
};

        const endHandler = () => {
            this.isDragging = false;
        };

        // Gán sự kiện Touch (Mobile)
        this.fab.addEventListener('touchstart', startHandler, { passive: false });
        document.addEventListener('touchmove', moveHandler, { passive: false });
        document.addEventListener('touchend', endHandler);

        // Gán sự kiện Mouse (PC)
        this.fab.addEventListener('mousedown', startHandler);
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);

        // Đóng menu khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (this.wrapper.classList.contains('active') && 
                !this.wrapper.contains(e.target) && 
                !this.fab.contains(e.target)) {
                this.toggleMenu();
            }
        });
    }

    toggleMenu() {
        this.wrapper.classList.toggle('active');
        const icon = this.fab.querySelector('i');
        if (icon) {
            if (this.wrapper.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
}

// --- KHỞI TẠO ỨNG DỤNG ---

let postManager = null;
let modalManager = null;

async function initializeManagers() {
    // Chỉ khởi tạo PostManager ở trang chủ (nơi có list bài viết) hoặc trang có ID feed
    if (document.getElementById('feed')) {
        try {
            // Import động để tránh lỗi ở các trang khác
            const isPagesDir = window.location.pathname.includes('/pages/');
            
            // Đường dẫn chính xác tới file JS
            const postManagerPath = isPagesDir ? './modules/postManager.js' : './modules/postManager.js';
            const modalManagerPath = isPagesDir ? './modules/modalManager.js' : './modules/modalManager.js';
            
            // Tải PostManager
            const postModule = await import(postManagerPath);
            const { PostManager } = postModule;
            postManager = new PostManager();
            await postManager.init();
            
            // Tải ModalManager
            const modalModule = await import(modalManagerPath);
            const { ModalManager } = modalModule;
            modalManager = new ModalManager(postManager);
            
        } catch (err) {
            console.warn('Manager Init Warning (có thể bỏ qua nếu không phải trang chủ):', err);
        }
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    if (checkAuthAndRedirect()) {
        updateNavigation();
        setupLogout();
        checkAndUpdateUserProfile();
        
        // 1. Khởi tạo Sidebar Mobile (luôn chạy để bắt sự kiện resize)
        new MobileSidebar();

        // 2. Khởi tạo các Manager phức tạp
        await initializeManagers();
        
        // Đồng bộ lại avatar lần cuối sau khi mọi thứ đã load
        setTimeout(() => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                updateUserProfile(currentUser);
            }
        }, 100);
    }
});

// Lắng nghe thay đổi localStorage để đồng bộ realtime giữa các tab
window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            updateUserProfile(currentUser);
        }
    }
});

export { MobileSidebar };