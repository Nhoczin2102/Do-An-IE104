// setting.js - Quản lý tài khoản
document.addEventListener('DOMContentLoaded', () => {
    initializeUserData();
    setupEventListeners();
    loadLanguageSetting();
});

// Khởi tạo dữ liệu người dùng
function initializeUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Cập nhật thông tin văn bản
        document.getElementById('sidebarName').textContent = currentUser.name;
        document.getElementById('sidebarHandle').textContent = currentUser.email;
        document.getElementById('display-name').value = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        
        // Cập nhật avatar
        if (currentUser.avatar) {
            document.getElementById('sidebarAvatar').src = currentUser.avatar;
            document.getElementById('settingAvatar').src = currentUser.avatar;
        }
    } else {
        window.location.href = '../pages/login.html';
    }
}

// Thiết lập sự kiện
function setupEventListeners() {
    try {
        // Sự kiện đổi avatar
        const changeAvatar = document.getElementById('change-avatar');
        if (changeAvatar) {
            changeAvatar.addEventListener('click', handleAvatarChange);
        }
        
        const settingAvatar = document.getElementById('settingAvatar');
        if (settingAvatar) {
            settingAvatar.addEventListener('click', handleAvatarChange);
        }
        
        // Sự kiện thay đổi thông tin
        const displayName = document.getElementById('display-name');
        if (displayName) displayName.addEventListener('change', handleDisplayNameChange);
        
        const changePassword = document.getElementById('change-password');
        if (changePassword) changePassword.addEventListener('click', handleChangePassword);
        
        // Sự kiện tài khoản
        const logoutNav = document.getElementById('logoutNav');
        if (logoutNav) logoutNav.addEventListener('click', handleLogout);
        
        const deleteAccount = document.getElementById('delete-account');
        if (deleteAccount) deleteAccount.addEventListener('click', handleDeleteAccount);
        
        // Liên kết thông tin
        const openTos = document.getElementById('open-tos');
        if (openTos) openTos.addEventListener('click', handleOpenTos);
        
        const openPrivacy = document.getElementById('open-privacy');
        if (openPrivacy) openPrivacy.addEventListener('click', handleOpenPrivacy);
        
    } catch (error) {
        // Xử lý lỗi im lặng hoặc ghi log hệ thống nếu cần
    }
}

// Xử lý thay đổi Avatar
function handleAvatarChange() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước ảnh không được vượt quá 5MB!');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh!');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const avatarUrl = event.target.result;
                
                // Cập nhật UI hiện tại
                const sidebarAvatar = document.getElementById('sidebarAvatar');
                const settingAvatar = document.getElementById('settingAvatar');
                
                if (sidebarAvatar) sidebarAvatar.src = avatarUrl;
                if (settingAvatar) settingAvatar.src = avatarUrl;
                
                // Lưu vào localStorage
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) {
                    currentUser.avatar = avatarUrl;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    updateUserInList(currentUser);
                    
                    // Cập nhật toàn bộ trang
                    updateAvatarGlobally(avatarUrl);
                }
                
                alert('Đã cập nhật ảnh đại diện!');
            };
            
            reader.onerror = () => {
                alert('Có lỗi xảy ra khi đọc file!');
            };
            
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Cập nhật avatar trên toàn bộ ứng dụng
function updateAvatarGlobally(avatarUrl) {
    const allAvatars = document.querySelectorAll('img[src*="avatar"], .sidebar__avatar, .setting-avatar, .profile-avatar, .composer-avatar');
    
    allAvatars.forEach(avatar => {
        if (avatar.id !== 'settingAvatar' && avatar.id !== 'sidebarAvatar') {
            avatar.src = avatarUrl;
        }
    });
    
    if (typeof updateUserProfile === 'function') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        updateUserProfile(currentUser);
    }
    
    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
}

// Các hàm xử lý phụ trợ
function handleOpenTos() {
    alert('Điều khoản dịch vụ sẽ được hiển thị tại đây!');
}

function handleOpenPrivacy() {
    alert('Chính sách riêng tư sẽ được hiển thị tại đây!');
}

function handleDisplayNameChange(event) {
    const newName = event.target.value.trim();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (newName && newName !== currentUser.name) {
        currentUser.name = newName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        document.getElementById('sidebarName').textContent = newName;
        updateUserInList(currentUser);
        
        alert('Đã cập nhật tên hiển thị!');
    }
}

function handleChangePassword() {
    const currentPassword = prompt('Nhập mật khẩu hiện tại:');
    if (!currentPassword) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentPassword !== currentUser.password) {
        alert('Mật khẩu hiện tại không đúng!');
        return;
    }
    
    const newPassword = prompt('Nhập mật khẩu mới:');
    if (!newPassword || newPassword.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    const confirmPassword = prompt('Xác nhận mật khẩu mới:');
    if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserInList(currentUser);
    
    alert('Đã đổi mật khẩu thành công!');
}

function handleLogout(event) {
    event.preventDefault();
    
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        alert('Đã đăng xuất thành công!');
        window.location.href = '../pages/login.html';
    }
}

function handleDeleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const confirmEmail = prompt(`Nhập email "${currentUser.email}" để xác nhận xóa tài khoản:`);
    
    if (confirmEmail !== currentUser.email) {
        alert('Email xác nhận không đúng!');
        return;
    }
    
    const confirmText = prompt('Nhập "DELETE" để xác nhận xóa vĩnh viễn:');
    if (confirmText !== 'DELETE') {
        alert('Xác nhận không đúng!');
        return;
    }
    
    if (confirm('TÀI KHOẢN SẼ BỊ XÓA VĨNH VIỄN! Bạn có chắc chắn?')) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter(user => user.email !== currentUser.email);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        localStorage.removeItem('currentUser');
        
        alert('Tài khoản đã được xóa thành công!');
        window.location.href = '../pages/login.html';
    }
}

// Cập nhật user trong danh sách tổng
function updateUserInList(updatedUser) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(user => user.email === updatedUser.email);
    
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function loadLanguageSetting() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'vi';
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
    }
}