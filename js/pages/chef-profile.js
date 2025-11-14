// js/pages/chef-profile.js
import { chefsData } from '../data/chefsData.js'

class ChefProfile {
    constructor() {
        this.chef = null;
        this.chefId = null;
        this.currentRecipePage = 1;
        this.recipesPerPage = 9;
        this.currentReviewPage = 1;
        this.reviewsPerPage = 5;
        
        this.init();
    }

    init() {
        this.loadChefData();
        this.bindEvents();
        this.renderChefProfile();
    }

    getChefIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('id'));
    }

    getChefFromSessionStorage() {
        const chefData = sessionStorage.getItem('selectedChef');
        if (chefData) {
            const chef = JSON.parse(chefData);
            return chef.id;
        }
        return null;
    }

    loadChefData() {
        // ƯU TIÊN 1: Lấy từ sessionStorage (từ trang Home)
        const sessionChefId = this.getChefFromSessionStorage();
        
        // ƯU TIÊN 2: Lấy từ URL parameter (từ trang Famous Chef)
        const urlChefId = this.getChefIdFromURL();
        
        // Xác định chefId cần sử dụng
        this.chefId = sessionChefId || urlChefId;

        console.log('Session Chef ID:', sessionChefId);
        console.log('URL Chef ID:', urlChefId);
        console.log('Final Chef ID:', this.chefId);

        // Fallback: Nếu không có ID nào
        if (!this.chefId) {
            console.warn('Không tìm thấy chef ID, sử dụng ID mặc định 1');
            this.chefId = 1;
        }

        // Tìm chef trong database
        this.chef = chefsData.find(chef => chef.id === this.chefId);
        
        console.log('Found chef:', this.chef);

        if (!this.chef) {
            console.error('Không tìm thấy đầu bếp với ID:', this.chefId);
            // Redirect to chefs list if chef not found
            window.location.href = 'famous-chef.html';
            return;
        }

        // Xóa sessionStorage sau khi đã sử dụng để tránh conflict
        sessionStorage.removeItem('selectedChef');
    }

    renderChefProfile() {
        if (!this.chef) {
            console.error('Không có dữ liệu chef để render');
            return;
        }

        console.log('Rendering profile for:', this.chef.name);
        this.renderHeader();
        this.renderStats();
        this.renderRecipes();
        this.renderAbout();
        this.renderReviews();
    }

    renderHeader() {
        // Set cover image
        const coverImg = document.getElementById('chefCover');
        if (this.chef.coverImage) {
            coverImg.src = this.chef.coverImage;
        }

        // Set avatar
        const avatarImg = document.getElementById('chefAvatar');
        avatarImg.src = this.chef.avatar;
        avatarImg.alt = this.chef.name;

        // Set verified badge
        const verifiedBadge = document.getElementById('chefVerified');
        if (this.chef.verified) {
            verifiedBadge.style.display = 'flex';
        }

        // Set name and specialty
        document.getElementById('chefName').textContent = this.chef.name;
        document.getElementById('chefSpecialty').textContent = this.chef.specialty;

        // Set featured badge
        const badge = document.getElementById('chefBadge');
        if (this.chef.featured) {
            badge.style.display = 'block';
        }

        // Set bio
        document.getElementById('chefBio').textContent = this.chef.bio;
        document.getElementById('chefBioFull').textContent = this.chef.bioFull || this.chef.bio;

        // Set rating
        this.renderStars('chefStars', this.chef.rating);
        document.getElementById('chefRating').textContent = this.chef.rating;
        document.getElementById('chefReviewCount').textContent = `(${this.chef.reviewCount || '0'} đánh giá)`;

        // Set follow button state
        const followBtn = document.getElementById('followChefBtn');
        if (this.chef.isFollowing) {
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i><span>Đang theo dõi</span>';
        }
    }

    renderStats() {
        document.getElementById('statRecipes').textContent = this.chef.recipes;
        document.getElementById('statFollowers').textContent = this.chef.followers;
        document.getElementById('statFollowing').textContent = this.chef.following || '0';
        document.getElementById('statExperience').textContent = this.chef.experience;
    }

    renderRecipes() {
        const recipesGrid = document.getElementById('recipesGrid');
        if (!recipesGrid) return;

        const sampleRecipes = this.generateSampleRecipes();
        
        if (sampleRecipes.length === 0) {
            recipesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">👨‍🍳</div>
                    <h3 class="empty-text">Chưa có công thức nào</h3>
                    <p>Đầu bếp này chưa đăng tải công thức nào.</p>
                </div>
            `;
            return;
        }

        recipesGrid.innerHTML = sampleRecipes.map(recipe => this.createRecipeCard(recipe)).join('');
    }

    generateSampleRecipes() {
        return [
            {
                id: 1,
                title: "Phở Bò Hà Nội",
                image: "../../assets/images/phobo.jpg",
                time: "120 phút",
                difficulty: "Trung bình",
                rating: 4.8,
                description: "Phở bò truyền thống Hà Nội với nước dùng đậm đà, thơm ngon."
            },
            {
                id: 2,
                title: "Bánh Xèo Miền Tây",
                image: "../../assets/images/banhxeo.webp",
                time: "45 phút",
                difficulty: "Dễ",
                rating: 4.5,
                description: "Bánh xèo giòn rụm với nhân tôm thịt đầy đặn."
            },
            {
                id: 3,
                title: "Gà Nướng Muối Ớt",
                image: "../../assets/images/ganuongmuoiot.webp",
                time: "60 phút",
                difficulty: "Dễ",
                rating: 4.7,
                description: "Gà nướng thơm lừng với vị muối ớt đặc trưng."
            }
        ];
    }

    createRecipeCard(recipe) {
        const stars = this.generateStars(recipe.rating);
        
        return `
            <div class="recipe-card" data-recipe-id="${recipe.id}">
                <div class="recipe-image">
                    <img src="${recipe.image}" alt="${recipe.title}" onerror="this.src='../assets/images/recipe-placeholder.jpg'">
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <div class="recipe-time">
                            <i class="far fa-clock"></i>
                            ${recipe.time}
                        </div>
                        <div class="recipe-difficulty">
                            <i class="fas fa-signal"></i>
                            ${recipe.difficulty}
                        </div>
                    </div>
                    <div class="recipe-rating">
                        ${stars}
                        <span>${recipe.rating}</span>
                    </div>
                    <p class="recipe-description">${recipe.description}</p>
                </div>
            </div>
        `;
    }

    renderAbout() {
        // Render expertise tags
        const expertiseTags = document.getElementById('expertiseTags');
        if (expertiseTags && this.chef.expertise) {
            expertiseTags.innerHTML = this.chef.expertise.map(exp => 
                `<span class="expertise-tag">${exp}</span>`
            ).join('');
        }

        // Render achievements
        const achievementsList = document.getElementById('achievementsList');
        if (achievementsList && this.chef.achievements) {
            achievementsList.innerHTML = this.chef.achievements.map(achievement => 
                `<li>${achievement}</li>`
            ).join('');
        }

        // Render contact info
        const contactInfo = document.getElementById('contactInfo');
        if (contactInfo) {
            contactInfo.innerHTML = this.createContactInfo();
        }
    }

    createContactInfo() {
        const contacts = [];
        
        if (this.chef.email) {
            contacts.push(`
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="contact-details">
                        <h4>Email</h4>
                        <p>${this.chef.email}</p>
                    </div>
                </div>
            `);
        }
        
        if (this.chef.website) {
            contacts.push(`
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div class="contact-details">
                        <h4>Website</h4>
                        <p>${this.chef.website}</p>
                    </div>
                </div>
            `);
        }
        
        if (this.chef.socialMedia) {
            Object.entries(this.chef.socialMedia).forEach(([platform, handle]) => {
                contacts.push(`
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fab fa-${platform}"></i>
                        </div>
                        <div class="contact-details">
                            <h4>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
                            <p>${handle}</p>
                        </div>
                    </div>
                `);
            });
        }

        return contacts.join('');
    }

    renderReviews() {
        const reviewsList = document.getElementById('reviewsList');
        const averageRating = document.getElementById('averageRating');
        const totalReviews = document.getElementById('totalReviews');
        
        const sampleReviews = this.generateSampleReviews();
        
        const avgRating = sampleReviews.length > 0 
            ? (sampleReviews.reduce((sum, review) => sum + review.rating, 0) / sampleReviews.length).toFixed(1)
            : '0.0';
        
        averageRating.textContent = avgRating;
        totalReviews.textContent = `${sampleReviews.length} đánh giá`;
        
        this.renderStars('averageStars', parseFloat(avgRating));
        
        if (sampleReviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💬</div>
                    <h3 class="empty-text">Chưa có đánh giá nào</h3>
                    <p>Hãy là người đầu tiên đánh giá đầu bếp này.</p>
                </div>
            `;
            return;
        }
        
        reviewsList.innerHTML = sampleReviews.map(review => this.createReviewItem(review)).join('');
    }

    generateSampleReviews() {
        return [
            {
                id: 1,
                user: {
                    name: "Nguyễn Văn A",
                    avatar: "../assets/images/avatar-user1.jpg"
                },
                rating: 5,
                comment: "Đầu bếp rất tài năng! Các công thức rất dễ làm theo và thành phẩm rất ngon.",
                date: "2 ngày trước"
            },
            {
                id: 2,
                user: {
                    name: "Trần Thị B",
                    avatar: "../assets/images/avatar-user2.jpg"
                },
                rating: 4,
                comment: "Mình đã học được rất nhiều từ đầu bếp. Cảm ơn những chia sẻ hữu ích!",
                date: "1 tuần trước"
            }
        ];
    }

    createReviewItem(review) {
        const stars = this.generateStars(review.rating);
        
        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${review.user.avatar}" alt="${review.user.name}" class="reviewer-avatar" onerror="this.src='../assets/images/avatar.png'">
                        <div class="reviewer-details">
                            <h4>${review.user.name}</h4>
                            <div class="review-date">${review.date}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${stars}
                    </div>
                </div>
                <div class="review-content">
                    ${review.comment}
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    renderStars(elementId, rating) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = this.generateStars(rating);
        }
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Follow button
        const followBtn = document.getElementById('followChefBtn');
        if (followBtn) {
            followBtn.addEventListener('click', () => {
                this.toggleFollow();
            });
        }

        // Message button
        const messageBtn = document.getElementById('messageChefBtn');
        if (messageBtn) {
            messageBtn.addEventListener('click', () => {
                this.messageChef();
            });
        }

        // Share button
        const shareBtn = document.getElementById('shareChefBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareChef();
            });
        }

        // Write review button
        const writeReviewBtn = document.getElementById('writeReviewBtn');
        if (writeReviewBtn) {
            writeReviewBtn.addEventListener('click', () => {
                this.openReviewModal();
            });
        }

        // Review modal events
        this.bindReviewModalEvents();

        // Recipe card clicks
        document.addEventListener('click', (e) => {
            const recipeCard = e.target.closest('.recipe-card');
            if (recipeCard) {
                const recipeId = recipeCard.dataset.recipeId;
                this.viewRecipe(recipeId);
            }
        });

        // Back button
        const backButton = document.getElementById('backToChefs');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = './famous-chef.html';
            });
        }
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show active panel
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    toggleFollow() {
        if (!this.chef) return;

        this.chef.isFollowing = !this.chef.isFollowing;
        
        const followBtn = document.getElementById('followChefBtn');
        const followersCount = document.getElementById('statFollowers');
        
        if (this.chef.isFollowing) {
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i><span>Đang theo dõi</span>';
            
            // Update followers count
            const currentFollowers = this.parseFollowers(this.chef.followers);
            this.chef.followers = this.formatFollowers(currentFollowers + 1);
            followersCount.textContent = this.chef.followers;
            
            this.showNotification(`Đã theo dõi ${this.chef.name}`);
        } else {
            followBtn.classList.remove('following');
            followBtn.innerHTML = '<i class="fas fa-plus"></i><span>Theo dõi</span>';
            
            // Update followers count
            const currentFollowers = this.parseFollowers(this.chef.followers);
            this.chef.followers = this.formatFollowers(Math.max(0, currentFollowers - 1));
            followersCount.textContent = this.chef.followers;
            
            this.showNotification(`Đã bỏ theo dõi ${this.chef.name}`);
        }
    }

    parseFollowers(followersStr) {
        if (followersStr.includes('K')) {
            return parseFloat(followersStr) * 1000;
        } else if (followersStr.includes('M')) {
            return parseFloat(followersStr) * 1000000;
        }
        return parseInt(followersStr);
    }

    formatFollowers(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }

    messageChef() {
        this.showNotification('Tính năng nhắn tin sẽ sớm có mặt!');
    }

    shareChef() {
        if (navigator.share) {
            navigator.share({
                title: `Đầu bếp ${this.chef.name} - POTPAN`,
                text: `Khám phá hồ sơ của ${this.chef.name} - ${this.chef.specialty}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Đã sao chép liên kết vào clipboard!');
            });
        }
    }

    viewRecipe(recipeId) {
        window.location.href = `recipe-detail.html?id=${recipeId}&chef=${this.chefId}`;
    }

    openReviewModal() {
        const modal = document.getElementById('reviewModal');
        modal.classList.add('active');
        
        document.getElementById('reviewText').value = '';
        this.resetStarRating();
    }

    resetStarRating() {
        const stars = document.querySelectorAll('#starRating i');
        stars.forEach(star => {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        });
    }

    bindReviewModalEvents() {
        // Star rating
        const stars = document.querySelectorAll('#starRating i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                this.setStarRating(rating);
            });
            
            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.dataset.rating);
                this.highlightStars(rating);
            });
        });
        
        document.getElementById('starRating').addEventListener('mouseleave', () => {
            const currentRating = this.getCurrentRating();
            this.highlightStars(currentRating);
        });

        // Modal close
        document.getElementById('closeReviewModal').addEventListener('click', () => {
            this.closeReviewModal();
        });
        
        document.getElementById('cancelReview').addEventListener('click', () => {
            this.closeReviewModal();
        });

        // Submit review
        document.getElementById('submitReview').addEventListener('click', () => {
            this.submitReview();
        });
    }

    setStarRating(rating) {
        const stars = document.querySelectorAll('#starRating i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('#starRating i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    getCurrentRating() {
        const activeStars = document.querySelectorAll('#starRating i.active');
        return activeStars.length;
    }

    closeReviewModal() {
        const modal = document.getElementById('reviewModal');
        modal.classList.remove('active');
    }

    submitReview() {
        const rating = this.getCurrentRating();
        const comment = document.getElementById('reviewText').value.trim();
        
        if (rating === 0) {
            this.showNotification('Vui lòng chọn số sao đánh giá!');
            return;
        }
        
        if (!comment) {
            this.showNotification('Vui lòng nhập nội dung đánh giá!');
            return;
        }
        
        console.log('Submitting review:', { rating, comment });
        
        this.closeReviewModal();
        this.showNotification('Cảm ơn bạn đã đánh giá!');
        
        setTimeout(() => {
            this.renderReviews();
        }, 1000);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'chef-notification';
        notification.textContent = message;
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
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChefProfile();
});