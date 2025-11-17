// Lấy thông tin người dùng hiện tại từ localStorage
export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        return JSON.parse(user);
    }
    // Trả về null nếu chưa đăng nhập
    return null; 
}