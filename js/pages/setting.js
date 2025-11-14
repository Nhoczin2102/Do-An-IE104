// setting.js - Quản lý tài khoản
document.addEventListener('DOMContentLoaded', () => {
    initializeUserData();
    setupEventListeners();
    loadLanguageSetting();
});

function initializeUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Cập nhật thông tin người dùng
        document.getElementById('sidebarName').textContent = currentUser.name;
        document.getElementById('sidebarHandle').textContent = currentUser.email;
        document.getElementById('display-name').value = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        
        // Cập nhật avatar cả sidebar và setting
        if (currentUser.avatar) {
            document.getElementById('sidebarAvatar').src = currentUser.avatar;
            document.getElementById('settingAvatar').src = currentUser.avatar;
        }
    } else {
        // Chưa đăng nhập, chuyển về trang login
        window.location.href = '../pages/login.html';
    }
}

function setupEventListeners() {
    // Đổi tên hiển thị
    document.getElementById('display-name').addEventListener('change', handleDisplayNameChange);
    
    // Đổi mật khẩu
    document.getElementById('change-password').addEventListener('click', handleChangePassword);
    
    // Đổi avatar (trong setting content)
    document.getElementById('change-avatar').addEventListener('click', handleAvatarChange);
    
    // Avatar image click (tùy chọn)
    document.getElementById('settingAvatar').addEventListener('click', handleAvatarChange);
    
    // Ngôn ngữ
    document.getElementById('language').addEventListener('change', handleLanguageChange);
    
    // Đăng xuất
    document.getElementById('logoutNav').addEventListener('click', handleLogout);
    
    // Xóa tài khoản
    document.getElementById('delete-account').addEventListener('click', handleDeleteAccount);
    
    // Các button khác
    document.getElementById('open-tos').addEventListener('click', handleOpenTos);
    document.getElementById('open-privacy').addEventListener('click', handleOpenPrivacy);
}

function handleAvatarChange() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('❌ Kích thước ảnh không được vượt quá 5MB!');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const avatarUrl = event.target.result;
                
                // Cập nhật avatar cả sidebar và setting
                document.getElementById('sidebarAvatar').src = avatarUrl;
                document.getElementById('settingAvatar').src = avatarUrl;
                
                // Lưu vào localStorage
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                currentUser.avatar = avatarUrl;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserInList(currentUser);
                
                alert('✅ Đã cập nhật ảnh đại diện!');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Thêm hàm xử lý cho các button mới
function handleOpenTos() {
    alert('📄 Điều khoản dịch vụ sẽ được hiển thị tại đây!');
    // window.open('./terms-of-service.html', '_blank');
}

function handleOpenPrivacy() {
    alert('🔒 Chính sách riêng tư sẽ được hiển thị tại đây!');
    // window.open('./privacy-policy.html', '_blank');
}

// Các hàm khác giữ nguyên...
function handleDisplayNameChange(event) {
    const newName = event.target.value.trim();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (newName && newName !== currentUser.name) {
        // Cập nhật localStorage
        currentUser.name = newName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Cập nhật tất cả các nơi hiển thị
        document.getElementById('sidebarName').textContent = newName;
        
        // Cập nhật trong danh sách users
        updateUserInList(currentUser);
        
        alert('✅ Đã cập nhật tên hiển thị!');
    }
}

function handleChangePassword() {
    const currentPassword = prompt('Nhập mật khẩu hiện tại:');
    if (!currentPassword) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Kiểm tra mật khẩu hiện tại
    if (currentPassword !== currentUser.password) {
        alert('❌ Mật khẩu hiện tại không đúng!');
        return;
    }
    
    const newPassword = prompt('Nhập mật khẩu mới:');
    if (!newPassword || newPassword.length < 6) {
        alert('❌ Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    const confirmPassword = prompt('Xác nhận mật khẩu mới:');
    if (newPassword !== confirmPassword) {
        alert('❌ Mật khẩu xác nhận không khớp!');
        return;
    }
    
    // Cập nhật mật khẩu
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserInList(currentUser);
    
    alert('✅ Đã đổi mật khẩu thành công!');
}

function handleLanguageChange(event) {
    const selectedLanguage = event.target.value;
    localStorage.setItem('preferredLanguage', selectedLanguage);
    
    // Hiển thị thông báo
    const languageNames = {
        'vi': 'Tiếng Việt',
        'en': 'English',
        'fr': 'Français',
        'es': 'Español'
    };
    
    alert(`🌐 Đã chuyển ngôn ngữ sang: ${languageNames[selectedLanguage]}`);
}

function handleLogout(event) {
    event.preventDefault();
    
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        alert('👋 Đã đăng xuất thành công!');
        window.location.href = '../pages/login.html';
    }
}

function handleDeleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const confirmEmail = prompt(`Nhập email "${currentUser.email}" để xác nhận xóa tài khoản:`);
    
    if (confirmEmail !== currentUser.email) {
        alert('❌ Email xác nhận không đúng!');
        return;
    }
    
    const confirmText = prompt('Nhập "DELETE" để xác nhận xóa vĩnh viễn:');
    if (confirmText !== 'DELETE') {
        alert('❌ Xác nhận không đúng!');
        return;
    }
    
    if (confirm('⚠️ TÀI KHOẢN SẼ BỊ XÓA VĨNH VIỄN! Bạn có chắc chắn?')) {
        // Xóa khỏi danh sách users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter(user => user.email !== currentUser.email);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Xóa currentUser
        localStorage.removeItem('currentUser');
        
        alert('🗑️ Tài khoản đã được xóa thành công!');
        window.location.href = '../pages/login.html';
    }
}

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
    document.getElementById('language').value = savedLanguage;
}