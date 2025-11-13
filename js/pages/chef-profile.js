// chef-profile.js

// Dữ liệu mẫu cho đầu bếp
const chefDatabase = {
    1: {
        id: 1,
        name: "Gordon Ramsay",
        specialty: "Ẩm thực Âu - Bếp trưởng 3 sao Michelin",
        avatar: "../assets/images/chefs/chef1.jpg",
        cover: "../assets/images/chef-cover.jpg",
        rating: 4.9,
        recipes: 245,
        followers: 125000,
        experience: 12,
        bio: "Đầu bếp nổi tiếng thế giới với 3 sao Michelin, chuyên về ẩm thực châu Âu hiện đại. Với hơn 12 năm kinh nghiệm trong ngành ẩm thực, tôi đã đào tạo hàng trăm đầu bếp trẻ và mang đến những trải nghiệm ẩm thực độc đáo cho thực khách.",
        expertise: ["French Cuisine", "Fine Dining", "Modern European", "Culinary Training", "Recipe Development"],
        category: "european",
        isFeatured: true,
        isVerified: true,
        isFollowing: false,
        
        about: `
            <p>Gordon Ramsay là một trong những đầu bếp nổi tiếng nhất thế giới với sự nghiệp lẫy lừng trong ngành ẩm thực. Sinh ra tại Scotland, ông bắt đầu sự nghiệp với bóng đá nhưng một chấn thương đã đưa ông đến với nghề bếp.</p>
            
            <h4>Hành trình ẩm thực:</h4>
            <ul>
                <li>Đào tạo tại Nhà hàng Harvey's dưới sự hướng dẫn của Marco Pierre White</li>
                <li>Làm việc tại Pháp dưới sự chỉ dẫn của các bếp trưởng nổi tiếng</li>
                <li>Nhận 3 sao Michelin cho nhà hàng Restaurant Gordon Ramsay</li>
            </ul>
            
            <h4>Triết lý nấu ăn:</h4>
            <p>"Ẩm thực không chỉ là việc nấu ăn, đó là nghệ thuật tạo ra trải nghiệm. Mỗi món ăn phải kể một câu chuyện, mang đến cảm xúc và ký ức cho thực khách."</p>
        `,
        
        recipes: [
            {
                id: 1,
                title: "Beef Wellington Cổ điển",
                image: "../assets/images/recipes/beef-wellington.jpg",
                description: "Món thịt bò hảo hạng với lớp vỏ bánh puff pastry giòn tan, nhân pâté và nấm thơm ngon.",
                difficulty: "Khó",
                time: "120 phút",
                rating: 4.9,
                reviews: 234
            },
            {
                id: 2,
                title: "Risotto Hải sản Ý",
                image: "../assets/images/recipes/seafood-risotto.jpg",
                description: "Risotto creamy với đủ loại hải sản tươi ngon, hương vị Địa Trung Hải đặc trưng.",
                difficulty: "Trung bình",
                time: "45 phút",
                rating: 4.7,
                reviews: 189
            },
            {
                id: 3,
                title: "Bánh Chocolate Lava",
                image: "../assets/images/recipes/chocolate-lava.jpg",
                description: "Bánh chocolate ấm áp với nhân chocolate chảy ra khi cắt, hoàn hảo cho món tráng miệng.",
                difficulty: "Trung bình",
                time: "30 phút",
                rating: 4.8,
                reviews: 156
            }
        ],
        
        achievements: [
            {
                title: "3 Sao Michelin",
                description: "Nhà hàng Restaurant Gordon Ramsay đạt 3 sao Michelin",
                year: "2001",
                icon: "🏆"
            },
            {
                title: "Đầu bếp của năm",
                description: "Vinh danh tại giải thưởng ẩm thực thế giới",
                year: "2006",
                icon: "⭐"
            },
            {
                title: "Sách dạy nấu ăn bán chạy",
                description: "Sách 'Gordon Ramsay's Home Cooking' đạt best-seller",
                year: "2012",
                icon: "📚"
            }
        ],
        
        reviews: [
            {
                user: "Nguyễn Văn A",
                avatar: "../assets/images/users/user1.jpg",
                rating: 5,
                content: "Đầu bếp Gordon thực sự xuất sắc! Các công thức rất chi tiết và dễ làm theo. Món Beef Wellington của tôi đã thành công ngoài mong đợi.",
                date: "2 tuần trước"
            },
            {
                user: "Trần Thị B",
                avatar: "../assets/images/users/user2.jpg",
                rating: 4,
                content: "Kỹ thuật nấu ăn chuyên nghiệp, giải thích rõ ràng. Tuy nhiên một số nguyên liệu khó tìm ở Việt Nam.",
                date: "1 tháng trước"
            },
            {
                user: "Lê Văn C",
                avatar: "../assets/images/users/user3.jpg",
                rating: 5,
                content: "Phong cách giảng dạy rất cuốn hút và dễ hiểu. Tôi đã học được nhiều kỹ thuật nấu ăn chuyên nghiệp.",
                date: "3 tuần trước"
            }
        ]
    },
    2: {
        id: 2,
        name: "Phan Tôn Tịnh Hải",
        specialty: "Ẩm thực Việt Nam truyền thống",
        avatar: "../assets/images/chefs/chef2.jpg",
        cover: "../assets/images/chef-cover.jpg",
        rating: 4.8,
        recipes: 180,
        followers: 89000,
        experience: 15,
        bio: "Bếp trưởng với hơn 15 năm kinh nghiệm, chuyên về ẩm thực Việt Nam truyền thống. Đam mê khám phá và gìn giữ những món ăn cổ truyền của dân tộc.",
        expertise: ["Vietnamese Cuisine", "Street Food", "Traditional", "Family Recipes", "Regional Specialties"],
        category: "vietnamese",
        isFeatured: true,
        isVerified: true,
        isFollowing: true,
        
        about: `
            <p>Phan Tôn Tịnh Hải là bếp trưởng nổi tiếng với niềm đam mê bất tận cho ẩm thực Việt Nam. Sinh ra trong gia đình có truyền thống ẩm thực, anh đã dành cả cuộc đời để nghiên cứu và phát triển các món ăn Việt.</p>
            
            <h4>Hành trình ẩm thực:</h4>
            <ul>
                <li>Học nghề từ bà và mẹ - những người phụ nữ tài hoa của gia đình</li>
                <li>Tu nghiệp tại các nhà hàng Việt Nam nổi tiếng ở Sài Gòn</li>
                <li>Tham gia nhiều chương trình ẩm thực quốc tế</li>
            </ul>
            
            <h4>Triết lý nấu ăn:</h4>
            <p>"Ẩm thực Việt là sự kết hợp hài hòa giữa âm dương, ngũ hành. Mỗi món ăn không chỉ ngon mà còn phải tốt cho sức khỏe và cân bằng."</p>
        `,
        
        recipes: [
            {
                id: 4,
                title: "Phở Bò Hà Nội",
                image: "../assets/images/recipes/pho-bo.jpg",
                description: "Phở bò truyền thống Hà Nội với nước dùng trong veo, thơm ngon đậm đà hương vị Bắc Bộ.",
                difficulty: "Khó",
                time: "180 phút",
                rating: 4.9,
                reviews: 312
            },
            {
                id: 5,
                title: "Bánh Xèo Miền Tây",
                image: "../assets/images/recipes/banh-xeo.jpg",
                description: "Bánh xèo giòn rụm với nhân tôm thịt, ăn kèm rau sống và nước mắm chua ngọt.",
                difficulty: "Trung bình",
                time: "40 phút",
                rating: 4.7,
                reviews: 198
            }
        ],
        
        achievements: [
            {
                title: "Đầu bếp Việt Nam xuất sắc",
                description: "Giải thưởng ẩm thực Việt Nam",
                year: "2018",
                icon: "🍜"
            },
            {
                title: "Đại sứ ẩm thực",
                description: "Đại diện ẩm thực Việt Nam tại Food Festival quốc tế",
                year: "2020",
                icon: "🌍"
            }
        ],
        
        reviews: [
            {
                user: "Mai Thị D",
                avatar: "../assets/images/users/user4.jpg",
                rating: 5,
                content: "Đầu bếp Tịnh Hải rất tâm huyết với ẩm thực Việt. Các công thức rất dễ làm và ngon như ngoài hàng.",
                date: "1 tuần trước"
            }
        ]
    }
    // Có thể thêm các đầu bếp khác...
};

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Lấy ID đầu bếp từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const chefId = urlParams.get('id');
    
    if (!chefId) {
        showError('Không tìm thấy ID đầu bếp');
        return;
    }
    
    // Load dữ liệu đầu bếp
    loadChefProfile(chefId);
    setupEventListeners();
});

