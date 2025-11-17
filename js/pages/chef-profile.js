// js/pages/chef-profile.js
class ChefProfile {
    constructor() {
        this.chef = null;
        this.chefId = null;
        this.recipes = [];
        this.currentRecipePage = 1;
        this.recipesPerPage = 9;
        this.currentReviewPage = 1;
        this.reviewsPerPage = 5;
        
        this.init();
    }

    async init() {
        await this.loadChefData();
        await this.loadRecipesData();
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

    async loadChefData() {
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

        try {
            // Fetch chefs data from JSON file
            const response = await fetch('../../data/chefsdata.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.chef = data.chefs.find(chef => chef.id === this.chefId);
            
            console.log('Found chef:', this.chef);

            if (!this.chef) {
                console.error('Không tìm thấy đầu bếp với ID:', this.chefId);
                this.showError('Không tìm thấy thông tin đầu bếp');
                return;
            }

            sessionStorage.removeItem('selectedChef');
            
        } catch (error) {
            console.error('Error loading chef data:', error);
            this.showError('Không thể tải thông tin đầu bếp. Vui lòng thử lại sau.');
        }
    }

    async loadRecipesData() {
        try {
            // Fetch recipes data from JSON file
            const response = await fetch('../../data/recipe-details.data.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Lọc công thức theo chefId
            this.recipes = data.filter(recipe => {
                // Tìm recipe có chef trùng với tên đầu bếp hiện tại
                return recipe.chef === this.chef.name;
            });
            
            console.log(`Found ${this.recipes.length} recipes for chef ${this.chef.name}:`, this.recipes);
            
        } catch (error) {
            console.error('Error loading recipes data:', error);
            // Nếu không load được recipes, sử dụng mảng rỗng
            this.recipes = [];
        }
    }

    showError(message) {
        const container = document.querySelector('.chef-profile');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="
                    text-align: center;
                    padding: 60px 20px;
                    color: #666;
                ">
                    <i class="fas fa-exclamation-triangle" style="font-size: 64px; margin-bottom: 20px; color: #ff6b6b;"></i>
                    <h2 style="margin-bottom: 16px;">Đã xảy ra lỗi</h2>
                    <p style="margin-bottom: 24px; font-size: 16px;">${message}</p>
                    <button id="retryButton" class="btn-primary" style="margin-right: 12px;">
                        Thử lại
                    </button>
                    <button id="backButton" class="btn-secondary">
                        Quay lại
                    </button>
                </div>
            `;

            // Add retry functionality
            document.getElementById('retryButton').addEventListener('click', () => {
                this.loadChefData().then(() => {
                    if (this.chef) {
                        this.renderChefProfile();
                    }
                });
            });

            // Add back button functionality
            document.getElementById('backButton').addEventListener('click', () => {
                window.location.href = './famous-chef.html';
            });
        }
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
        if (coverImg && this.chef.coverImage) {
            coverImg.src = this.chef.coverImage;
            coverImg.onerror = () => {
                coverImg.src = '../../assets/images/cover-placeholder.jpg';
            };
        }

        const avatarImg = document.getElementById('chefAvatar');
        if (avatarImg) {
            avatarImg.src = this.chef.avatar;
            avatarImg.alt = this.chef.name;
            avatarImg.onerror = () => {
                avatarImg.src = '../../assets/images/avatar-placeholder.jpg';
            };
        }

        const verifiedBadge = document.getElementById('chefVerified');
        if (verifiedBadge && this.chef.verified) {
            verifiedBadge.style.display = 'flex';
        }

        const chefName = document.getElementById('chefName');
        if (chefName) chefName.textContent = this.chef.name;

        const chefSpecialty = document.getElementById('chefSpecialty');
        if (chefSpecialty) chefSpecialty.textContent = this.chef.specialty;

        const badge = document.getElementById('chefBadge');
        if (badge && this.chef.featured) {
            badge.style.display = 'block';
        }

        const chefBio = document.getElementById('chefBio');
        if (chefBio) chefBio.textContent = this.chef.bio;

        const chefBioFull = document.getElementById('chefBioFull');
        if (chefBioFull) chefBioFull.textContent = this.chef.bioFull || this.chef.bio;

        this.renderStars('chefStars', this.chef.rating);
        
        const chefRating = document.getElementById('chefRating');
        if (chefRating) chefRating.textContent = this.chef.rating;

        const chefReviewCount = document.getElementById('chefReviewCount');
        if (chefReviewCount) chefReviewCount.textContent = `(${this.chef.reviewCount || '0'} đánh giá)`;

        const followBtn = document.getElementById('followChefBtn');
        if (followBtn && this.chef.isFollowing) {
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i><span>Đang theo dõi</span>';
        }
    }

    renderStats() {
        const statRecipes = document.getElementById('statRecipes');
        if (statRecipes) statRecipes.textContent = this.recipes.length; // Sử dụng số lượng công thức thực tế

        const statFollowers = document.getElementById('statFollowers');
        if (statFollowers) statFollowers.textContent = this.chef.followers;

        const statFollowing = document.getElementById('statFollowing');
        if (statFollowing) statFollowing.textContent = this.chef.following || '0';

        const statExperience = document.getElementById('statExperience');
        if (statExperience) statExperience.textContent = this.chef.experience;
    }

    renderRecipes() {
        const recipesGrid = document.getElementById('recipesGrid');
        if (!recipesGrid) return;

        if (this.recipes.length === 0) {
            recipesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state__icon">👨‍🍳</div>
                    <h3 class="empty-state__text">Chưa có công thức nào</h3>
                    <p>Đầu bếp này chưa đăng tải công thức nào.</p>
                </div>
            `;
            return;
        }

        // Hiển thị công thức theo trang
        const startIndex = (this.currentRecipePage - 1) * this.recipesPerPage;
        const endIndex = startIndex + this.recipesPerPage;
        const recipesToShow = this.recipes.slice(startIndex, endIndex);

        recipesGrid.innerHTML = recipesToShow.map(recipe => this.createRecipeCard(recipe)).join('');
        
        this.updateRecipePagination();
    }

    createRecipeCard(recipe) {
        // Tạo rating mặc định nếu không có
        const rating = recipe.rating || 4.5;
        const stars = this.generateStars(rating);
        
        return `
            <div class="recipe-card" data-recipe-id="${recipe.id}">
                <div class="recipe-card__image">
                    <img src="${recipe.img}" alt="${recipe.name}" onerror="this.src='../../assets/images/recipe-placeholder.jpg'">
                </div>
                <div class="recipe-card__info">
                    <h3 class="recipe-card__title">${recipe.name}</h3>
                    <div class="recipe-card__meta">
                        <div class="recipe-card__time">
                            <i class="far fa-clock"></i>
                            ${recipe.time}
                        </div>
                        <div class="recipe-card__difficulty">
                            <i class="fas fa-signal"></i>
                            ${recipe.difficulty || 'Trung bình'}
                        </div>
                    </div>
                    <div class="recipe-card__rating">
                        ${stars}
                        <span>${rating}</span>
                    </div>
                    <p class="recipe-card__description">${recipe.short || recipe.description || 'Công thức ngon và dễ làm'}</p>
                    <div class="recipe-card__tags">
                        ${recipe.tags ? recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
        `;
    }

    updateRecipePagination() {
        const loadMoreBtn = document.getElementById('loadMoreRecipes');
        if (!loadMoreBtn) return;
        
        const totalRecipes = this.recipes.length;
        const currentlyShowing = this.currentRecipePage * this.recipesPerPage;
        
        if (currentlyShowing >= totalRecipes) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
        }
    }

    loadMoreRecipes() {
        this.currentRecipePage++;
        this.renderRecipes();
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
        
        if (averageRating) averageRating.textContent = avgRating;
        if (totalReviews) totalReviews.textContent = `${sampleReviews.length} đánh giá`;
        
        this.renderStars('averageStars', parseFloat(avgRating));
        
        if (!reviewsList) return;
        
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
                    avatar: "../../assets/images/avatar-user1.jpg"
                },
                rating: 5,
                comment: "Đầu bếp rất tài năng! Các công thức rất dễ làm theo và thành phẩm rất ngon.",
                date: "2 ngày trước"
            },
            {
                id: 2,
                user: {
                    name: "Trần Thị B",
                    avatar: "../../assets/images/avatar-user2.jpg"
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
                        <img src="${review.user.avatar}" alt="${review.user.name}" class="reviews__user-avatar" onerror="this.src='../../assets/images/avatar.png'">
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

        // Load more recipes button
        const loadMoreRecipesBtn = document.getElementById('loadMoreRecipes');
        if (loadMoreRecipesBtn) {
            loadMoreRecipesBtn.addEventListener('click', () => {
                this.loadMoreRecipes();
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
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('tabs__item--active');
        }

        document.querySelectorAll('.chef-profile__panel').forEach(panel => {
            panel.classList.remove('chef-profile__panel--active');
        });
        
        const activePanel = document.getElementById(`${tabName}-tab`);
        if (activePanel) {
            activePanel.classList.add('chef-profile__panel--active');
        }
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
            if (followersCount) followersCount.textContent = this.chef.followers;
            
            this.showNotification(`Đã theo dõi ${this.chef.name}`);
        } else {
            followBtn.classList.remove('following');
            followBtn.innerHTML = '<i class="fas fa-plus"></i><span>Theo dõi</span>';
            
            const currentFollowers = this.parseFollowers(this.chef.followers);
            this.chef.followers = this.formatFollowers(Math.max(0, currentFollowers - 1));
            if (followersCount) followersCount.textContent = this.chef.followers;
            
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
        // Tìm công thức trong danh sách
        const recipe = this.recipes.find(r => r.id == recipeId);
        if (recipe) {
            // Lưu thông tin công thức vào sessionStorage để sử dụng ở trang chi tiết
            sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        }
        window.location.href = `recipe-detail.html?id=${recipeId}&chef=${this.chefId}`;
    }

    openReviewModal() {
        const modal = document.getElementById('reviewModal');
        if (modal) {
            modal.classList.add('active');
            
            const reviewText = document.getElementById('reviewText');
            if (reviewText) reviewText.value = '';
            
            this.resetStarRating();
        }
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
        
        const starRating = document.getElementById('starRating');
        if (starRating) {
            starRating.addEventListener('mouseleave', () => {
                const currentRating = this.getCurrentRating();
                this.highlightStars(currentRating);
            });
        }

        const closeReviewModal = document.getElementById('closeReviewModal');
        if (closeReviewModal) {
            closeReviewModal.addEventListener('click', () => {
                this.closeReviewModal();
            });
        }
        
        const cancelReview = document.getElementById('cancelReview');
        if (cancelReview) {
            cancelReview.addEventListener('click', () => {
                this.closeReviewModal();
            });
        }

        const submitReview = document.getElementById('submitReview');
        if (submitReview) {
            submitReview.addEventListener('click', () => {
                this.submitReview();
            });
        }
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
        if (modal) {
            modal.classList.remove('active');
        }
    }

    submitReview() {
        const rating = this.getCurrentRating();
        const reviewText = document.getElementById('reviewText');
        const comment = reviewText ? reviewText.value.trim() : '';
        
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