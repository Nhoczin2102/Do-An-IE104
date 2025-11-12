
// Sample data for famous chefs
const famousChefs = [
    {
        id: 1,
        name: "Gordon Ramsay",
        avatar: "https://i.pravatar.cc/150?img=68",
        specialty: "Ẩm thực Châu Âu",
        bio: "Đầu bếp 3 sao Michelin, chủ nhân nhiều nhà hàng nổi tiếng thế giới và là giám khảo MasterChef.",
        rating: 4.9,
        recipes: 245,
        followers: "125K",
        experience: "25 năm",
        expertise: ["French", "British", "Fine Dining", "Michelin"],
        category: "european",
        isFollowing: false,
        isVerified: true
    },
    {
        id: 2,
        name: "Phan Tôn Tịnh Hải",
        avatar: "https://i.pravatar.cc/150?img=32",
        specialty: "Ẩm thực Việt Nam",
        bio: "Bếp trưởng nhà hàng Việt Nam đầu tiên đạt sao Michelin, chuyên gia ẩm thực truyền thống Việt.",
        rating: 4.8,
        recipes: 189,
        followers: "89K",
        experience: "20 năm",
        expertise: ["Vietnamese", "Street Food", "Traditional", "Healthy"],
        category: "vietnamese",
        isFollowing: true,
        isVerified: true
    },
    {
        id: 3,
        name: "David Chang",
        avatar: "https://i.pravatar.cc/150?img=45",
        specialty: "Ẩm thực Châu Á Fusion",
        bio: "Người sáng lập Momofuku, mang hương vị Châu Á đến với thế giới ẩm thực hiện đại.",
        rating: 4.7,
        recipes: 167,
        followers: "76K",
        experience: "18 năm",
        expertise: ["Asian", "Fusion", "Ramen", "Modern"],
        category: "asian",
        isFollowing: false,
        isVerified: true
    },
    {
        id: 4,
        name: "Nguyễn Thị Hương",
        avatar: "https://i.pravatar.cc/150?img=12",
        specialty: "Làm bánh Việt Nam",
        bio: "Nghệ nhân làm bánh truyền thống, chuyên gia các loại bánh ngọt và bánh mì Việt Nam.",
        rating: 4.6,
        recipes: 134,
        followers: "54K",
        experience: "15 năm",
        expertise: ["Baking", "Vietnamese", "Desserts", "Traditional"],
        category: "baking",
        isFollowing: false,
        isVerified: false
    },
    {
        id: 5,
        name: "Jamie Oliver",
        avatar: "https://i.pravatar.cc/150?img=22",
        specialty: "Ẩm thực lành mạnh",
        bio: "Đầu bếp nổi tiếng với phong cách nấu ăn đơn giản, lành mạnh và thân thiện với gia đình.",
        rating: 4.7,
        recipes: 278,
        followers: "98K",
        experience: "22 năm",
        expertise: ["Healthy", "British", "Family", "Simple"],
        category: "healthy",
        isFollowing: true,
        isVerified: true
    },
    {
        id: 6,
        name: "Trần Minh Anh",
        avatar: "https://i.pravatar.cc/150?img=15",
        specialty: "Ẩm thực Chay",
        bio: "Chuyên gia ẩm thực chay sáng tạo, biến các món chay thành những tác phẩm nghệ thuật.",
        rating: 4.5,
        recipes: 98,
        followers: "42K",
        experience: "12 năm",
        expertise: ["Vegetarian", "Vegan", "Healthy", "Creative"],
        category: "healthy",
        isFollowing: false,
        isVerified: false
    },
    {
        id: 7,
        name: "Massimo Bottura",
        avatar: "https://i.pravatar.cc/150?img=58",
        specialty: "Ẩm thực Ý hiện đại",
        bio: "Chủ nhân nhà hàng Osteria Francescana 3 sao Michelin, người cách mạng ẩm thực Ý.",
        rating: 4.9,
        recipes: 156,
        followers: "67K",
        experience: "28 năm",
        expertise: ["Italian", "Modern", "Fine Dining", "Michelin"],
        category: "european",
        isFollowing: false,
        isVerified: true
    },
    {
        id: 8,
        name: "Lê Văn Tùng",
        avatar: "https://i.pravatar.cc/150?img=8",
        specialty: "Hải sản Việt Nam",
        bio: "Bếp trưởng chuyên về hải sản, mang hương vị biển đến với ẩm thực đường phố Việt Nam.",
        rating: 4.4,
        recipes: 87,
        followers: "38K",
        experience: "10 năm",
        expertise: ["Seafood", "Vietnamese", "Street Food", "Grill"],
        category: "vietnamese",
        isFollowing: true,
        isVerified: false
    }
];