// Function load profile đầu bếp
function loadChefProfile(chefId) {
    const chef = chefDatabase[chefId];
    
    if (!chef) {
        showError('Không tìm thấy thông tin đầu bếp');
        return;
    }
    
    // Cập nhật thông tin header
    updateChefHeader(chef);
    
    // Load các tab content
    loadRecipesTab(chef.recipes);
    loadAboutTab(chef.about);
    loadAchievementsTab(chef.achievements);
    loadReviewsTab(chef.reviews, chef.rating);
}

// Function cập nhật header
function updateChefHeader(chef) {
    document.getElementById('chefAvatar').src = chef.avatar;
    document.getElementById('chefName').textContent = chef.name;
    document.getElementById('chefSpecialty').textContent = chef.specialty;
    document.getElementById('chefBio').textContent = chef.bio;
    
    // Stats
    document.getElementById('recipesCount').textContent = chef.recipes;
    document.getElementById('followersCount').textContent = formatNumber(chef.followers);
    document.getElementById('followersCountLarge').textContent = formatNumber(chef.followers);
    document.getElementById('experienceYears').textContent = chef.experience;
    document.getElementById('chefRating').textContent = chef.rating;
    
    // Verified badge
    document.getElementById('chefVerified').style.display = chef.isVerified ? 'flex' : 'none';
    
    // Follow button
    const followBtn = document.getElementById('followChefBtn');
    const followText = document.getElementById('followChefText');
    if (chef.isFollowing) {
        followBtn.classList.add('following');
        followText.textContent = 'Đang theo dõi';
    } else {
        followBtn.classList.remove('following');
        followText.textContent = 'Theo dõi';
    }
    
    // Expertise tags
    const expertiseContainer = document.getElementById('chefExpertise');
    expertiseContainer.innerHTML = chef.expertise
        .map(skill => `<span class="expertise-tag-large">${skill}</span>`)
        .join('');
    
    // Thêm event listener cho nút follow
    followBtn.addEventListener('click', function() {
        toggleFollowChef(chef.id);
    });
}

