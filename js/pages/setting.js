document.addEventListener('DOMContentLoaded', () => {
    initializeUserData();
    setupEventListeners();
    loadLanguageSetting();
    initializePolicySections();
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

// Khởi tạo các phần chính sách
function initializePolicySections() {
    // Tạo nội dung cho điều khoản dịch vụ
    const tosContent = `
        <h3>Điều Khoản Dịch Vụ</h3>
        <p><strong>Cập nhật lần cuối: ${new Date().toLocaleDateString('vi-VN')}</strong></p>
        
        <h4>1. Chấp nhận điều khoản</h4>
        <p>Bằng việc sử dụng ứng dụng POTPAN, bạn đồng ý với các điều khoản và điều kiện được quy định dưới đây.</p>
        
        <h4>2. Tài khoản người dùng</h4>
        <p>Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu. POTPAN không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc bạn không tuân thủ nghĩa vụ này.</p>
        
        <h4>3. Nội dung người dùng</h4>
        <p>Bạn giữ bản quyền đối với nội dung bạn tạo ra trên POTPAN. Tuy nhiên, bằng cách đăng tải nội dung, bạn cấp cho POTPAN giấy phép toàn cầu, không độc quyền, miễn phí bản quyền để sử dụng, sao chép, chỉnh sửa nội dung đó.</p>
        
        <h4>4. Quy tắc ứng xử</h4>
        <p>Bạn đồng ý không đăng tải nội dung:</p>
        <ul>
            <li>Vi phạm pháp luật hoặc quyền của bất kỳ bên thứ ba nào</li>
            <li>Chứa đựng thông tin sai lệch, lừa đảo</li>
            <li>Phân biệt chủng tộc, kỳ thị, hoặc thù địch</li>
            <li>Spam hoặc quảng cáo không được cho phép</li>
        </ul>
        
        <h4>5. Chấm dứt dịch vụ</h4>
        <p>POTPAN có quyền tạm ngừng hoặc chấm dứt dịch vụ đối với tài khoản vi phạm các điều khoản này.</p>
    `;
    
    // Tạo nội dung cho chính sách riêng tư
    const privacyContent = `
        <h3>Chính Sách Riêng Tư</h3>
        <p><strong>Cập nhật lần cuối: ${new Date().toLocaleDateString('vi-VN')}</strong></p>
        
        <h4>1. Thông tin chúng tôi thu thập</h4>
        <p>Chúng tôi thu thập thông tin bạn cung cấp trực tiếp khi:</p>
        <ul>
            <li>Tạo tài khoản (tên, email, mật khẩu)</li>
            <li>Cập nhật hồ sơ (ảnh đại diện, thông tin cá nhân)</li>
            <li>Tương tác với ứng dụng (công thức đã lưu, bình luận)</li>
        </ul>
        
        <h4>2. Cách chúng tôi sử dụng thông tin</h4>
        <p>Thông tin của bạn được sử dụng để:</p>
        <ul>
            <li>Cung cấp và cải thiện dịch vụ</li>
            <li>Giao tiếp với bạn về các cập nhật và thông báo</li>
            <li>Bảo vệ an toàn và bảo mật của ứng dụng</li>
            <li>Tuân thủ các nghĩa vụ pháp lý</li>
        </ul>
        
        <h4>3. Chia sẻ thông tin</h4>
        <p>Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi:</p>
        <ul>
            <li>Có sự đồng ý của bạn</li>
            <li>Theo yêu cầu pháp lý</li>
            <li>Để bảo vệ quyền và tài sản của POTPAN</li>
        </ul>
        
        <h4>4. Bảo mật thông tin</h4>
        <p>Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin của bạn khỏi truy cập trái phép, sửa đổi hoặc tiết lộ.</p>
        
        <h4>5. Quyền của bạn</h4>
        <p>Bạn có quyền:</p>
        <ul>
            <li>Truy cập và chỉnh sửa thông tin cá nhân</li>
            <li>Xóa tài khoản của bạn</li>
            <li>Yêu cầu ngừng sử dụng dữ liệu của bạn</li>
        </ul>
    `;
    
    // Thêm nội dung vào các phần tương ứng
    document.getElementById('tos-content').innerHTML = tosContent;
    document.getElementById('privacy-content').innerHTML = privacyContent;
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
        
        // Sự kiện mở/đóng các phần chính sách
        const tosToggle = document.getElementById('tos-toggle');
        if (tosToggle) tosToggle.addEventListener('click', togglePolicySection);
        
        const privacyToggle = document.getElementById('privacy-toggle');
        if (privacyToggle) privacyToggle.addEventListener('click', togglePolicySection);
        
    } catch (error) {
        console.error('Lỗi khi thiết lập sự kiện:', error);
    }
}

// Xử lý mở/đóng các phần chính sách
function togglePolicySection(event) {
    const button = event.currentTarget;
    const contentId = button.getAttribute('data-target');
    const content = document.getElementById(contentId);
    const icon = button.querySelector('.toggle-icon');
    
    if (content.style.display === 'block') {
        content.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        content.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
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