// Quản lý Toggle Form (Signin/Signup/Forgot)
const root = document.getElementById('container');
const signupLink = document.getElementById('signupLink');
const signinLink = document.getElementById('signinLink');
const forgotLink = document.getElementById('forgotLink');
const backToLogin = document.getElementById('backToLogin');

// Reset trạng thái form
function resetAllForms() {
    root.classList.remove('container--signup-active', 'container--forgot-active');
}

// Xử lý sự kiện click chuyển form
signupLink.addEventListener('click', (e) => { 
    e.preventDefault(); 
    resetAllForms();
    root.classList.add('container--signup-active');
});

signinLink.addEventListener('click', (e) => { 
    e.preventDefault(); 
    resetAllForms();
});

forgotLink.addEventListener('click', (e) => { 
    e.preventDefault(); 
    resetAllForms();
    root.classList.add('container--forgot-active');
});

backToLogin.addEventListener('click', (e) => { 
    e.preventDefault(); 
    resetAllForms();
    document.getElementById('forgotSuccess').style.display = 'none';
});

// Xử lý Ẩn/Hiện mật khẩu
document.querySelectorAll('.auth-form__toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.target;
        const inp = document.getElementById(id);
        const isPw = inp.type === 'password';
        inp.type = isPw ? 'text' : 'password';
        btn.textContent = isPw ? 'Ẩn' : 'Hiện';
    });
});

// Validate cơ bản
const requireValid = (form) => {
    form.addEventListener('submit', (e) => {
        if(!form.checkValidity()){
            e.preventDefault();
            form.reportValidity();
        }
    });
};
requireValid(document.getElementById('signinForm'));
requireValid(document.getElementById('signupForm'));
requireValid(document.getElementById('forgotForm'));

// ======= XỬ LÝ AUTHENTICATION =======

// Lưu user mới vào localStorage
function saveUser(email, name, password){
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if(users.some(u => u.email === email)){
        alert('Email này đã được đăng ký!');
        return false;
    }
    users.push({ email, name, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Đăng ký thành công! Hãy đăng nhập.');
    resetAllForms();
    return true;
}

// Element hiển thị lỗi đăng nhập
const errorMsg = document.createElement('p');
errorMsg.style.color = '#FF6967';
errorMsg.style.fontWeight = '500';
errorMsg.style.fontFamily = 'Roboto, system-ui, sans-serif';
errorMsg.style.fontSize = '15px';
errorMsg.style.textAlign = 'center';
errorMsg.style.marginTop = '-8px';
errorMsg.style.display = 'none';
document.querySelector('#signinForm .btn').insertAdjacentElement('afterend', errorMsg);

// Xử lý Đăng ký
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if(!name || !email || !password){ alert('Vui lòng nhập đủ thông tin.'); return; }
    if(password.length < 6){ alert('Mật khẩu phải có ít nhất 6 ký tự.'); return; }

    saveUser(email, name, password);
    document.getElementById('signupForm').reset();
});

// Xử lý Đăng nhập
document.getElementById('signinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if(user){
        localStorage.setItem('currentUser', JSON.stringify(user));
        const roleMessage = user.role === 'admin' ? '👑 Đăng nhập với quyền Admin' : '👤 Đăng nhập với quyền User';
        alert(`${roleMessage}\n\nChào mừng ${user.name}!`);
        window.location.href = '../index.html';
    } else {
        errorMsg.textContent = 'Sai email hoặc mật khẩu. Vui lòng thử lại.';
        errorMsg.style.display = 'block';
    }
});

// Xử lý logic Reset mật khẩu
function resetPassword(email, newPassword) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
        alert('Email không tồn tại trong hệ thống!');
        return false;
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.email === email) {
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    return true;
}

// Xử lý Form Quên mật khẩu
document.getElementById('forgotForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    if (!email || !newPassword || !confirmPassword) {
        alert('Vui lòng nhập đầy đủ thông tin.'); return;
    }
    if (newPassword.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự.'); return;
    }
    if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!'); return;
    }
    
    if (resetPassword(email, newPassword)) {
        const successMsg = document.getElementById('forgotSuccess');
        successMsg.style.display = 'block';
        
        document.getElementById('forgotForm').reset();
        
        setTimeout(() => {
            resetAllForms();
            successMsg.style.display = 'none';
        }, 2000);
    }
});

// Khởi tạo User mặc định (Admin/User)
function initializeDefaultUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (!users.some(u => u.email === 'admin@potpan.com')) {
        users.push({
            email: 'admin@potpan.com',
            name: 'Quản Trị Viên',
            password: 'admin123',
            avatar: '../assets/images/admin-avatar.png',
            role: 'admin'
        });
    }
    
    if (!users.some(u => u.email === 'user@example.com')) {
        users.push({
            email: 'user@example.com', 
            name: 'Người Dùng Thường',
            password: 'user123',
            avatar: '../assets/images/avatar.png',
            role: 'user'
        });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
}

initializeDefaultUsers();