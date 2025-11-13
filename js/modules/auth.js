// /js/managers/auth.js

// Hàm này chỉ đọc 'currentUser' từ localStorage
export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        return JSON.parse(user);
    }
    // Trả về null hoặc một object rỗng nếu không tìm thấy
    return null; 
}