// Toggle giữa Signin/Signup
    const root = document.getElementById('container');
    const signupLink = document.getElementById('signupLink');
    const signinLink = document.getElementById('signinLink');

    signupLink.addEventListener('click', (e)=>{ e.preventDefault(); root.classList.add('signup-active'); });
    signinLink.addEventListener('click', (e)=>{ e.preventDefault(); root.classList.remove('signup-active'); });

    // Hiện/ẩn mật khẩu
    document.querySelectorAll('.toggle-pw').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.target;
        const inp = document.getElementById(id);
        const isPw = inp.type === 'password';
        inp.type = isPw ? 'text' : 'password';
        btn.textContent = isPw ? 'Ẩn' : 'Hiện';
      });
    });

    // Validate nhẹ (tránh submit form trống)
    const requireValid = (form) => {
      form.addEventListener('submit', (e)=>{
        if(!form.checkValidity()){
          e.preventDefault();
          form.reportValidity();
        }
      });
    };
    requireValid(document.getElementById('signinForm'));
    requireValid(document.getElementById('signupForm'));
        // ======= XỬ LÝ ĐĂNG KÝ / ĐĂNG NHẬP =======

    // Hàm lưu tài khoản mới vào localStorage
    function saveUser(email, name, password){
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      // Kiểm tra trùng email
      if(users.some(u => u.email === email)){
        alert('Email này đã được đăng ký!');
        return false;
      }
      users.push({ email, name, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Đăng ký thành công! Hãy đăng nhập.');
      root.classList.remove('signup-active');
      return true;
    }

    // Hàm kiểm tra đăng nhập
    function checkLogin(email, password){
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      return user || null;
    }

    // Thêm phần tử hiển thị thông báo lỗi
    const errorMsg = document.createElement('p');
    errorMsg.style.color = '#FF6967';
    errorMsg.style.fontWeight = '500';
    errorMsg.style.fontFamily = 'Roboto, system-ui, sans-serif';
    errorMsg.style.fontSize = '15px';
    errorMsg.style.textAlign = 'center';
    errorMsg.style.marginTop = '-8px';
    errorMsg.style.display = 'none';
    document.querySelector('#signinForm .btn').insertAdjacentElement('afterend', errorMsg);

    // Xử lý đăng ký
    document.getElementById('signupForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value.trim();

      if(!name || !email || !password){ alert('Vui lòng nhập đủ thông tin.'); return; }
      if(password.length < 6){ alert('Mật khẩu phải có ít nhất 6 ký tự.'); return; }

      saveUser(email, name, password);
      document.getElementById('signupForm').reset();
    });

   // Xử lý đăng nhập
document.getElementById('signinForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if(user){
        // Lưu user hiện tại và chuyển trang
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Hiển thị thông báo vai trò
        const roleMessage = user.role === 'admin' ? '👑 Đăng nhập với quyền Admin' : '👤 Đăng nhập với quyền User';
        alert(`${roleMessage}\n\nChào mừng ${user.name}!`);
        
        window.location.href = '../index.html';
    } else {
        errorMsg.textContent = 'Sai email hoặc mật khẩu. Vui lòng thử lại.';
        errorMsg.style.display = 'block';
    }
});

   function initializeDefaultUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Tài khoản Admin
    if (!users.some(u => u.email === 'admin@potpan.com')) {
        users.push({
            email: 'admin@potpan.com',
            name: 'Quản Trị Viên',
            password: 'admin123',
            avatar: '../../assets/images/admin-avatar.png',
            role: 'admin'
        });
    }
    
    // Tài khoản User thường
    if (!users.some(u => u.email === 'user@example.com')) {
        users.push({
            email: 'user@example.com', 
            name: 'Người Dùng Thường',
            password: 'user123',
            avatar: '../../assets/images/avatar.png',
            role: 'user'
        });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
}

// Gọi hàm khi trang load
initializeDefaultUsers();