// Function load tab công thức
function loadRecipesTab(recipes) {
    const recipesGrid = document.getElementById('recipesGrid');
    const template = document.getElementById('recipeCardTemplate');
    
    recipesGrid.innerHTML = '';
    
    recipes.forEach(recipe => {
        const card = template.content.cloneNode(true);
        
        card.querySelector('[data-recipe-image]').src = recipe.image;
        card.querySelector('[data-recipe-difficulty]').textContent = recipe.difficulty;
        card.querySelector('[data-recipe-time]').innerHTML = `<i class="fas fa-clock"></i>${recipe.time}`;
        card.querySelector('[data-recipe-title]').textContent = recipe.title;
        card.querySelector('[data-recipe-description]').textContent = recipe.description;
        card.querySelector('[data-recipe-rating]').textContent = recipe.rating;
        card.querySelector('[data-recipe-reviews]').textContent = `(${recipe.reviews})`;
        
        // Thêm event click
        card.querySelector('.recipe-card').addEventListener('click', () => {
            viewRecipe(recipe.id);
        });
        
        recipesGrid.appendChild(card);
    });
}

// Function load tab giới thiệu
function loadAboutTab(aboutContent) {
    document.getElementById('aboutContent').innerHTML = aboutContent;
}

// Function load tab thành tích
function loadAchievementsTab(achievements) {
    const achievementsGrid = document.getElementById('achievementsGrid');
    const template = document.getElementById('achievementCardTemplate');
    
    achievementsGrid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const card = template.content.cloneNode(true);
        
        card.querySelector('[data-achievement-icon]').textContent = achievement.icon;
        card.querySelector('[data-achievement-title]').textContent = achievement.title;
        card.querySelector('[data-achievement-description]').textContent = achievement.description;
        card.querySelector('[data-achievement-year]').textContent = achievement.year;
        
        achievementsGrid.appendChild(card);
    });
}

