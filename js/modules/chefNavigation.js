export class ChefNavigation {
    constructor() {
        this.chefsData = [];
        this.init();
    }

    // Khởi tạo
    async init() {
        await this.loadChefsData();
        this.bindChefClicks();
    }

    // Load dữ liệu từ JSON
    async loadChefsData() {
        try {
            const response = await fetch('../../data/chefsdata.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.chefsData = data.chefs || data;
            
        } catch (error) {
            console.error('Error loading chefs data:', error);
            this.chefsData = [];
        }
    }

    // Xử lý sự kiện click vào thẻ đầu bếp
    bindChefClicks() {
        document.addEventListener('click', (e) => {
            const chefCard = e.target.closest('.sidebar-right__chef');
            if (chefCard) {
                const chefId = parseInt(chefCard.getAttribute('data-chef-id'));
                this.navigateToChefProfile(chefId);
            }
        });
    }

    // Chuyển hướng đến trang hồ sơ
    navigateToChefProfile(chefId) {
        const chef = this.chefsData.find(c => c.id === chefId);
        
        if (chef) {
            sessionStorage.setItem('selectedChef', JSON.stringify(chef));
            window.location.href = './pages/chef-profile.html';
        } else {
            console.warn('Không tìm thấy dữ liệu đầu bếp với ID:', chefId);
        }
    }

    // Helper lấy dữ liệu đầu bếp
    getChefData(chefId) {
        return this.chefsData.find(c => c.id === chefId) || null;
    }
}