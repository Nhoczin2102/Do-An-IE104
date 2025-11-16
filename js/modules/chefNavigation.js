import { chefsData } from '../../data/chefsData.js';

export class ChefNavigation {
    constructor() {
        this.chefsData = chefsData;
        this.init();
    }

    init() {
        this.bindChefClicks();
        console.log('👨‍🍳 Chef Navigation initialized');
    }

    bindChefClicks() {
        // Lắng nghe click trên các chef card
        document.addEventListener('click', (e) => {
            const chefCard = e.target.closest('.sidebar-right__chef');
            if (chefCard) {
                const chefId = parseInt(chefCard.getAttribute('data-chef-id'));
                this.navigateToChefProfile(chefId);
            }
        });
    }

    navigateToChefProfile(chefId) {
        const chef = this.chefsData.find(c => c.id === chefId);
        
        if (chef) {
            // Lưu thông tin chef vào sessionStorage để trang chef-profile có thể sử dụng
            sessionStorage.setItem('selectedChef', JSON.stringify(chef));
            
            // Chuyển hướng đến trang chef-profile
            window.location.href = './pages/chef-profile.html';
        } else {
            console.warn('Chef not found with ID:', chefId);
        }
    }

    // Phương thức để lấy thông tin chef (có thể sử dụng ở nơi khác)
    getChefData(chefId) {
        return this.chefsData.find(c => c.id === chefId) || null;
    }
}