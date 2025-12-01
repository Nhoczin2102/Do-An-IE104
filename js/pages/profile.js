// Khai báo biến toàn cục để lưu trữ dữ liệu sau khi fetch
let followersData = [];
let followingData = [];

// Hàm Fetch Dữ Liệu Bất đồng bộ 
async function fetchUserData(filename) {
    try {
        const response = await fetch(filename); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Lỗi khi tải file ${filename}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
        return []; 
    }
}

// Render danh sách người dùng 
function renderUserCards(users, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Cập nhật số lượng người dùng hiển thị trên tab
    const countElementId = containerId === 'followersList' ? 'followerCount' : 'followingCount';
    const countElement = document.getElementById(countElementId);
    if (countElement) {
        countElement.textContent = users.length;
    }
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="empty-state__text">Không có người dùng nào</div>
                <button class="btn--follow" onclick="${containerId === 'followersList' ? 'showFollowers()' : 'showFollowing()'}">
                    <i class="fas fa-redo"></i> Tải lại
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-card__avatar">
                <img src="${user.avatar}" alt="${user.name}">
            </div>
            <div class="user-card__info">
                <div class="user-card__name">
                    ${user.name}
                    ${user.followers > 1000 ? '<i class="fas fa-star" style="color: #FFD700;"></i>' : ''}
                </div>
                <div class="user-card__bio">${user.bio}</div>
                <div class="user-card__stats">
                    <div class="user-card__stat">
                        <i class="fas fa-utensils"></i>
                        <span>${user.recipes} công thức</span>
                    </div>
                    <div class="user-card__stat">
                        <i class="fas fa-users"></i>
                        <span>${user.followers >= 1000 ? (user.followers/1000).toFixed(1) + 'K' : user.followers} người theo dõi</span>
                    </div>
                </div>
            </div>
            <div class="user-card__action">
                <button class="btn--follow ${user.isFollowing ? 'btn--following' : ''}" 
                        onclick="toggleFollow(${user.id}, '${containerId}')">
                    <i class="fas ${user.isFollowing ? 'fa-check' : 'fa-plus'}"></i>
                    ${user.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
            </div>
        </div>
    `).join('');
}

// Xử lý Follow/Unfollow 
function toggleFollow(userId, containerId) {
    const list = containerId === 'followersList' ? followersData : followingData;
    const user = list.find(u => u.id === userId);
    
    if (user) {
        user.isFollowing = !user.isFollowing;
        renderUserCards(list, containerId);
        
        showNotification(user.isFollowing ? `Đã theo dõi ${user.name}` : `Đã bỏ theo dõi ${user.name}`);
    }
}

// Hiển thị thông báo 
function showNotification(message) {
    // ... (logic showNotification) ...
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: var(--primary-color);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-hover);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Chuyển tab Người theo dõi 
function showFollowers() {
    document.getElementById('followersList').style.display = 'flex';
    document.getElementById('followingList').style.display = 'none';
    
    document.querySelectorAll('.follow-tabs__tab').forEach(tab => {
        tab.classList.remove('follow-tabs__tab--active');
    });
    document.querySelectorAll('.follow-tabs__tab')[0].classList.add('follow-tabs__tab--active');
    
    renderUserCards(followersData, 'followersList'); 
}

// Chuyển tab Đang theo dõi 
function showFollowing() {
    document.getElementById('followersList').style.display = 'none';
    document.getElementById('followingList').style.display = 'flex';
    
    document.querySelectorAll('.follow-tabs__tab').forEach(tab => {
        tab.classList.remove('follow-tabs__tab--active');
    });
    document.querySelectorAll('.follow-tabs__tab')[1].classList.add('follow-tabs__tab--active');
    
    renderUserCards(followingData, 'followingList');
}

// Xử lý tìm kiếm 
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const activeTabElement = document.querySelector('.follow-tabs__tab--active');
    const activeTab = activeTabElement ? activeTabElement.textContent : '';

    if (activeTab.includes('Người theo dõi')) {
        const filteredFollowers = followersData.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.bio.toLowerCase().includes(searchTerm)
        );
        renderUserCards(filteredFollowers, 'followersList');
    } else {
        const filteredFollowing = followingData.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.bio.toLowerCase().includes(searchTerm)
        );
        renderUserCards(filteredFollowing, 'followingList');
    }
});

// Khởi tạo ban đầu
document.addEventListener('DOMContentLoaded', async function() {

    const followersPromise = fetchUserData('../../data/followers.json');
    const followingPromise = fetchUserData('../../data/following.json');
    

    const [followersResult, followingResult] = await Promise.all([
        followersPromise, 
        followingPromise
    ]);

    // 3. Gán kết quả vào biến toàn cục
    followersData = followersResult;
    followingData = followingResult;

    // 4. Render giao diện ban đầu
    showFollowers();
});