// Function load tab đánh giá
function loadReviewsTab(reviews, overallRating) {
    // Cập nhật overall rating
    document.getElementById('overallRating').textContent = overallRating;
    document.getElementById('ratingCount').textContent = `${reviews.length} đánh giá`;
    
    // Tạo stars
    const stars = '★'.repeat(Math.floor(overallRating)) + '☆'.repeat(5 - Math.floor(overallRating));
    document.getElementById('ratingStars').textContent = stars;
    
    // Load reviews list
    const reviewsList = document.getElementById('reviewsList');
    const template = document.getElementById('reviewCardTemplate');
    
    reviewsList.innerHTML = '';
    
    reviews.forEach(review => {
        const card = template.content.cloneNode(true);
        
        card.querySelector('[data-reviewer-avatar]').src = review.avatar;
        card.querySelector('[data-reviewer-name]').textContent = review.user;
        card.querySelector('[data-review-rating]').textContent = '★'.repeat(review.rating);
        card.querySelector('[data-review-date]').textContent = review.date;
        card.querySelector('[data-review-content]').textContent = review.content;
        
        reviewsList.appendChild(card);
    });
}

// Function toggle theo dõi đầu bếp
function toggleFollowChef(chefId) {
    const chef = chefDatabase[chefId];
    if (chef) {
        chef.isFollowing = !chef.isFollowing;
        
        // Cập nhật UI
        const followBtn = document.getElementById('followChefBtn');
        const followText = document.getElementById('followChefText');
        
        if (chef.isFollowing) {
            followBtn.classList.add('following');
            followText.textContent = 'Đang theo dõi';
            chef.followers += 1;
        } else {
            followBtn.classList.remove('following');
            followText.textContent = 'Theo dõi';
            chef.followers -= 1;
        }
        
        // Cập nhật số lượng followers
        document.getElementById('followersCount').textContent = formatNumber(chef.followers);
        document.getElementById('followersCountLarge').textContent = formatNumber(chef.followers);
        
        // Hiển thị thông báo
        showNotification(chef.isFollowing ? 
            `Đã theo dõi ${chef.name}` : 
            `Đã bỏ theo dõi ${chef.name}`
        );
    }
}

// Function xem công thức
function viewRecipe(recipeId) {
    alert(`Xem công thức ${recipeId} - Trong thực tế sẽ chuyển đến trang công thức`);
    // window.location.href = `recipe.html?id=${recipeId}`;
}

// Function định dạng số
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Function hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'chef-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-hover);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Function hiển thị lỗi
function showError(message) {
    const content = document.querySelector('.chef-profile-content');
    content.innerHTML = `
        <div class="error-state">
            <div class="error-icon">😕</div>
            <h2 class="error-title">Không tìm thấy</h2>
            <p class="error-message">${message}</p>
            <button class="btn-back" onclick="window.history.back()">
                <i class="fas fa-arrow-left"></i>
                Quay lại
            </button>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class từ tất cả tabs
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            // Add active class cho tab được click
            this.classList.add('active');
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
    
    // Recipe filter
    document.getElementById('recipeFilter').addEventListener('change', function(e) {
        // Trong thực tế sẽ filter recipes
        console.log('Filter recipes by:', e.target.value);
    });
}