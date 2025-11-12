
// Hàm kiểm tra trạng thái đăng nhập và cập nhật navigation
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginNav = document.getElementById('loginNav');
    const logoutNav = document.getElementById('logoutNav');
    
    if (currentUser) {
        // Đã đăng nhập - hiển thị nút Đăng xuất, ẩn nút Đăng nhập
        if (loginNav) loginNav.style.display = 'none';
        if (logoutNav) logoutNav.style.display = 'flex';
        
        // Cập nhật thông tin người dùng trên toàn bộ trang
        updateUserProfile(currentUser);
    } else {
        // Chưa đăng nhập - hiển thị nút Đăng nhập, ẩn nút Đăng xuất
        if (loginNav) loginNav.style.display = 'flex';
        if (logoutNav) logoutNav.style.display = 'none';
        
        // Nếu chưa đăng nhập và không ở trang login, chuyển hướng về trang login
        if (!window.location.href.includes('login.html') && 
            !window.location.href.includes('register.html')) {
            window.location.href = './pages/login.html';
        }
    }
}

// Hàm tổng quát cập nhật thông tin người dùng trên tất cả các trang
function updateUserProfile(user) {
    if (!user) return;
    
    // Cập nhật sidebar (nếu có)
    updateSidebarInfo(user);
    
    // Cập nhật profile header (nếu có)
    updateProfileHeader(user);
    
    // Cập nhật thông tin trong post composer (nếu có)
    updatePostComposer(user);
    
    // Cập nhật thông tin trong modal (nếu có)
    updateModalInfo(user);
}

// Hàm cập nhật thông tin sidebar
function updateSidebarInfo(user) {
    const sidebarAvatar = document.getElementById('sidebarAvatar') || 
                         document.querySelector('.sidebar .profile__avatar');
    const sidebarName = document.getElementById('sidebarName') || 
                       document.querySelector('.sidebar .profile__name');
    const sidebarHandle = document.getElementById('sidebarHandle') || 
                         document.querySelector('.sidebar .profile__handle');
    
    if (sidebarAvatar) {
        sidebarAvatar.src = user.avatar || '../assets/images/avatar.png';
        sidebarAvatar.alt = user.name || 'Avatar';
    }
    if (sidebarName) {
        sidebarName.textContent = user.name || 'Người dùng';
    }
    if (sidebarHandle) {
        const username = user.username || user.email.split('@')[0];
        sidebarHandle.textContent = `@${username}`;
    }
}

// Hàm cập nhật profile header
function updateProfileHeader(user) {
    const profileAvatar = document.getElementById('profileAvatar') || 
                         document.querySelector('.profile-header .profile-avatar img');
    const profileName = document.getElementById('profileName') || 
                       document.querySelector('.profile-header .profile-name');
    const profileBio = document.getElementById('profileBio') || 
                      document.querySelector('.profile-header .profile-bio');
    
    if (profileAvatar) {
        profileAvatar.src = user.avatar || '../assets/images/avatar.png';
        profileAvatar.alt = user.name || 'Avatar';
    }
    if (profileName) {
        profileName.textContent = user.name || 'Người dùng';
    }
    if (profileBio && user.bio) {
        profileBio.textContent = user.bio;
    }
}

// Hàm cập nhật post composer
function updatePostComposer(user) {
    const composerAvatar = document.querySelector('.composer img');
    if (composerAvatar) {
        composerAvatar.src = user.avatar || '../assets/images/avatar.png';
        composerAvatar.alt = user.name || 'Avatar';
    }
}

// Hàm cập nhật modal info
function updateModalInfo(user) {
    const modalAvatar = document.querySelector('.modal .post-user img');
    const modalName = document.querySelector('.modal .user-name');
    const modalHandle = document.querySelector('.modal .user-handle');
    
    if (modalAvatar) {
        modalAvatar.src = user.avatar || '../assets/images/avatar.png';
        modalAvatar.alt = user.name || 'Avatar';
    }
    if (modalName) {
        modalName.textContent = user.name || 'Người dùng';
    }
    if (modalHandle) {
        const username = user.username || user.email.split('@')[0];
        modalHandle.textContent = `@${username}`;
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

// Kiểm tra và cập nhật thông tin người dùng từ localStorage
function checkAndUpdateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Lấy thông tin mới nhất từ localStorage (nếu có cập nhật)
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

// Hàm kiểm tra đăng nhập và chuyển hướng
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

// Gọi hàm khi trang load
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuthAndRedirect()) {
        updateNavigation();
        setupLogout();
        checkAndUpdateUserProfile();
    }
});
