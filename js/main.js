// Cập nhật thanh điều hướng dựa trên trạng thái đăng nhập
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginNav = document.getElementById('loginNav');
    const logoutNav = document.getElementById('logoutNav');
    
    if (currentUser) {
        if (loginNav) loginNav.style.display = 'none';
        if (logoutNav) logoutNav.style.display = 'flex';
        
        updateUserProfile(currentUser);
        
        if (postManager && postManager.updateCurrentUser) {
            postManager.updateCurrentUser();
        }
        if (modalManager && modalManager.updateCurrentUser) {
            modalManager.updateCurrentUser();
        }
    } else {
        if (loginNav) loginNav.style.display = 'flex';
        if (logoutNav) logoutNav.style.display = 'none';
        
        if (!window.location.href.includes('login.html') && 
            !window.location.href.includes('register.html')) {
            window.location.href = './pages/login.html';
        }
        
        if (postManager && postManager.updateCurrentUser) {
            postManager.updateCurrentUser();
        }
        if (modalManager && modalManager.updateCurrentUser) {
            modalManager.updateCurrentUser();
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
    
    if (postManager && postManager.updateCurrentUser) {
        postManager.updateCurrentUser();
    }
    if (modalManager && modalManager.updateCurrentUser) {
        modalManager.updateCurrentUser();
    }
}

// Cập nhật Sidebar
function updateSidebarInfo(user) {
    const sidebarAvatar = document.getElementById('sidebarAvatar') || 
                          document.querySelector('.sidebar .profile__avatar');
    const sidebarName = document.getElementById('sidebarName') || 
                        document.querySelector('.sidebar .profile__name');
    const sidebarHandle = document.getElementById('sidebarHandle') || 
                          document.querySelector('.sidebar .profile__handle');
    
    if (sidebarAvatar) {
        sidebarAvatar.src = user.avatar || './assets/images/avatar.png';
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
        profileAvatar.src = user.avatar || './assets/images/avatar.png';
        profileAvatar.alt = user.name || 'Avatar';
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
    const composerAvatar = document.querySelector('.feed__composer-avatar');
    if (composerAvatar) {
        composerAvatar.src = user.avatar || './assets/images/avatar.png';
        composerAvatar.alt = user.name || 'Avatar';
        console.log('Đã cập nhật composer avatar:', composerAvatar.src);
    }
    
    const oldComposerAvatar = document.querySelector('.composer img');
    if (oldComposerAvatar) {
        oldComposerAvatar.src = user.avatar || './assets/images/avatar.png';
        oldComposerAvatar.alt = user.name || 'Avatar';
    }
}

// Cập nhật Modal
function updateModalInfo(user) {
    const modalUserName = document.getElementById('modalUserName');
    const modalUserHandle = document.getElementById('modalUserHandle');
    const modalUserAvatar = document.querySelector('.modal__user-avatar');
    
    if (modalUserName) {
        modalUserName.textContent = user.name || 'Người dùng';
    }
    if (modalUserHandle) {
        const username = user.username || user.email?.split('@')[0] || 'user';
        modalUserHandle.textContent = `@${username}`;
    }
    if (modalUserAvatar) {
        modalUserAvatar.src = user.avatar || './assets/images/avatar.png';
        modalUserAvatar.alt = user.name || 'Avatar';
    }
    
    const oldModalAvatar = document.querySelector('.modal .post-user img');
    const oldModalName = document.querySelector('.modal .user-name');
    const oldModalHandle = document.querySelector('.modal .user-handle');
    
    if (oldModalAvatar) {
        oldModalAvatar.src = user.avatar || './assets/images/avatar.png';
        oldModalAvatar.alt = user.name || 'Avatar';
    }
    if (oldModalName) {
        oldModalName.textContent = user.name || 'Người dùng';
    }
    if (oldModalHandle) {
        const username = user.username || user.email?.split('@')[0] || 'user';
        oldModalHandle.textContent = `@${username}`;
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
                window.location.href = './pages/login.html';
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
            
            if (postManager && postManager.updateCurrentUser) {
                postManager.updateCurrentUser();
            }
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
    
    if (!currentUser && !isLoginPage && !isRegisterPage) {
        window.location.href = './pages/login.html';
        return false;
    }
    
    if (currentUser && (isLoginPage || isRegisterPage)) {
        window.location.href = '../index.html';
        return false;
    }
    
    return true;
}

let postManager = null;

// Khởi tạo PostManager
async function initializePostManager() {
    if (typeof PostManager !== 'undefined') {
        const { PostManager } = await import('./managers/postManager.js');
        postManager = new PostManager();
        await postManager.init();
        
        if (postManager.updateCurrentUser) {
            postManager.updateCurrentUser();
        }
    }
}

let modalManager = null;

// Khởi tạo ModalManager
async function initializeModalManager(postManager) {
    if (typeof ModalManager !== 'undefined') {
        const { ModalManager } = await import('./managers/modalManager.js');
        modalManager = new ModalManager(postManager);
        
        console.log('ModalManager initialized with user:', modalManager.currentUser);
    }
}

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', async function() {
    if (checkAuthAndRedirect()) {
        updateNavigation();
        setupLogout();
        checkAndUpdateUserProfile();
        
        await initializePostManager();
        if (postManager) {
            await initializeModalManager(postManager);
        }
        
        setTimeout(() => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                updatePostComposer(currentUser);
            }
        }, 100);
    }
});

// Đồng bộ khi thay đổi tab
window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            updatePostComposer(currentUser);
        }
    }
});