// js/pages/chef-profile.js
import { chefsData } from '../../data/chefsData.js'

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
        const sessionChefId = this.getChefFromSessionStorage();
        const urlChefId = this.getChefIdFromURL();
        
        this.chefId = sessionChefId || urlChefId;

        console.log('Session Chef ID:', sessionChefId);
        console.log('URL Chef ID:', urlChefId);
        console.log('Final Chef ID:', this.chefId);

        if (!this.chefId) {
            console.warn('Không tìm thấy chef ID, sử dụng ID mặc định 1');
            this.chefId = 1;
        }

        this.chef = chefsData.find(chef => chef.id === this.chefId);
        
        console.log('Found chef:', this.chef);

        if (!this.chef) {
            console.error('Không tìm thấy đầu bếp với ID:', this.chefId);
            window.location.href = 'famous-chef.html';
            return;
        }

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
        const coverImg = document.getElementById('chefCover');
        if (this.chef.coverImage) {
            coverImg.src = this.chef.coverImage;
        }

        const avatarImg = document.getElementById('chefAvatar');
        avatarImg.src = this.chef.avatar;
        avatarImg.alt = this.chef.name;

        const verifiedBadge = document.getElementById('chefVerified');
        if (this.chef.verified) {
            verifiedBadge.style.display = 'flex';
        }

        document.getElementById('chefName').textContent = this.chef.name;
        document.getElementById('chefSpecialty').textContent = this.chef.specialty;

        const badge = document.getElementById('chefBadge');
        if (this.chef.featured) {
            badge.style.display = 'block';
        }

        document.getElementById('chefBio').textContent = this.chef.bio;
        document.getElementById('chefBioFull').textContent = this.chef.bioFull || this.chef.bio;

        this.renderStars('chefStars', this.chef.rating);
        document.getElementById('chefRating').textContent = this.chef.rating;
        document.getElementById('chefReviewCount').textContent = `(${this.chef.reviewCount || '0'} đánh giá)`;

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
                    <div class="empty-state__icon">👨‍🍳</div>
                    <h3 class="empty-state__text">Chưa có công thức nào</h3>
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
                <div class="recipe-card__image">
                    <img src="${recipe.image}" alt="${recipe.title}" onerror="this.src='../assets/images/recipe-placeholder.jpg'">
                </div>
                <div class="recipe-card__info">
                    <h3 class="recipe-card__title">${recipe.title}</h3>
                    <div class="recipe-card__meta">
                        <div class="recipe-card__time">
                            <i class="far fa-clock"></i>
                            ${recipe.time}
                        </div>
                        <div class="recipe-card__difficulty">
                            <i class="fas fa-signal"></i>
                            ${recipe.difficulty}
                        </div>
                    </div>
                    <div class="recipe-card__rating">
                        ${stars}
                        <span>${recipe.rating}</span>
                    </div>
                    <p class="recipe-card__description">${recipe.description}</p>
                </div>
            </div>
        `;
    }

    renderAbout() {
        const expertiseTags = document.getElementById('expertiseTags');
        if (expertiseTags && this.chef.expertise) {
            expertiseTags.innerHTML = this.chef.expertise.map(exp => 
                `<span class="about__tag">${exp}</span>`
            ).join('');
        }

        const achievementsList = document.getElementById('achievementsList');
        if (achievementsList && this.chef.achievements) {
            achievementsList.innerHTML = this.chef.achievements.map(achievement => 
                `<li>${achievement}</li>`
            ).join('');
        }

        const contactInfo = document.getElementById('contactInfo');
        if (contactInfo) {
            contactInfo.innerHTML = this.createContactInfo();
        }
    }

    createContactInfo() {
        const contacts = [];
        
        if (this.chef.email) {
            contacts.push(`
                <div class="about__contact-item">
                    <div class="about__contact-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="about__contact-details">
                        <h4>Email</h4>
                        <p>${this.chef.email}</p>
                    </div>
                </div>
            `);
        }
        
        if (this.chef.website) {
            contacts.push(`
                <div class="about__contact-item">
                    <div class="about__contact-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div class="about__contact-details">
                        <h4>Website</h4>
                        <p>${this.chef.website}</p>
                    </div>
                </div>
            `);
        }
        
        if (this.chef.socialMedia) {
            Object.entries(this.chef.socialMedia).forEach(([platform, handle]) => {
                contacts.push(`
                    <div class="about__contact-item">
                        <div class="about__contact-icon">
                            <i class="fab fa-${platform}"></i>
                        </div>
                        <div class="about__contact-details">
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
                    <div class="empty-state__icon">💬</div>
                    <h3 class="empty-state__text">Chưa có đánh giá nào</h3>
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
            <div class="reviews__item">
                <div class="reviews__item-header">
                    <div class="reviews__user">
                        <img src="${review.user.avatar}" alt="${review.user.name}" class="reviews__user-avatar" onerror="this.src='../assets/images/avatar.png'">
                        <div class="reviews__user-info">
                            <h4>${review.user.name}</h4>
                            <div class="reviews__date">${review.date}</div>
                        </div>
                    </div>
                    <div class="reviews__item-rating">
                        ${stars}
                    </div>
                </div>
                <div class="reviews__content">
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
        document.querySelectorAll('.tabs__item').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        const followBtn = document.getElementById('followChefBtn');
        if (followBtn) {
            followBtn.addEventListener('click', () => {
                this.toggleFollow();
            });
        }

        const messageBtn = document.getElementById('messageChefBtn');
        if (messageBtn) {
            messageBtn.addEventListener('click', () => {
                this.messageChef();
            });
        }

        const shareBtn = document.getElementById('shareChefBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareChef();
            });
        }

        const writeReviewBtn = document.getElementById('writeReviewBtn');
        if (writeReviewBtn) {
            writeReviewBtn.addEventListener('click', () => {
                this.openReviewModal();
            });
        }

        this.bindReviewModalEvents();

        document.addEventListener('click', (e) => {
            const recipeCard = e.target.closest('.recipe-card');
            if (recipeCard) {
                const recipeId = recipeCard.dataset.recipeId;
                this.viewRecipe(recipeId);
            }
        });

        const backButton = document.getElementById('backToChefs');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = './famous-chef.html';
            });
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tabs__item').forEach(tab => {
            tab.classList.remove('tabs__item--active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('tabs__item--active');

        document.querySelectorAll('.chef-profile__panel').forEach(panel => {
            panel.classList.remove('chef-profile__panel--active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('chef-profile__panel--active');
    }

    toggleFollow() {
        if (!this.chef) return;

        this.chef.isFollowing = !this.chef.isFollowing;
        
        const followBtn = document.getElementById('followChefBtn');
        const followersCount = document.getElementById('statFollowers');
        
        if (this.chef.isFollowing) {
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i><span>Đang theo dõi</span>';
            
            const currentFollowers = this.parseFollowers(this.chef.followers);
            this.chef.followers = this.formatFollowers(currentFollowers + 1);
            followersCount.textContent = this.chef.followers;
            
            this.showNotification(`Đã theo dõi ${this.chef.name}`);
        } else {
            followBtn.classList.remove('following');
            followBtn.innerHTML = '<i class="fas fa-plus"></i><span>Theo dõi</span>';
            
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

        document.getElementById('closeReviewModal').addEventListener('click', () => {
            this.closeReviewModal();
        });
        
        document.getElementById('cancelReview').addEventListener('click', () => {
            this.closeReviewModal();
        });

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

document.addEventListener('DOMContentLoaded', () => {
    new ChefProfile();
});