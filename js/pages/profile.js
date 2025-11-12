   const followers = [
      {
        id: 1,
        name: "Chí Thành",
        avatar: "https://i.pravatar.cc/150?img=32",
        bio: "Đam mê ẩm thực Việt Nam - Chia sẻ công thức gia đình",
        recipes: 45,
        followers: 320,
        isFollowing: true
      },
      {
        id: 2,
        name: "Minh Anh",
        avatar: "https://i.pravatar.cc/150?img=12",
        bio: "Chuyên làm bánh ngọt | Yêu thích ẩm thực Pháp",
        recipes: 67,
        followers: 890,
        isFollowing: true
      },
      {
        id: 3,
        name: "Hương Giang",
        avatar: "https://i.pravatar.cc/150?img=45",
        bio: "Food blogger | Healthy recipes | Eat clean",
        recipes: 123,
        followers: 2100,
        isFollowing: false
      },
      {
        id: 4,
        name: "Tuấn Vũ",
        avatar: "https://i.pravatar.cc/150?img=22",
        bio: "Đầu bếp nghiệp dư | Thích nấu ăn cho gia đình",
        recipes: 34,
        followers: 156,
        isFollowing: true
      },
      {
        id: 5,
        name: "Thanh Hà",
        avatar: "https://i.pravatar.cc/150?img=15",
        bio: "Yêu thích nấu ăn chay | Sống xanh",
        recipes: 78,
        followers: 432,
        isFollowing: false
      },
      {
        id: 6,
        name: "Quang Dũng",
        avatar: "https://i.pravatar.cc/150?img=8",
        bio: "Chia sẻ món ăn gia đình | Bố của 2 bé",
        recipes: 56,
        followers: 287,
        isFollowing: true
      }
    ];

    const following = [
      {
        id: 1,
        name: "Bếp Nhà Mình",
        avatar: "https://i.pravatar.cc/150?img=60",
        bio: "Kênh ẩm thực gia đình | Món ngon mỗi ngày",
        recipes: 234,
        followers: 12500,
        isFollowing: true
      },
      {
        id: 2,
        name: "Ẩm Thực Mẹ Làm",
        avatar: "https://i.pravatar.cc/150?img=28",
        bio: "Món ngon mỗi ngày | Công thức dễ làm",
        recipes: 189,
        followers: 8700,
        isFollowing: true
      },
      {
        id: 3,
        name: "Nấu Ăn Dễ Dàng",
        avatar: "https://i.pravatar.cc/150?img=35",
        bio: "Công thức đơn giản cho người mới bắt đầu",
        recipes: 156,
        followers: 5200,
        isFollowing: true
      },
      {
        id: 4,
        name: "Bếp Trưởng Gia Đình",
        avatar: "https://i.pravatar.cc/150?img=42",
        bio: "Chia sẻ kinh nghiệm nấu nướng | Mẹo vặt bếp núc",
        recipes: 98,
        followers: 3800,
        isFollowing: true
      }
    ];

    // Function to render user cards
    function renderUserCards(users, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      if (users.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="empty-text">Không có người dùng nào</div>
            <button class="btn-follow" onclick="showFollowers()">
              <i class="fas fa-redo"></i> Tải lại
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = users.map(user => `
        <div class="user-card">
          <div class="user-avatar">
            <img src="${user.avatar}" alt="${user.name}">
          </div>
          <div class="user-info">
            <div class="user-name">
              ${user.name}
              ${user.followers > 1000 ? '<i class="fas fa-star" style="color: #FFD700;"></i>' : ''}
            </div>
            <div class="user-bio">${user.bio}</div>
            <div class="user-stats">
              <div class="user-stat">
                <i class="fas fa-utensils"></i>
                <span>${user.recipes} công thức</span>
              </div>
              <div class="user-stat">
                <i class="fas fa-users"></i>
                <span>${user.followers >= 1000 ? (user.followers/1000).toFixed(1) + 'K' : user.followers} người theo dõi</span>
              </div>
            </div>
          </div>
          <div class="user-action">
            <button class="btn-follow ${user.isFollowing ? 'btn-following' : ''}" 
                    onclick="toggleFollow(${user.id}, '${containerId}')">
              <i class="fas ${user.isFollowing ? 'fa-check' : 'fa-plus'}"></i>
              ${user.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </button>
          </div>
        </div>
      `).join('');
    }

    // Function to toggle follow status
    function toggleFollow(userId, listType) {
      const list = listType === 'followersList' ? followers : following;
      const user = list.find(u => u.id === userId);
      
      if (user) {
        user.isFollowing = !user.isFollowing;
        renderUserCards(list, listType);
        
        // Show notification
        showNotification(user.isFollowing ? `Đã theo dõi ${user.name}` : `Đã bỏ theo dõi ${user.name}`);
      }
    }

    // Function to show notification
    function showNotification(message) {
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

    // Function to show followers
    function showFollowers() {
      document.getElementById('followersList').style.display = 'flex';
      document.getElementById('followingList').style.display = 'none';
      
      document.querySelectorAll('.follow-tab').forEach(tab => {
        tab.classList.remove('active');
      });
      document.querySelectorAll('.follow-tab')[0].classList.add('active');
      
      renderUserCards(followers, 'followersList');
    }

    // Function to show following
    function showFollowing() {
      document.getElementById('followersList').style.display = 'none';
      document.getElementById('followingList').style.display = 'flex';
      
      document.querySelectorAll('.follow-tab').forEach(tab => {
        tab.classList.remove('active');
      });
      document.querySelectorAll('.follow-tab')[1].classList.add('active');
      
      renderUserCards(following, 'followingList');
    }

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const activeTab = document.querySelector('.follow-tab.active').textContent;
      
      if (activeTab.includes('Người theo dõi')) {
        const filteredFollowers = followers.filter(user => 
          user.name.toLowerCase().includes(searchTerm) || 
          user.bio.toLowerCase().includes(searchTerm)
        );
        renderUserCards(filteredFollowers, 'followersList');
      } else {
        const filteredFollowing = following.filter(user => 
          user.name.toLowerCase().includes(searchTerm) || 
          user.bio.toLowerCase().includes(searchTerm)
        );
        renderUserCards(filteredFollowing, 'followingList');
      }
    });

    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      renderUserCards(followers, 'followersList');
    });