// Function to render chef cards
function renderChefCards(chefs) {
    const container = document.getElementById('chefsGrid');
    if (!container) return;

    if (chefs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-utensils"></i>
                </div>
                <div class="empty-text">Không tìm thấy đầu bếp nào</div>
                <button class="btn-load-more" onclick="resetFilters()">
                    <i class="fas fa-redo"></i> Hiển thị tất cả
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = chefs.map(chef => `
        <div class="chef-card" data-category="${chef.category}" data-id="${chef.id}">
            <div class="chef-card-header">
                ${chef.isVerified ? '<div class="chef-badge"><i class="fas fa-star"></i> Xác thực</div>' : ''}
                <div class="chef-avatar">
                    <img src="${chef.avatar}" alt="${chef.name}">
                </div>
                <h3 class="chef-name">${chef.name}</h3>
                <div class="chef-specialty">${chef.specialty}</div>
                <div class="chef-rating">
                    <div class="chef-stars">
                        ${generateStars(chef.rating)}
                    </div>
                    <span class="chef-rating-score">${chef.rating}</span>
                </div>
            </div>
            
            <div class="chef-card-body">
                <p class="chef-bio">${chef.bio}</p>
                
                <div class="chef-stats">
                    <div class="chef-stat">
                        <span class="chef-stat-number">${chef.recipes}</span>
                        <span class="chef-stat-label">Công thức</span>
                    </div>
                    <div class="chef-stat">
                        <span class="chef-stat-number">${chef.followers}</span>
                        <span class="chef-stat-label">Theo dõi</span>
                    </div>
                    <div class="chef-stat">
                        <span class="chef-stat-number">${chef.experience}</span>
                        <span class="chef-stat-label">Kinh nghiệm</span>
                    </div>
                </div>
                
                <div class="chef-expertise">
                    ${chef.expertise.map(skill => `
                        <span class="expertise-tag">${skill}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="chef-card-footer">
                <button class="btn-follow ${chef.isFollowing ? 'btn-following' : ''}" 
                        onclick="toggleFollow(${chef.id})">
                    <i class="fas ${chef.isFollowing ? 'fa-check' : 'fa-plus'}"></i>
                    ${chef.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
                <button class="btn-view-profile" onclick="viewChefProfile(${chef.id})">
                    <i class="fas fa-user"></i> Xem hồ sơ
                </button>
            </div>
        </div>
    `).join('');
}

// Function to generate star ratings
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Function to toggle follow status
function toggleFollow(chefId) {
    const chef = famousChefs.find(c => c.id === chefId);
    if (chef) {
        chef.isFollowing = !chef.isFollowing;
        renderChefCards(getFilteredChefs());
        
        // Show notification
        showNotification(chef.isFollowing ? 
            `Đã theo dõi ${chef.name}` : 
            `Đã bỏ theo dõi ${chef.name}`
        );
    }
}

// Function to view chef profile
function viewChefProfile(chefId) {
    // In a real app, this would navigate to the chef's profile page
    const chef = famousChefs.find(c => c.id === chefId);
    showNotification(`Đang chuyển đến trang của ${chef.name}`);
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

// Filter and search functionality
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'popular';

function getFilteredChefs() {
    let filtered = famousChefs;

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(chef => chef.category === currentCategory);
    }

    // Filter by search
    if (currentSearch) {
        const searchTerm = currentSearch.toLowerCase();
        filtered = filtered.filter(chef => 
            chef.name.toLowerCase().includes(searchTerm) ||
            chef.specialty.toLowerCase().includes(searchTerm) ||
            chef.bio.toLowerCase().includes(searchTerm) ||
            chef.expertise.some(skill => skill.toLowerCase().includes(searchTerm))
        );
    }

    // Sort chefs
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'newest':
                return b.id - a.id;
            case 'recipes':
                return b.recipes - a.recipes;
            case 'followers':
                return parseFloat(b.followers) - parseFloat(a.followers);
            case 'popular':
            default:
                return b.rating - a.rating;
        }
    });

    return filtered;
}

function resetFilters() {
    currentCategory = 'all';
    currentSearch = '';
    currentSort = 'popular';
    
    document.getElementById('chefSearchInput').value = '';
    document.getElementById('chefSortSelect').value = 'popular';
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('.filter-tab[data-category="all"]').classList.add('active');
    
    renderChefCards(getFilteredChefs());
}

// Initialize the page
document.addEventListener('DOMContentLoaded'), function() {
    renderChefCards(getFilteredChefs());

    // Filter tab event listeners
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderChefCards(getFilteredChefs());
        });
    });
}